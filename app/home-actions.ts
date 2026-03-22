'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function claimCoffeeCode(formData: FormData) {
  const codeInput = formData.get('code') as string
  if (!codeInput) return { success: false, message: "Please enter a code." }

  const cleanCode = codeInput.toUpperCase().trim().replace(/\s+/g, '-')

  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value
  if (!userId) return { success: false, message: "You must be logged in." }

  const supabase = await createClient()

  // ══════════════════════════════════════════════════════════════════════════
  // THE FIX: Single atomic UPDATE with WHERE is_claimed = false
  //
  // OLD (buggy) approach:
  //   1. SELECT code WHERE code_string = X          ← reads is_claimed = false
  //   2. [user B claims the same code right here]   ← race condition!
  //   3. UPDATE code SET is_claimed = true           ← overwrites B's claim!
  //   Result: both users get coins for the same code ❌
  //
  // NEW (safe) approach:
  //   1. UPDATE code SET is_claimed = true
  //      WHERE code_string = X AND is_claimed = false
  //   If 0 rows updated → code was already claimed. Done. ✅
  //   This is atomic at the database level — no race condition possible.
  // ══════════════════════════════════════════════════════════════════════════

  const now = new Date().toISOString()

  const { data: claimedCode, error: updateError } = await supabase
    .from('codes')
    .update({ is_claimed: true })
    .eq('code_string', cleanCode)
    .eq('is_claimed', false)          // ← ATOMIC: only proceeds if still unclaimed
    .select('id, coin_value, expires_at')
    .single()

  // If update matched 0 rows, figure out why
  if (updateError || !claimedCode) {
    const { data: lookup } = await supabase
      .from('codes')
      .select('is_claimed, expires_at')
      .eq('code_string', cleanCode)
      .single()

    if (!lookup) {
      return { success: false, message: "Invalid promo code. Please check for typos!" }
    }
    if (lookup.is_claimed) {
      return { success: false, message: "This code has already been claimed!" }
    }
    if (lookup.expires_at && new Date(lookup.expires_at) < new Date()) {
      return { success: false, message: "Uh oh! This code has expired." }
    }
    return { success: false, message: "Could not claim this code. Please try again." }
  }

  // Check expiry AFTER atomic claim (codes without expiry field pass through)
  if (claimedCode.expires_at && new Date(claimedCode.expires_at) < new Date()) {
    // Revert — code was expired but still unclaimed in DB
    await supabase.from('codes').update({ is_claimed: false }).eq('id', claimedCode.id)
    return { success: false, message: "Uh oh! This code has expired." }
  }

  // Prevent same user claiming same code twice (extra safety layer)
  const { data: alreadyRecorded } = await supabase
    .from('claimed_codes')
    .select('id')
    .eq('user_id', userId)
    .eq('code_id', claimedCode.id)
    .maybeSingle()  // won't error if 0 rows

  if (alreadyRecorded) {
    // Revert the atomic claim
    await supabase.from('codes').update({ is_claimed: false }).eq('id', claimedCode.id)
    return { success: false, message: "You have already claimed this code!" }
  }

  // ── Award coins ────────────────────────────────────────────────────────────
  const { data: userData } = await supabase
    .from('users')
    .select('coin_balance, lifetime_coins')
    .eq('id', userId)
    .single()

  if (!userData) {
    // Revert claim if user fetch fails
    await supabase.from('codes').update({ is_claimed: false }).eq('id', claimedCode.id)
    return { success: false, message: "Account error. Please try again." }
  }

  const [coinsResult, historyResult] = await Promise.all([
    // Add coins to wallet
    supabase
      .from('users')
      .update({
        coin_balance: userData.coin_balance + claimedCode.coin_value,
        lifetime_coins: (userData.lifetime_coins || 0) + claimedCode.coin_value,
      })
      .eq('id', userId),

    // Record in history table
    supabase.from('claimed_codes').insert([{
      user_id: userId,
      code_id: claimedCode.id,
      created_at: now,
    }]),
  ])

  if (coinsResult.error) {
    console.error('Failed to award coins:', coinsResult.error.message)
    // Revert claim
    await supabase.from('codes').update({ is_claimed: false }).eq('id', claimedCode.id)
    return { success: false, message: "Failed to award coins. Please try again." }
  }

  revalidatePath('/')

  return {
    success: true,
    message: `Success! ${claimedCode.coin_value} coins added to your wallet! 🎉`,
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('cafe_user_id')
  redirect('/login')
}