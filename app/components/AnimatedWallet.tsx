'use client'

import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { logout } from '../home-actions'

export default function AnimatedWallet({ currentCoins, lifetimeCoins, email }: { currentCoins: number, lifetimeCoins: number, email: string }) {

  // VIP TIER LOGIC
  let tier = 'Bronze Member'
  let tierBadgeStyle = { background: '#CD7F32', color: 'white' }
  let nextGoal = 200
  let progressColor = '#CD7F32'

  if (lifetimeCoins >= 1000) {
    tier = 'Diamond VIP'
    tierBadgeStyle = { background: '#C8102E', color: 'white' }
    nextGoal = 5000
    progressColor = '#C8102E'
  } else if (lifetimeCoins >= 500) {
    tier = 'Gold Member'
    tierBadgeStyle = { background: '#F59E0B', color: 'white' }
    nextGoal = 1000
    progressColor = '#F59E0B'
  } else if (lifetimeCoins >= 200) {
    tier = 'Silver Member'
    tierBadgeStyle = { background: '#9CA3AF', color: 'white' }
    nextGoal = 500
    progressColor = '#9CA3AF'
  }

  const progressPercentage = Math.min((lifetimeCoins / nextGoal) * 100, 100)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.4 }}
      className="relative w-full max-w-md overflow-hidden rounded-2xl p-8 shadow-2xl"
      style={{
        background: 'white',
        border: '2px solid #1A2B4B',
      }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
        background: '#1A2B4B',
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
      }} />

      {/* VIP Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider" style={tierBadgeStyle}>
          {lifetimeCoins >= 1000 && (
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M8 1l2.4 4.8L16 6.8l-4 3.9.94 5.5L8 13.7l-4.94 2.5.94-5.5L0 6.8l5.6-.99z"/>
            </svg>
          )}
          {tier}
        </span>
      </div>

      {/* Label */}
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B7FA3' }}>Your Coin Balance</p>

      {/* BIG NUMBER */}
      <p className="mt-1 font-black text-7xl tracking-tighter leading-none" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>
        <CountUp end={currentCoins} duration={2.5} separator="," useEasing={true} />
      </p>

      {/* PROGRESS BAR */}
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B7FA3' }}>VIP Progress</span>
          <span className="text-xs font-bold" style={{ color: '#1A2B4B' }}>{lifetimeCoins.toLocaleString()} / {nextGoal.toLocaleString()}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: '#E2E8F0' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: progressColor }}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 space-y-3">
        <a href="/marketplace" className="block w-full rounded-xl px-4 py-4 text-center font-black text-white text-sm transition-all hover:scale-[1.02] hover:shadow-lg" style={{ background: '#1A2B4B' }}>
          {lifetimeCoins >= 1000 ? 'Spend Coins (10% VIP Discount!)' : 'Go to Marketplace'}
        </a>

        <div className="flex gap-3">
          <a href="/history" className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all hover:opacity-80" style={{ background: '#EEF2F7', color: '#1A2B4B' }}>
            📄 My Activity
          </a>
          {email === 'Premsingh.ccd11@gmail.com' && (
            <a href="/admin" className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold text-white transition-all hover:opacity-80" style={{ background: '#C8102E' }}>
              👑 Admin
            </a>
          )}
        </div>

        <form action={logout}>
          <button type="submit" className="w-full text-xs font-medium underline underline-offset-4 transition-colors hover:opacity-70 mt-2" style={{ color: '#6B7FA3' }}>
            Sign Out ({email})
          </button>
        </form>
      </div>
    </motion.div>
  )
}