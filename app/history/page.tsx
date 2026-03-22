import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function HistoryPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value

  if (!userId) redirect('/login')

  const supabase = await createClient()

  const { data: tickets } = await supabase.from('tickets').select('*').eq('user_id', userId)
  const { data: claimedCodes } = await supabase.from('claimed_codes').select('*, codes(code_string, coin_value)').eq('user_id', userId)

  const combinedHistory = [
    ...(tickets?.map(t => ({
      id: t.id,
      type: 'SPENT',
      title: t.reward_name,
      amount: null,
      date: new Date(t.created_at)
    })) || []),
    ...(claimedCodes?.map(c => ({
      id: c.id,
      type: 'EARNED',
      title: `Claimed Code: ${c.codes?.code_string}`,
      amount: c.codes?.coin_value,
      date: new Date(c.created_at)
    })) || [])
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div style={{ background: '#EEF2F7', minHeight: '100vh' }}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-black text-4xl uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>My Activity</h1>
            <p className="mt-2 text-sm" style={{ color: '#6B7FA3' }}>Your complete earning and spending history.</p>
          </div>
          <a href="/" className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-80" style={{ background: '#1A2B4B' }}>
            ← Back Home
          </a>
        </div>

        <div className="rounded-2xl border-2 bg-white p-8 shadow-lg sm:p-12" style={{ borderColor: '#D1DCF0' }}>

          {combinedHistory.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#6B7FA3' }}>
              <p className="text-4xl mb-4">📭</p>
              <p className="font-bold text-lg" style={{ color: '#1A2B4B' }}>No activity yet!</p>
              <p className="text-sm mt-1">Redeem your first code on the homepage to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-200 before:to-transparent">

              {combinedHistory.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                  {/* Timeline Icon - Coffee bean style */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md text-sm`}
                    style={{
                      background: item.type === 'EARNED' ? '#1A2B4B' : '#C8102E',
                      color: 'white'
                    }}>
                    {item.type === 'EARNED' ? '✦' : '☕'}
                  </div>

                  {/* Timeline Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border-2 bg-white p-4 shadow-sm transition hover:shadow-md" style={{ borderColor: '#D1DCF0' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={item.type === 'EARNED'
                          ? { background: 'rgba(26,43,75,0.1)', color: '#1A2B4B' }
                          : { background: 'rgba(200,16,46,0.1)', color: '#C8102E' }
                        }
                      >
                        {item.type}
                      </span>
                      <time className="text-xs font-medium" style={{ color: '#6B7FA3' }}>{item.date.toLocaleDateString()}</time>
                    </div>
                    <h3 className="font-black text-base mt-1" style={{ color: '#1A2B4B' }}>{item.title}</h3>
                    {item.type === 'EARNED' && (
                      <p className="text-sm font-black mt-1" style={{ color: '#1A2B4B' }}>+{item.amount} Coins</p>
                    )}
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}