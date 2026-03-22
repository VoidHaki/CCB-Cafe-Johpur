import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'
import { Toaster } from 'react-hot-toast'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'CCB Rewards | Café Coffee Break',
  description: 'Earn Rewards With Every Sip — Jodhpur',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('cafe_user_id')?.value

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased flex flex-col min-h-screen`}
        style={{ backgroundColor: '#EEF2F7', color: '#1A2B4B' }}
      >
        <Toaster position="bottom-center" />

        {/* ═══════════════ NAVBAR ═══════════════ */}
        <header
          className="sticky top-0 z-50 w-full"
          style={{ background: '#1A2B4B', boxShadow: '0 2px 24px rgba(26,43,75,0.3)' }}
        >
          <div
            className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
            style={{ height: '72px' }}
          >
            {/* ── LOGO ── */}
            <a href="/" className="flex items-center gap-3 group flex-shrink-0">
              {/* Actual CCB logo image */}
              <div className="relative overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ width: '52px', height: '52px', borderRadius: '14px' }}>
                <Image
                  src="/ccb_logo.png"
                  alt="CCB Café Coffee Break Logo"
                  fill
                  sizes="52px"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Name + tagline */}
              <div className="leading-none hidden sm:block">
                <div
                  className="font-black text-white"
                  style={{ fontSize: '20px', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}
                >
                  Café Coffee Break
                </div>
                <div
                  className="text-white/40 font-semibold tracking-widest uppercase mt-0.5"
                  style={{ fontSize: '8.5px', letterSpacing: '0.2em' }}
                >
                  Rewards Programme · Jodhpur
                </div>
              </div>
            </a>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden md:flex items-center gap-1">
              <div className="w-px h-5 mr-6 rounded-full" style={{ background: 'rgba(200,16,46,0.5)' }} />
              {[
                { label: 'Home', href: '/' },
                { label: 'Redeem', href: '/#redeem-section' },
                { label: 'Marketplace', href: '/marketplace' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-bold uppercase text-white/65 transition-all hover:text-white rounded-lg hover:bg-white/8"
                  style={{ letterSpacing: '0.07em' }}
                >
                  {link.label}
                </a>
              ))}
              <div className="w-px h-5 ml-6 rounded-full" style={{ background: 'rgba(200,16,46,0.5)' }} />
            </nav>

            {/* ── CTA ── */}
            <div className="flex-shrink-0">
              {userId ? (
                <a
                  href="/marketplace"
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black text-white transition-all hover:scale-105 hover:brightness-110 uppercase"
                  style={{
                    background: '#C8102E',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(200,16,46,0.5)',
                  }}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M2 2h2l2.4 8.4h6.4L15 5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8" cy="13" r="1" fill="white"/>
                    <circle cx="13" cy="13" r="1" fill="white"/>
                  </svg>
                  Spend Coins
                </a>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black text-white transition-all hover:scale-105 hover:brightness-110 uppercase"
                  style={{
                    background: '#C8102E',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(200,16,46,0.5)',
                  }}
                >
                  Sign In
                </a>
              )}
            </div>
          </div>

          {/* ── MOBILE NAV ── */}
          <div
            className="flex justify-center gap-8 md:hidden border-t py-2.5"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <a href="/" className="text-xs font-black uppercase tracking-widest text-white/55 hover:text-white transition-colors">Home</a>
            <a href="/#redeem-section" className="text-xs font-black uppercase tracking-widest text-white/55 hover:text-white transition-colors">Redeem</a>
            <a href="/marketplace" className="text-xs font-black uppercase tracking-widest text-white/55 hover:text-white transition-colors">Market</a>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1">{children}</main>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="mt-20 text-white relative overflow-hidden" style={{ background: '#1A2B4B' }}>
          {/* Top red accent stripe */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #C8102E 0%, #ff3355 50%, #C8102E 100%)' }}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

              {/* ── BRAND + ADDRESS COLUMN ── */}
              <div className="md:col-span-2">
                {/* Logo row */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: '72px', height: '72px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                  >
                    <Image
                      src="/ccb_logo.png"
                      alt="CCB Logo"
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div
                      className="font-black text-white text-2xl"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Café Coffee Break
                    </div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mt-0.5" style={{ fontSize: '9px' }}>
                      CCB Rewards Programme
                    </div>
                  </div>
                </div>

                {/* Address block */}
                <div
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#C8102E' }}
                    >
                      <svg viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M8 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM0 6a8 8 0 1114.93 4.02l-3.93 4.4a1 1 0 01-1.5 0L5.57 9.9A8 8 0 010 6zm8 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-white/40 mb-0.5">Address</p>
                      <p className="text-sm text-white/80 leading-relaxed font-medium">
                        20 West Patel Nagar, Circuit House Road,<br />
                        Near OTR, Jodhpur, Rajasthan
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

                  {/* Phone numbers */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#C8102E' }}
                    >
                      <svg viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                        <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-white/40 mb-0.5">Contact</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <a
                          href="tel:9799552525"
                          className="text-sm font-black transition-colors hover:text-white"
                          style={{ color: '#ff6b6b' }}
                        >
                          📞 9799552525
                        </a>
                        <a
                          href="tel:02912515525"
                          className="text-sm font-black transition-colors hover:text-white"
                          style={{ color: '#ff6b6b' }}
                        >
                          ☎️ 0291-2515525
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── QUICK LINKS ── */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Quick Links
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Redeem a Code', href: '/#redeem-section' },
                    { label: 'Marketplace', href: '/marketplace' },
                    { label: 'My Activity', href: '/history' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-2 text-sm font-medium transition-all hover:translate-x-1 group"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0 transition-all group-hover:w-2"
                        style={{ background: '#C8102E' }}
                      />
                      <span className="group-hover:text-white transition-colors">{item.label}</span>
                    </a>
                  ))}
                </div>

                {/* Tagline box */}
                <div
                  className="mt-8 rounded-xl p-4"
                  style={{ background: 'rgba(200,16,46,0.12)', border: '1px solid rgba(200,16,46,0.2)' }}
                >
                  <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: '#ff6b6b' }}>
                    Every Sip Counts ☕
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Collect codes, earn coins &amp; unlock rewards with every visit to CCB.
                  </p>
                </div>
              </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div
              className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                © 2026 Café Coffee Break (CCB). All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C8102E' }} />
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px' }}
                >
                  Powered by CCB Rewards · Jodhpur
                </p>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}