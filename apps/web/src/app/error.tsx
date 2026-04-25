'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="max-w-[640px] mx-auto px-4 sm:px-0 py-16 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c34741]/15 mb-4">
        <AlertTriangle size={28} className="text-[#c34741]" />
      </div>

      <h1 className="text-steam-text text-[22px] font-semibold mb-2">
        Something went wrong
      </h1>
      <p className="text-steam-textMuted text-[14px] mb-2 max-w-[420px] mx-auto leading-relaxed">
        We hit a snag rendering this page. You can try reloading, or head back
        to the store.
      </p>
      {error.digest && (
        <p className="text-steam-textDim text-[11px] font-mono mb-6">
          ref: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto justify-center mt-4">
        <Button
          variant="ghost"
          onClick={reset}
          className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-4 py-2.5 rounded-sm transition-colors"
        >
          <RefreshCw size={14} />
          Try Again
        </Button>
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center text-[13px] font-semibold text-steam-text bg-steam-card hover:bg-steam-cardHover border border-steam-borderSubtle px-4 py-2.5 rounded-sm transition-colors"
        >
          Steam Home
        </Link>
      </div>
    </div>
  )
}
