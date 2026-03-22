'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { claimCoffeeCode } from '../home-actions'

export default function RedeemForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const result = await claimCoffeeCode(formData)
    setIsLoading(false)

    if (result?.success) {
      const successSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3')
      successSound.volume = 0.5
      successSound.play().catch(() => {})

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1A2B4B', '#C8102E', '#ffffff']
      })

      toast.success(result.message, { style: { background: '#1A2B4B', color: '#fff', fontWeight: 'bold' } })
    } else if (result?.message) {
      toast.error(result.message)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-widest" style={{ color: '#1A2B4B' }}>Promo Code</label>
        <input
          type="text"
          name="code"
          placeholder="E.G., CCB2026"
          required
          disabled={isLoading}
          className="w-full rounded-xl border-2 px-5 py-4 font-mono text-base uppercase tracking-widest outline-none transition-all disabled:opacity-50"
          style={{
            borderColor: '#D1DCF0',
            background: '#F5F8FF',
            color: '#1A2B4B',
          }}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-black text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100 uppercase tracking-wide"
        style={{ background: '#C8102E' }}
      >
        {isLoading ? (
          <>
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying Code...
          </>
        ) : (
          <>✦ Redeem Code</>
        )}
      </button>
    </form>
  )
}