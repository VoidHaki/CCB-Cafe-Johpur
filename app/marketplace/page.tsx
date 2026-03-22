import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { useTicketAtCounter } from './market-actions'
import AnimatedMarketGrid from '../components/AnimatedMarketGrid'

export default async function MarketplacePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value

  if (!userId) redirect('/login')

  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('coin_balance, lifetime_coins')
    .eq('id', userId)
    .single()

  const { data: rewards } = await supabase.from('rewards').select('*').order('coin_cost', { ascending: true })

  const { data: activeTickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', userId)
    .eq('is_used', false)
    .order('created_at', { ascending: false })

  if (!user) redirect('/login')

  const isDiamond = (user?.lifetime_coins || 0) >= 1000

  return (
    <div style={{ background: '#EEF2F7', minHeight: '100vh' }}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">

          {/* Header Strip */}
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl p-8 text-white shadow-xl sm:flex-row" style={{ background: '#1A2B4B' }}>
            <div className="text-center sm:text-left">
              <h1 className="font-black text-3xl uppercase tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Rewards Menu</h1>
              <a href="/" className="mt-2 inline-block text-sm opacity-60 hover:opacity-100 transition-opacity hover:underline underline-offset-4">← Back to Wallet</a>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Available Coins</p>
              <p className="font-black text-5xl text-white" style={{ fontFamily: 'Georgia, serif' }}>{user.coin_balance.toLocaleString()}</p>
            </div>
          </div>

          {/* ACTIVE TICKETS */}
          {activeTickets && activeTickets.length > 0 && (
            <div className="rounded-2xl border-2 bg-white p-8 shadow-md" style={{ borderColor: '#C8102E' }}>
              <h2 className="mb-6 font-black text-2xl uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>🎟️ Show this to the Barista!</h2>
              <div className="space-y-4">
                {activeTickets.map(ticket => (
                  <div key={ticket.id} className="flex flex-col items-center justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:px-6" style={{ borderColor: '#D1DCF0', background: '#F5F8FF' }}>
                    <span className="text-lg font-black" style={{ color: '#1A2B4B' }}>{ticket.reward_name}</span>
                    <form action={useTicketAtCounter}>
                      <input type="hidden" name="ticketId" value={ticket.id} />
                      <button type="submit" className="whitespace-nowrap rounded-xl px-6 py-3 font-bold text-white text-sm transition hover:opacity-80 uppercase tracking-wide" style={{ background: '#C8102E' }}>
                        Tap to Use at Counter
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANIMATED GRID */}
          <AnimatedMarketGrid
            rewards={rewards || []}
            userCoins={user.coin_balance}
            isDiamond={isDiamond}
          />

        </div>
      </div>
    </div>
  )
}