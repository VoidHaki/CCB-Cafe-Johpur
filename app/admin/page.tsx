import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { generateCode } from './admin-actions'
import AdminNotifier from '../components/AdminNotifier'
import AdminCodeRequestNotifier from '../components/AdminCodeRequestNotifier'
import BulkCodeGenerator from '../components/BulkCodeGenerator'
import ActiveCodesPanel from '../components/ActiveCodesPanel'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value

  if (!userId) redirect('/login')

  const supabase = await createClient()
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()

  if (user?.email?.trim().toLowerCase() !== 'premsingh.ccd11@gmail.com') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" style={{ background: '#EEF2F7' }}>
        <div className="text-center p-12 rounded-2xl bg-white border-2 shadow-lg" style={{ borderColor: '#C8102E' }}>
          <div className="text-5xl mb-4">🚫</div>
          <p className="font-black text-2xl" style={{ color: '#C8102E', fontFamily: 'Georgia, serif' }}>Access Denied.</p>
          <a href="/" className="mt-4 inline-block text-sm font-bold" style={{ color: '#6B7FA3' }}>← Return to Home</a>
        </div>
      </div>
    )
  }

  const { data: activeCodes } = await supabase
    .from('codes')
    .select('*')
    .eq('is_claimed', false)
    .order('created_at', { ascending: false })

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count: claimedThisMonth } = await supabase
    .from('codes')
    .select('*', { count: 'exact', head: true })
    .eq('is_claimed', true)
    .gte('created_at', firstDayOfMonth)

  const { data: ticketHistory } = await supabase
    .from('tickets')
    .select('*, users(email)')
    .eq('is_used', true)
    .order('created_at', { ascending: false })
    .limit(50)

  const { count: initialTickets } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })

  const { count: totalActive } = await supabase
    .from('codes')
    .select('*', { count: 'exact', head: true })
    .eq('is_claimed', false)

  return (
    <>
      <AdminNotifier initialTicketCount={initialTickets || 0} />
      <AdminCodeRequestNotifier />

      <div style={{ background: '#EEF2F7', minHeight: '100vh' }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">

            {/* ── HEADER STRIP ── */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 rounded-2xl p-8 text-white shadow-xl" style={{ background: '#1A2B4B' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.12)' }}>👑</div>
                  <div>
                    <h1 className="font-black text-2xl uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                      CCB Rewards Admin Portal
                    </h1>
                    <p className="text-sm opacity-50">Manage codes, rewards &amp; track redemptions</p>
                  </div>
                </div>
                <a href="/" className="text-sm font-semibold opacity-50 hover:opacity-100 transition-opacity hover:underline underline-offset-4">
                  ← Back to Rewards Wallet
                </a>
              </div>

              <div className="flex gap-4 sm:flex-col">
                <div className="flex-1 flex items-center justify-center rounded-2xl p-5 text-center text-white shadow-xl"
                  style={{ background: '#C8102E', minWidth: '140px' }}>
                  <div>
                    <p className="font-black text-4xl" style={{ fontFamily: 'Georgia, serif' }}>{claimedThisMonth || 0}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest font-bold opacity-80">Claimed This Month</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center rounded-2xl p-5 text-center shadow-xl"
                  style={{ background: 'white', minWidth: '140px' }}>
                  <div>
                    <p className="font-black text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A2B4B' }}>{totalActive || 0}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest font-bold" style={{ color: '#6B7FA3' }}>Active Codes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid gap-8 lg:grid-cols-12 items-start">

              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-2xl border-2 bg-white p-8 shadow-sm" style={{ borderColor: '#D1DCF0' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: '#FEF2F2' }}>✏️</div>
                    <div>
                      <h2 className="font-black text-xl uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>Custom Code</h2>
                      <p className="text-xs" style={{ color: '#6B7FA3' }}>Create a specific promo code</p>
                    </div>
                  </div>
                  <form action={generateCode} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#6B7FA3' }}>Code</label>
                      <input type="text" name="customCode" placeholder="e.g., VIP-JOHPUR" required
                        className="w-full rounded-xl border-2 px-4 py-3.5 font-mono uppercase tracking-widest text-sm outline-none"
                        style={{ borderColor: '#D1DCF0', background: '#F5F8FF', color: '#1A2B4B' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#6B7FA3' }}>Coins</label>
                        <input type="number" name="coinValue" placeholder="50" min="1" max="1000000" required
                          className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none"
                          style={{ borderColor: '#D1DCF0', background: '#F5F8FF', color: '#1A2B4B' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#6B7FA3' }}>Days Valid</label>
                        <input type="number" name="daysValid" defaultValue="30" min="1" max="365" required
                          className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none"
                          style={{ borderColor: '#D1DCF0', background: '#F5F8FF', color: '#1A2B4B' }} />
                      </div>
                    </div>
                    <button type="submit"
                      className="w-full rounded-xl py-3.5 font-black text-white text-sm uppercase tracking-wide transition-all hover:opacity-80"
                      style={{ background: '#C8102E' }}>
                      + Add Promo Code
                    </button>
                  </form>
                </div>

                <BulkCodeGenerator />
                <ActiveCodesPanel initialCodes={activeCodes || []} />
              </div>

              <div className="rounded-2xl border-2 bg-white p-8 shadow-sm lg:col-span-7" style={{ borderColor: '#D1DCF0' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#C8102E' }}>
                    <span className="text-white text-sm">🎟️</span>
                  </div>
                  <div>
                    <h2 className="font-black text-xl uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>Redemption History Log</h2>
                    <p className="text-xs" style={{ color: '#6B7FA3' }}>Items handed out at the counter</p>
                  </div>
                </div>

                <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-3 rounded-xl mt-5 mb-3 text-xs font-black uppercase tracking-widest"
                  style={{ background: '#1A2B4B', color: 'white' }}>
                  <span>Date &amp; Time</span>
                  <span>Item</span>
                  <span>User Email</span>
                  <span>Status</span>
                </div>

                <div className="space-y-1 max-h-[680px] overflow-y-auto pr-1">
                  {ticketHistory?.map((ticket) => (
                    <div key={ticket.id}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center border-b py-3 px-2 last:border-0 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                      style={{ borderColor: '#E2E8F0' }}>
                      <p className="text-xs" style={{ color: '#6B7FA3' }}>
                        {new Date(ticket.created_at).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                      <p className="font-bold text-sm" style={{ color: '#1A2B4B' }}>{ticket.reward_name}</p>
                      <p className="text-xs truncate" style={{ color: '#6B7FA3' }}>{ticket.users?.email}</p>
                      <span className="inline-block rounded-full px-3 py-1 text-xs font-black text-white w-fit"
                        style={{ background: '#C8102E' }}>Claimed</span>
                    </div>
                  ))}

                  {(!ticketHistory || ticketHistory.length === 0) && (
                    <div className="rounded-xl border-2 border-dashed p-10 text-center mt-4" style={{ borderColor: '#D1DCF0' }}>
                      <p className="text-3xl mb-2">📋</p>
                      <p className="font-bold" style={{ color: '#6B7FA3' }}>No rewards claimed yet.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}