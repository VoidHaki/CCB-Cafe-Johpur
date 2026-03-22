import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4" style={{ background: '#EEF2F7' }}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl" style={{ background: 'white' }}>

        {/* Header - Navy Blue */}
        <div className="p-8 text-center" style={{ background: '#1A2B4B' }}>
          {/* CCB Coffee Cup Icon */}
          <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
              <circle cx="30" cy="30" r="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              {/* Steam */}
              <path d="M20 14c0-3 3-4 3-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M27 14c0-3 3-4 3-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M34 14c0-3 3-4 3-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              {/* Cup body */}
              <path d="M14 20h32l-3 22H17L14 20z" fill="#C8102E"/>
              {/* Handle */}
              <path d="M46 24h4a4 4 0 010 8h-4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              {/* CCB text on cup */}
              <text x="22" y="35" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif">CCB</text>
            </svg>
          </div>
          <h2 className="font-black text-3xl text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Welcome Back</h2>
          <p className="mt-2 text-sm opacity-70 text-white">Sign in to access your CCB Rewards wallet.</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold" style={{ color: '#1A2B4B' }}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border-2 px-4 py-3.5 text-sm outline-none transition-all focus:border-blue-900 focus:bg-white"
                style={{
                  borderColor: '#D1DCF0',
                  background: '#F5F8FF',
                  color: '#1A2B4B',
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl px-4 py-4 font-black text-white text-base shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              style={{ background: '#C8102E', letterSpacing: '0.02em' }}
            >
              Access Wallet →
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}