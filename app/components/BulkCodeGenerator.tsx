'use client'

import { useState } from 'react'
import { bulkGenerateCodes } from '../admin/admin-actions'

export default function BulkCodeGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setGeneratedCodes([])
    const result = await bulkGenerateCodes(formData)
    setIsLoading(false)

    if (result && 'codes' in result && result.codes) {
      setGeneratedCodes(result.codes)
    }
  }

  function copyAll() {
    navigator.clipboard.writeText(generatedCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border-2 bg-white p-8 shadow-sm" style={{ borderColor: '#D1DCF0' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A2B4B, #2d4a7a)' }}>
          <span>⚡</span>
        </div>
        <div>
          <h2 className="font-black text-xl uppercase tracking-tight" style={{ color: '#1A2B4B', fontFamily: 'Georgia, serif' }}>
            Bulk Code Generator
          </h2>
          <p className="text-xs" style={{ color: '#6B7FA3' }}>Auto-generates random codes like CH3-4JX</p>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        {/* Count + Coins row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#6B7FA3' }}>
              No. of Codes
            </label>
            <input
              type="number"
              name="count"
              placeholder="e.g. 20"
              min="1"
              max="100"
              required
              defaultValue="10"
              className="w-full rounded-xl border-2 px-3 py-3 text-sm font-black outline-none transition-all text-center"
              style={{ borderColor: '#D1DCF0', background: '#F5F8FF', color: '#1A2B4B' }}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#6B7FA3' }}>
              Coins Each
            </label>
            <input
              type="number"
              name="coinValue"
              placeholder="e.g. 50"
              min="1"
              max="1000000"
              required
              className="w-full rounded-xl border-2 px-3 py-3 text-sm font-black outline-none transition-all text-center"
              style={{ borderColor: '#D1DCF0', background: '#F5F8FF', color: '#1A2B4B' }}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#6B7FA3' }}>
              Days Valid
            </label>
            <input
              type="number"
              name="daysValid"
              defaultValue="30"
              min="1"
              max="365"
              required
              className="w-full rounded-xl border-2 px-3 py-3 text-sm font-black outline-none transition-all text-center"
              style={{ borderColor: '#D1DCF0', background: '#F5F8FF', color: '#1A2B4B' }}
            />
          </div>
        </div>

        {/* Format preview */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#F5F8FF', border: '1px dashed #D1DCF0' }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6B7FA3' }}>Format preview:</span>
          <span className="font-black font-mono text-sm tracking-widest" style={{ color: '#1A2B4B' }}>CH3-4JX &nbsp; AB7-2KP &nbsp; QZ9-5MN</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl py-4 font-black text-white text-sm uppercase tracking-wide transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1A2B4B, #2d4a7a)', boxShadow: '0 4px 14px rgba(26,43,75,0.3)' }}
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Generating...
            </>
          ) : (
            <>⚡ Generate Codes</>
          )}
        </button>
      </form>

      {/* Results panel */}
      {generatedCodes.length > 0 && (
        <div className="mt-6 rounded-xl border-2 overflow-hidden" style={{ borderColor: '#1A2B4B' }}>
          {/* Result header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: '#1A2B4B' }}>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm">✓</span>
              <span className="text-white font-black text-sm uppercase tracking-wider">
                {generatedCodes.length} Codes Generated!
              </span>
            </div>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-all hover:scale-105"
              style={{ background: copied ? '#22c55e' : '#C8102E', color: 'white' }}
            >
              {copied ? '✓ Copied!' : '📋 Copy All'}
            </button>
          </div>

          {/* Codes grid */}
          <div className="p-4 max-h-52 overflow-y-auto" style={{ background: '#F5F8FF' }}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {generatedCodes.map((code, i) => (
                <div
                  key={i}
                  className="rounded-lg px-2.5 py-2 text-center font-black font-mono text-xs tracking-widest border"
                  style={{ background: 'white', color: '#1A2B4B', borderColor: '#D1DCF0' }}
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-2.5 text-xs font-medium text-center" style={{ background: '#EEF2F7', color: '#6B7FA3' }}>
            Codes saved to database · Print or share them with customers
          </div>
        </div>
      )}
    </div>
  )
}