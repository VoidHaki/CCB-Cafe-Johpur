'use client'

import { motion, Variants } from 'framer-motion'
import BuyRewardForm from './BuyRewardForm'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function AnimatedMarketGrid({ rewards, userCoins, isDiamond }: { rewards: any[], userCoins: number, isDiamond: boolean }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {rewards?.map((reward) => {
        const finalCost = isDiamond ? Math.floor(reward.coin_cost * 0.9) : reward.coin_cost
        const canAfford = userCoins >= finalCost

        return (
          <motion.div
            key={reward.id}
            variants={itemVariants}
            className="flex flex-col justify-between rounded-2xl border-2 bg-white p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            style={{ borderColor: '#D1DCF0' }}
          >
            <div>
              {isDiamond && (
                <span className="mb-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(200,16,46,0.1)', color: '#C8102E' }}>
                  💎 VIP 10% Off
                </span>
              )}
              <h3 className="font-black text-lg leading-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>{reward.item_name}</h3>

              <div className="mt-3 flex items-end gap-2">
                <p className="text-3xl font-black" style={{ color: '#C8102E' }}>{finalCost}</p>
                {isDiamond && <p className="text-lg line-through mb-1" style={{ color: '#9CA3AF' }}>{reward.coin_cost}</p>}
                <span className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#6B7FA3' }}>Coins</span>
              </div>
            </div>

            <BuyRewardForm cost={finalCost} itemName={reward.item_name} canAfford={canAfford} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}