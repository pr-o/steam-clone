'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFeaturedGames } from '@/hooks/useGames'
import { GameCard } from '@steam-clone/ui'
import { Skeleton } from '@/components/ui/skeleton'

export function FeaturedRow() {
  const { data: games, isLoading } = useFeaturedGames()
  const router = useRouter()

  return (
    <section className="pt-6 pb-3">
      <div className="flex items-center justify-between mb-3 px-0">
        <h2 className="text-steam-navActive text-[13px] font-normal uppercase tracking-[0.12em]">
          Featured &amp; Recommended
        </h2>
        <Link
          href="/search"
          className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors"
        >
          See More
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[220px] shrink-0">
                <Skeleton className="w-full h-[103px] rounded-sm bg-steam-card" />
                <Skeleton className="w-full h-[56px] rounded-sm bg-steam-card mt-0.5" />
              </div>
            ))
          : games?.map(game => (
              <div key={game.id} className="w-[220px] shrink-0">
                <GameCard
                  game={game}
                  onClick={g => router.push(`/app/${g.id}/${g.slug}`)}
                />
              </div>
            ))}
      </div>
    </section>
  )
}
