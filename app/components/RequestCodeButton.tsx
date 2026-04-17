'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function RequestCodeButton() {
  const [isRequesting, setIsRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  async function handleRequest() {
    if (cooldown) return
    setIsRequesting(true)

    try {
      await fetch('/api/request-code', { method: 'POST' })
    } catch {
      // Best-effort
    }

    setIsRequesting(false)
    setRequested(true)
    setCooldown(true)

    toast('📣 Your request was sent to the barista!', {
      icon: '☕',
      duration: 4000,
      style: {
        background: '#1A2B4B',
        color: '#fff',
        fontWeight: 'bold',
        borderLeft: '4px solid #C8102E',
      },
    })

    setTimeout(() => setRequested(false), 8000)
    setTimeout(() => setCooldown(false), 30000)
  }

  return (
    <div className="mt-4 flex flex-col items-stretch gap-2">
      <button
        onClick={handleRequest}
        disabled={isRequesting || cooldown}
        className={`
          group relative flex w-full items-center justify-center gap-3
          rounded-xl border-2 px-6 py-4 text-sm font-black uppercase tracking-wide
          transition-all duration-200
          ${cooldown
            ? 'cursor-not-allowed opacity-60'
            : 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
          }
        `}
        style={
          requested
            ? { background: '#f0fdf4', borderColor: '#22c55e', color: '#16a34a' }
            : { background: '#FFF7ED', borderColor: '#C8102E', color: '#C8102E' }
        }
      >
        {isRequesting && (
          <span className="absolute inset-0 rounded-xl animate-ping opacity-20" style={{ background: '#C8102E' }} />
        )}

        {isRequesting ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending Request…
          </>
        ) : requested ? (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Request Sent — Barista Notified!
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            🎟️ Request a Code from Barista
          </>
        )}
      </button>

      {cooldown && !requested && (
        <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>
          You can request again in a moment…
        </p>
      )}
    </div>
  )
}