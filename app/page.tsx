import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import RedeemForm from './components/RedeemForm'
import AnimatedWallet from './components/AnimatedWallet'
import RequestCodeButton from './components/RequestCodeButton'

export default async function HomePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value

  if (!userId) redirect('/login')

  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('coin_balance, lifetime_coins, email')
    .eq('id', userId)
    .single()

  if (!user) redirect('/login')

  return (
    <div style={{ background: '#EEF2F7', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Decorative coffee beans bg */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='40' cy='40' rx='25' ry='15' stroke='%231A2B4B' stroke-width='3' fill='none' transform='rotate(-30 40 40)'/%3E%3Cline x1='40' y1='25' x2='40' y2='55' stroke='%231A2B4B' stroke-width='2' transform='rotate(-30 40 40)'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }} />

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Left: Text */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="font-black leading-[1.0] tracking-tight uppercase" style={{
                color: '#1A2B4B',
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)'
              }}>
                A CUP OF<br/>COFFEE MAKES<br/>EVERYTHING<br/>BETTER
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed" style={{ color: '#6B7FA3' }}>
                Welcome to Café Coffee Break, your professional rewards program. Collect codes from your CCB cups, earn coins, and redeem amazing rewards!
              </p>

              <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a href="#redeem-section" className="rounded-full px-8 py-4 text-center font-black text-white text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl uppercase tracking-wide" style={{ background: '#1A2B4B' }}>
                  Redeem a Code →
                </a>
                <a href="/marketplace" className="rounded-full border-2 px-8 py-4 text-center font-black text-sm transition-all hover:shadow-md uppercase tracking-wide hover:bg-[#1A2B4B] hover:text-white" style={{ borderColor: '#1A2B4B', color: '#1A2B4B' }}>
                  View Rewards
                </a>
              </div>
            </div>

            {/* Right: Wallet Card */}
            <div className="flex w-full justify-center lg:justify-end">
              <AnimatedWallet
                currentCoins={user.coin_balance}
                lifetimeCoins={user.lifetime_coins || 0}
                email={user.email}
              />
            </div>

          </div>
        </div>
      </section>

      {/* REDEEM SECTION */}
      <section id="redeem-section" className="w-full" style={{ background: 'white' }}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#C8102E', borderColor: '#C8102E', background: 'rgba(200,16,46,0.05)' }}>
              🎟️ Code Redemption
            </span>
            <h2 className="font-black uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Redeem Your Code
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

            {/* Redemption Form Card */}
            <div className="rounded-2xl border-2 p-8 shadow-lg" style={{ background: 'white', borderColor: '#D1DCF0' }}>
              <RedeemForm />
              <RequestCodeButton />
            </div>

            {/* How It Works Card */}
            <div className="rounded-2xl border-2 p-8" style={{ background: '#F5F8FF', borderColor: '#D1DCF0' }}>
              <h3 className="mb-8 font-black uppercase tracking-tight text-xl" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>How It Works</h3>
              <div className="space-y-7">
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl shadow-sm font-black" style={{ background: '#1A2B4B', color: 'white' }}>
                    🔍
                  </div>
                  <div>
                    <h4 className="font-black text-base" style={{ color: '#1A2B4B' }}>Step 1: Find Your Code</h4>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6B7FA3' }}>Look for unique codes printed on your CCB cups or physical receipts.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl shadow-sm" style={{ background: '#C8102E', color: 'white' }}>
                    ✨
                  </div>
                  <div>
                    <h4 className="font-black text-base" style={{ color: '#1A2B4B' }}>Step 2: Earn &amp; Track</h4>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6B7FA3' }}>Watch your VIP progress bar fill up instantly as you claim your coins!</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}