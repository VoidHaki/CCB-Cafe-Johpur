'use client'

import { useState } from 'react'

type Props = {
  codeString: string
  coinValue: number
  expiresAt: string | null
}

export default function PrintCodeSlip({ codeString, coinValue, expiresAt }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  function handlePrint() {
    // Inject the print slip into a hidden iframe and trigger print
    const expiry = expiresAt
      ? new Date(expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'No Expiry'

    const slipHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>CCB Code – ${codeString}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Playfair+Display:wght@900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Courier Prime', 'Courier New', monospace;
      background: white;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 20px;
    }

    .slip {
      width: 72mm;        /* Standard thermal receipt width */
      background: white;
      border: 2px dashed #1A2B4B;
      border-radius: 8px;
      padding: 16px 14px;
      text-align: center;
      position: relative;
    }

    /* Serrated top edge */
    .slip::before {
      content: '';
      display: block;
      height: 10px;
      background: repeating-linear-gradient(
        90deg,
        white 0px, white 8px,
        #1A2B4B 8px, #1A2B4B 10px
      );
      margin: -16px -14px 12px -14px;
      border-radius: 8px 8px 0 0;
    }

    .brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 15px;
      font-weight: 900;
      color: #1A2B4B;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }

    .tagline {
      font-size: 7px;
      color: #6B7FA3;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .divider {
      border: none;
      border-top: 1px dashed #D1DCF0;
      margin: 10px 0;
    }

    .label {
      font-size: 7px;
      color: #6B7FA3;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .code {
      font-family: 'Courier Prime', monospace;
      font-size: 28px;
      font-weight: 700;
      color: #C8102E;
      letter-spacing: 0.18em;
      background: #FEF2F2;
      border: 2px solid #C8102E;
      border-radius: 6px;
      padding: 8px 12px;
      display: inline-block;
      margin: 4px 0;
    }

    .coins-box {
      background: #1A2B4B;
      color: white;
      border-radius: 6px;
      padding: 8px 10px;
      margin: 8px 0;
    }

    .coins-number {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      font-weight: 900;
      line-height: 1;
    }

    .coins-label {
      font-size: 8px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      opacity: 0.6;
      margin-top: 2px;
    }

    .meta {
      font-size: 8px;
      color: #6B7FA3;
      margin-top: 2px;
    }

    .footer-text {
      font-size: 7px;
      color: #9CA3AF;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 8px;
    }

    .star-row {
      font-size: 9px;
      color: #D1DCF0;
      letter-spacing: 0.3em;
      margin: 6px 0 2px;
    }

    /* Serrated bottom edge */
    .slip::after {
      content: '';
      display: block;
      height: 10px;
      background: repeating-linear-gradient(
        90deg,
        white 0px, white 8px,
        #1A2B4B 8px, #1A2B4B 10px
      );
      margin: 12px -14px -16px -14px;
      border-radius: 0 0 8px 8px;
    }

    @media print {
      body { padding: 0; }
      .slip { border: none; }
      .slip::before, .slip::after { display: none; }
    }
  </style>
</head>
<body>
  <div class="slip">
    <div class="brand">Café Coffee Break</div>
    <div class="tagline">CCB Rewards · Jodhpur</div>

    <hr class="divider" />

    <div class="label">Your Promo Code</div>
    <div class="code">${codeString}</div>

    <div class="coins-box">
      <div class="coins-number">${coinValue}</div>
      <div class="coins-label">Coins Value</div>
    </div>

    <div class="meta">Valid Until: ${expiry}</div>

    <hr class="divider" />

    <div class="label">How to Redeem</div>
    <div class="meta" style="line-height:1.6; margin-top:3px;">
      Visit <strong>ccbrewards.in</strong><br/>
      Login → Enter Code → Earn Coins!
    </div>

    <div class="star-row">✦ ✦ ✦ ✦ ✦</div>
    <div class="footer-text">Every Sip Counts · Thank You!</div>
  </div>

  <script>
    window.onload = function() { window.print(); window.close(); }
  </script>
</body>
</html>`

    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;'
    document.body.appendChild(iframe)
    iframe.contentDocument!.open()
    iframe.contentDocument!.write(slipHTML)
    iframe.contentDocument!.close()

    // Give fonts a moment to load, then remove iframe
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 4000)

    setShowConfirm(false)
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 ml-1"
        style={{ background: 'rgba(26,43,75,0.08)', color: '#1A2B4B' }}
        title="Print code slip"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v5a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-1h8v3H6v-2zm9-5a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
        </svg>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 ml-1">
      <button
        onClick={() => setShowConfirm(false)}
        className="rounded-lg px-2 py-1 text-xs font-black uppercase transition-all hover:opacity-70"
        style={{ background: '#EEF2F7', color: '#6B7FA3' }}
      >
        ✕
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black text-white uppercase tracking-wide transition-all hover:opacity-80"
        style={{ background: '#1A2B4B' }}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v5a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-1h8v3H6v-2zm9-5a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
        </svg>
        Print Slip
      </button>
    </div>
  )
}