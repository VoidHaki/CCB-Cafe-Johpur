export default function Loading() {
    return (
      <div style={{ background: '#EEF2F7', minHeight: '100vh' }} className="animate-pulse">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
  
            {/* Left skeleton */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
              <div className="h-16 w-3/4 rounded-2xl" style={{ background: '#D1DCF0' }} />
              <div className="h-16 w-full rounded-2xl" style={{ background: '#D1DCF0' }} />
              <div className="h-16 w-2/3 rounded-2xl" style={{ background: '#D1DCF0' }} />
              <div className="h-5 w-full rounded-xl mt-4" style={{ background: '#E2E8F0' }} />
              <div className="h-5 w-4/5 rounded-xl" style={{ background: '#E2E8F0' }} />
              <div className="flex gap-4 mt-4 w-full">
                <div className="h-14 flex-1 rounded-full" style={{ background: '#D1DCF0' }} />
                <div className="h-14 flex-1 rounded-full" style={{ background: '#E2E8F0' }} />
              </div>
            </div>
  
            {/* Wallet card skeleton */}
            <div className="flex w-full justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl border-2 p-8 space-y-4" style={{ background: 'white', borderColor: '#D1DCF0' }}>
                <div className="h-6 w-1/3 rounded-full" style={{ background: '#E2E8F0' }} />
                <div className="h-4 w-1/2 rounded-lg" style={{ background: '#E2E8F0' }} />
                <div className="h-20 w-2/3 rounded-2xl" style={{ background: '#D1DCF0' }} />
                <div className="h-3 w-full rounded-full" style={{ background: '#E2E8F0' }} />
                <div className="h-2.5 w-3/5 rounded-full" style={{ background: '#D1DCF0' }} />
                <div className="h-14 w-full rounded-xl mt-4" style={{ background: '#D1DCF0' }} />
                <div className="flex gap-3">
                  <div className="h-12 flex-1 rounded-xl" style={{ background: '#E2E8F0' }} />
                  <div className="h-12 flex-1 rounded-xl" style={{ background: '#E2E8F0' }} />
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    )
  }