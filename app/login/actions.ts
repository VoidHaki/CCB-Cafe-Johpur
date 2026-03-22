'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return

  const supabase = await createClient()

  // 1. Check if this email is already in your database
  let { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  // 2. If they are a brand new customer, create an account for them with 0 coins
  if (!user) {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ email: email, coin_balance: 0 }])
      .select('id')
      .single()
      
    if (error) {
      console.error('Error creating user:', error.message)
      return redirect('/login?error=Could not create account')
    }
    user = newUser
  }

  // 3. Log them in by saving their ID in a secure cookie
  const cookieStore = await cookies()
  cookieStore.set('cafe_user_id', user.id)

  // 4. Send them straight to the beautiful new homepage
  redirect('/')
}