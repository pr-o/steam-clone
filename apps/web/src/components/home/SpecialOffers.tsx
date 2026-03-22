'use client'

import Link from 'next/link'
import { useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'

export function SpecialOffers() {
  const { data: games, isLoading } = useAllGames()
  const discounted = games?.filter(g => g.price.discountPercent > 0).slice(0, 8) ?? []

  return (
    <section className="py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-steam-navActive text-[13px] font-normal uppercase tracking-[0.12em]">
          Special Offers
        </h2>
        <Link
          href="/specials"
          className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors"
        >
          See More
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] bg-steam-card rounded-sm" />
            ))
          : discounted.map(game => (
              <Link
                key={game.id}
                href={`/app/${game.id}/${game.slug}`}
                className="flex items-stretch bg-steam-card hover:bg-steam-cardHover transition-colors overflow-hidden group"
              >
                {/* Capsule art */}
                <div className="shrink-0 overflow-hidden w-[134px] h-[50px] self-center ml-0">
                  <img
                    src={game.headerImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Info */}
                <div className="flex flex-col justify-center px-3 py-2 min-w-0 flex-1">
                  <p className="text-steam-text text-[13px] font-medium truncate leading-tight">
                    {game.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="bg-steam-discountBg text-steam-discountText text-[11px] font-bold px-1.5 py-0.5 rounded-sm leading-none shrink-0">
                      -{game.price.discountPercent}%
                    </span>
                    <span className="text-steam-origPrice text-[11px] line-through">
                      ${(game.price.initial / 100).toFixed(2)}
                    </span>
                    <span className="text-steam-salePrice text-[12px] font-bold">
                      ${(game.price.final / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
