'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type CodeRequest = {
  id: string
  user_email: string
  created_at: string
  is_handled: boolean
}

export default function AdminCodeRequestNotifier() {
  const [pendingRequests, setPendingRequests] = useState<CodeRequest[]>([])
  const router = useRouter()

  const playBell = useCallback(() => {
    const bell = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
    bell.volume = 0.8
    bell.play().catch(() => {})
  }, [])

  const dismissRequest = useCallback(async (id: string) => {
    await fetch('/api/request-code', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPendingRequests(prev => prev.filter(r => r.id !== id))
    router.refresh()
  }, [router])

  useEffect(() => {
    const knownIds = new Set<string>()

    async function poll() {
      try {
        const res = await fetch('/api/request-code')
        const { requests } = await res.json() as { requests: CodeRequest[] }
        const newRequests = requests.filter((r: CodeRequest) => !knownIds.has(r.id))

        if (newRequests.length > 0) {
          playBell()
          newRequests.forEach((req: CodeRequest) => {
            knownIds.add(req.id)
            toast.custom(
              (t) => (
                <div
                  className={`flex items-start gap-3 rounded-2xl border-2 shadow-2xl p-4 transition-all ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                  style={{ background: 'white', borderColor: '#C8102E', minWidth: '320px', maxWidth: '380px' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: '#FEF2F2' }}>
                    🔔
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm uppercase tracking-wide" style={{ color: '#1A2B4B' }}>
                      Customer Needs a Code!
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7FA3' }}>{req.user_email}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      {new Date(req.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <button
                      onClick={() => { dismissRequest(req.id); toast.dismiss(t.id) }}
                      className="mt-2 rounded-lg px-3 py-1.5 text-xs font-black text-white uppercase tracking-wide transition hover:opacity-80"
                      style={{ background: '#C8102E' }}
                    >
                      ✓ Mark as Handled
                    </button>
                  </div>
                </div>
              ),
              { duration: Infinity, position: 'top-right' }
            )
          })
          setPendingRequests(requests)
        }
      } catch {
        // Silently ignore
      }
    }

    const interval = setInterval(poll, 4000)
    poll()
    return () => clearInterval(interval)
  }, [playBell, dismissRequest])

  if (pendingRequests.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {pendingRequests.map(req => (
        <div
          key={req.id}
          className="flex items-center gap-3 rounded-2xl border-2 bg-white p-4 shadow-2xl animate-bounce"
          style={{ borderColor: '#C8102E', minWidth: '280px' }}
        >
          <span className="text-xl">🔔</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-xs uppercase" style={{ color: '#C8102E' }}>Code Request!</p>
            <p className="text-xs truncate" style={{ color: '#6B7FA3' }}>{req.user_email}</p>
          </div>
          <button
            onClick={() => dismissRequest(req.id)}
            className="rounded-lg px-2 py-1 text-xs font-black text-white"
            style={{ background: '#1A2B4B' }}
          >
            Done
          </button>
        </div>
      ))}
    </div>
  )
}