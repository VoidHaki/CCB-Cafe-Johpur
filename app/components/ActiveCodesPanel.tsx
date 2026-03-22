'use client'

import { useState } from 'react'
import { deleteCode } from '../admin/admin-actions'

type Code = {
  id: string
  code_string: string
  coin_value: number
  expires_at: string | null
  is_claimed: boolean
}

export default function ActiveCodesPanel({ initialCodes }: { initialCodes: Code[] }) {
  const [codes, setCodes] = useState<Code[]>(initialCodes)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(codeId: string) {
    setDeletingId(codeId)
    const formData = new FormData()
    formData.append('codeId', codeId)
    await deleteCode(formData)
    // Optimistically remove from UI
    setCodes(prev => prev.filter(c => c.id !== codeId))
    setDeletingId(null)
    setConfirmId(null)
  }

  return (
    <div className="rounded-2xl border-2 bg-white p-8 shadow-sm" style={{ borderColor: '#D1DCF0' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: '#EEF2F7' }}>
            <span>🏷️</span>
          </div>
          <div>
            <h2 className="font-black text-xl uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>
              Active Promo Codes
            </h2>
            <p className="text-xs" style={{ color: '#6B7FA3' }}>{codes.length} unclaimed code{codes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Live count badge */}
        <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: codes.length > 0 ? '#1A2B4B' : '#9CA3AF' }}>
          {codes.length}
        </span>
      </div>

      {/* Codes list */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {codes.length === 0 && (
          <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: '#D1DCF0' }}>
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm font-bold" style={{ color: '#6B7FA3' }}>No active codes</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Generate some above!</p>
          </div>
        )}

        {codes.map((code) => (
          <div
            key={code.id}
            className="flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all"
            style={{
              borderColor: confirmId === code.id ? '#C8102E' : '#D1DCF0',
              background: confirmId === code.id ? 'rgba(200,16,46,0.04)' : '#F5F8FF'
            }}
          >
            {/* Code info */}
            <div className="flex-1 min-w-0">
              <span className="block font-black font-mono tracking-widest text-sm" style={{ color: '#1A2B4B' }}>
                {code.code_string}
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs font-bold" style={{ color: '#C8102E' }}>
                  {code.coin_value} coins
                </span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>
                  Exp: {code.expires_at ? new Date(code.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '∞'}
                </span>
              </div>
            </div>

            {/* Delete controls */}
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              {confirmId === code.id ? (
                // Confirm state
                <>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-black uppercase tracking-wide transition-all hover:opacity-70"
                    style={{ background: '#EEF2F7', color: '#6B7FA3' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(code.id)}
                    disabled={deletingId === code.id}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-all hover:opacity-80 disabled:opacity-60 flex items-center gap-1"
                    style={{ background: '#C8102E' }}
                  >
                    {deletingId === code.id ? (
                      <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : '🗑️'}
                    {deletingId === code.id ? '' : 'Delete'}
                  </button>
                </>
              ) : (
                // Normal delete button
                <button
                  onClick={() => setConfirmId(code.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(200,16,46,0.08)', color: '#C8102E' }}
                  title="Delete code"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      {codes.length > 0 && (
        <p className="mt-4 text-xs text-center" style={{ color: '#9CA3AF' }}>
          Click the 🗑️ icon on any code to delete it
        </p>
      )}
    </div>
  )
}