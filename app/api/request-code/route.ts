import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  await supabase.from('code_requests').insert([{
    user_id: userId,
    user_email: user?.email ?? 'Unknown',
    is_handled: false,
    created_at: new Date().toISOString(),
  }])

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('code_requests')
    .select('*')
    .eq('is_handled', false)
    .order('created_at', { ascending: false })

  return NextResponse.json({ requests: data ?? [] })
}

export async function PATCH(request: Request) {
  const { id } = await request.json()
  const supabase = await createClient()
  await supabase.from('code_requests').update({ is_handled: true }).eq('id', id)
  return NextResponse.json({ ok: true })
}