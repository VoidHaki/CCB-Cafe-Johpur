'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Single code generator (existing) ──────────────────────────
export async function generateCode(formData: FormData) {
  const rawCoinValue = formData.get('coinValue') as string
  let coinValue = parseInt(rawCoinValue)
  let daysValid = parseInt(formData.get('daysValid') as string)

  if (isNaN(coinValue) || coinValue < 1) return
  if (isNaN(daysValid) || daysValid < 1) daysValid = 30
  if (coinValue > 1000000) coinValue = 1000000

  let customCode = formData.get('customCode') as string
  if (!customCode) return
  customCode = customCode.toUpperCase().trim().replace(/\s+/g, '-')

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + daysValid)

  const supabase = await createClient()
  const { error } = await supabase.from('codes').upsert({
    code_string: customCode,
    coin_value: coinValue,
    is_claimed: false,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString()
  }, { onConflict: 'code_string' })

  if (error) console.error(`Database Error: ${error.message}`)
  revalidatePath('/admin')
}

// ── Bulk code generator (NEW) ──────────────────────────────────
function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    if (i === 3) result += '-'
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export async function bulkGenerateCodes(formData: FormData) {
  const count = Math.min(parseInt(formData.get('count') as string) || 1, 100)
  let coinValue = Math.min(parseInt(formData.get('coinValue') as string) || 0, 1000000)
  const daysValid = parseInt(formData.get('daysValid') as string) || 30

  if (isNaN(coinValue) || coinValue < 1) return { error: 'Invalid coin value' }
  if (isNaN(count) || count < 1) return { error: 'Invalid count' }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + daysValid)

  const supabase = await createClient()

  const codeStrings = new Set<string>()
  while (codeStrings.size < count) {
    codeStrings.add(generateRandomCode())
  }

  const codes = Array.from(codeStrings).map(code => ({
    code_string: code,
    coin_value: coinValue,
    is_claimed: false,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString()
  }))

  const { error } = await supabase.from('codes').insert(codes)
  if (error) {
    console.error('Bulk insert error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true, count, codes: codes.map(c => c.code_string) }
}

// ── Delete a single code (NEW) ─────────────────────────────────
export async function deleteCode(formData: FormData) {
  const codeId = formData.get('codeId') as string
  if (!codeId) return
  const supabase = await createClient()
  const { error } = await supabase.from('codes').delete().eq('id', codeId)
  if (error) console.error('Delete error:', error.message)
  revalidatePath('/admin')
}

// ── Check new tickets (existing) ──────────────────────────────
export async function checkNewTickets(currentTicketCount: number) {
  const supabase = await createClient()
  const { count } = await supabase.from('tickets').select('*', { count: 'exact', head: true })
  if (count !== null && count > currentTicketCount) return count
  return false
}