import { Suspense } from 'react'
import { SearchPageClient } from '@/components/search/SearchPageClient'
import { Skeleton } from '@/components/ui/skeleton'

function SearchFallback() {
  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[69px] w-full bg-[#1b2838]" />
      ))}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient />
    </Suspense>
  )
}
