'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function redeemReward(formData: FormData) {
  const cost = parseInt(formData.get('cost') as string)
  const itemName = formData.get('itemName') as string
  
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value
  if (!userId) return

  const supabase = await createClient()

  const { data: user } = await supabase.from('users').select('coin_balance').eq('id', userId).single()
  if (!user) return

  if (user.coin_balance >= cost) {
    // 1. Deduct the coins
    await supabase.from('users').update({ coin_balance: user.coin_balance - cost }).eq('id', userId)

    // 2. Create the digital ticket for the barista!
    await supabase.from('tickets').insert([{
      user_id: userId,
      reward_name: itemName,
      is_used: false
    }])

    revalidatePath('/marketplace')
    revalidatePath('/')
  }
}

// NEW: Function to tap and use the ticket at the counter
export async function useTicketAtCounter(formData: FormData) {
  const ticketId = formData.get('ticketId') as string
  if (!ticketId) return

  const supabase = await createClient()
  
  // Mark the ticket as used so it disappears
  await supabase.from('tickets').update({ is_used: true }).eq('id', ticketId)

  revalidatePath('/marketplace')
}