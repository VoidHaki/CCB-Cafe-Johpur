'use client'

type Props = {
  codes: Array<{ code_string: string; coin_value: number; expires_at: string | null }>
}

export default function BulkPrintCodes({ codes }: Props) {
  function handleBulkPrint() {
    const rows = codes.map(c => {
      const expiry = c.expires_at
        ? new Date(c.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'No Expiry'
      return `
      <div class="slip">
        <div class="brand">Café Coffee Break</div>
        <div class="tagline">CCB Rewards · Jodhpur</div>
        <hr class="divider" />
        <div class="label">Promo Code</div>
        <div class="code">${c.code_string}</div>
        <div class="coins-box">
          <div class="coins-number">${c.coin_value}</div>
          <div class="coins-label">Coins</div>
        </div>
        <div class="meta">Valid Until: ${expiry}</div>
        <hr class="divider" />
        <div class="footer-text">ccbrewards.in · Every Sip Counts ☕</div>
      </div>`
    }).join('')

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>CCB Bulk Code Print</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Playfair+Display:wght@900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier Prime', monospace;
      background: white;
      padding: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 72mm);
      gap: 12px;
      justify-content: center;
    }
    .slip {
      width: 72mm;
      border: 1.5px dashed #1A2B4B;
      border-radius: 6px;
      padding: 12px 10px;
      text-align: center;
      page-break-inside: avoid;
    }
    .brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 12px;
      font-weight: 900;
      color: #1A2B4B;
      text-transform: uppercase;
    }
    .tagline { font-size: 6px; color: #6B7FA3; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 1px; }
    .divider { border: none; border-top: 1px dashed #D1DCF0; margin: 6px 0; }
    .label { font-size: 6px; color: #6B7FA3; letter-spacing: 0.2em; text-transform: uppercase; }
    .code {
      font-size: 20px;
      font-weight: 700;
      color: #C8102E;
      letter-spacing: 0.15em;
      background: #FEF2F2;
      border: 1.5px solid #C8102E;
      border-radius: 4px;
      padding: 5px 8px;
      display: inline-block;
      margin: 3px 0;
    }
    .coins-box { background: #1A2B4B; color: white; border-radius: 4px; padding: 5px 8px; margin: 5px 0; }
    .coins-number { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 900; line-height: 1; }
    .coins-label { font-size: 6px; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.6; }
    .meta { font-size: 6.5px; color: #6B7FA3; margin-top: 2px; }
    .footer-text { font-size: 6px; color: #9CA3AF; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 5px; }
    @media print {
      body { padding: 0; }
      .grid { gap: 8px; }
    }
  </style>
</head>
<body>
  <div class="grid">${rows}</div>
  <script>
    window.onload = function() { window.print(); window.close(); }
  <\/script>
</body>
</html>`

    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;'
    document.body.appendChild(iframe)
    iframe.contentDocument!.open()
    iframe.contentDocument!.write(html)
    iframe.contentDocument!.close()
    setTimeout(() => document.body.removeChild(iframe), 6000)
  }

  if (codes.length === 0) return null

  return (
    <button
      onClick={handleBulkPrint}
      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white uppercase tracking-wide transition-all hover:opacity-80 hover:scale-[1.02]"
      style={{ background: '#1A2B4B' }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v5a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-1h8v3H6v-2zm9-5a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
      </svg>
      🖨️ Print All {codes.length} Slips
    </button>
  )
}