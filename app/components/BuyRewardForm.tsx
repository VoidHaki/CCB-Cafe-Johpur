'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { redeemReward } from '../marketplace/market-actions'

export default function BuyRewardForm({ cost, itemName, canAfford }: { cost: number, itemName: string, canAfford: boolean }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleBuy(formData: FormData) {
    setIsLoading(true)
    const spendSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_17b9618e7d.mp3?filename=coin-collect-retro-8-bit-sound-effect-145251.mp3')
    spendSound.volume = 0.4
    spendSound.play().catch(() => {})

    await new Promise((resolve) => setTimeout(resolve, 600))
    await redeemReward(formData)
    setIsLoading(false)

    toast.success(`You bought: ${itemName}!`, {
      icon: '☕',
      style: { background: '#1A2B4B', color: '#fff', fontWeight: 'bold' }
    })
  }

  return (
    <form action={handleBuy} className="mt-6">
      <input type="hidden" name="cost" value={cost} />
      <input type="hidden" name="itemName" value={itemName} />
      <button
        type="submit"
        disabled={!canAfford || isLoading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-black text-sm uppercase tracking-wide transition-all ${
          canAfford
            ? 'text-white hover:scale-[1.02] hover:shadow-md'
            : 'cursor-not-allowed'
        }`}
        style={canAfford ? { background: '#C8102E' } : { background: '#E2E8F0', color: '#9CA3AF' }}
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Purchasing...
          </>
        ) : canAfford ? 'Claim Reward' : 'Not Enough Coins'}
      </button>
    </form>
  )
}