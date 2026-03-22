export default function Loading() {
    return (
      <div style={{ background: '#EEF2F7', minHeight: '100vh' }} className="animate-pulse">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="h-28 rounded-2xl" style={{ background: '#D1DCF0' }} />
  
          {/* Cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border-2 bg-white p-7 space-y-4" style={{ borderColor: '#D1DCF0' }}>
                <div className="h-4 w-1/2 rounded-lg" style={{ background: '#E2E8F0' }} />
                <div className="h-7 w-3/4 rounded-xl" style={{ background: '#D1DCF0' }} />
                <div className="h-10 w-1/3 rounded-xl" style={{ background: '#E2E8F0' }} />
                <div className="h-12 w-full rounded-xl mt-4" style={{ background: '#D1DCF0' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }