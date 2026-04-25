import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-0 py-16 text-center">
      <p className="text-steam-blue text-[80px] font-bold leading-none mb-1 tracking-tight">
        404
      </p>
      <h1 className="text-steam-text text-[22px] font-semibold mb-2">
        This page is missing in action
      </h1>
      <p className="text-steam-textMuted text-[14px] mb-8 max-w-[420px] mx-auto leading-relaxed">
        We couldn&apos;t find what you&apos;re looking for. The link might be broken,
        or the page may have moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 max-w-[420px] mx-auto">
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-4 py-2.5 rounded-sm transition-colors"
        >
          <Home size={14} />
          Steam Home
        </Link>
        <Link
          href="/search"
          className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-steam-text bg-steam-card hover:bg-steam-cardHover border border-steam-borderSubtle px-4 py-2.5 rounded-sm transition-colors"
        >
          <Search size={14} />
          Browse the Store
        </Link>
      </div>
    </div>
  )
}
