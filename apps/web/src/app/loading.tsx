import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      {/* Title row */}
      <Skeleton className="h-7 w-64 bg-steam-card mb-6" />

      {/* Hero strip */}
      <Skeleton className="w-full h-[240px] bg-steam-card rounded-sm mb-6" />

      {/* Section title */}
      <Skeleton className="h-4 w-48 bg-steam-card mb-3" />

      {/* Card row */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[180px] shrink-0">
            <Skeleton className="w-full h-[103px] bg-steam-card rounded-sm" />
            <Skeleton className="w-full h-[56px] bg-steam-card rounded-sm mt-0.5" />
          </div>
        ))}
      </div>

      {/* Section title */}
      <Skeleton className="h-4 w-40 bg-steam-card mb-3" />

      {/* Stack rows */}
      <div className="space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[69px] bg-steam-card rounded-sm" />
        ))}
      </div>
    </div>
  )
}
