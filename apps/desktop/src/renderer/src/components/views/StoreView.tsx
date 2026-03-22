import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useAllGames, useFeaturedGames } from '@renderer/hooks/useGames'
import { addToCartAtom } from '@renderer/stores/cartStore'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@renderer/components/ui/scroll-area'
import { cn } from '@renderer/lib/utils'
import type { Game } from '@steam-clone/types'

const RATING_COLOR: Record<string, string> = {
  'Overwhelmingly Positive': '#66c0f4',
  'Very Positive': '#66c0f4',
  'Mostly Positive': '#66c0f4',
  Mixed: '#b9a074',
  'Mostly Negative': '#c34741',
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function StoreHero() {
  const { data: games, isLoading } = useFeaturedGames()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!games?.length) return
    const t = setInterval(() => setIdx(i => (i + 1) % Math.min(games.length, 5)), 5000)
    return () => clearInterval(t)
  }, [games])

  if (isLoading || !games?.length) {
    return <Skeleton className="w-full h-[240px] bg-steam-card rounded-sm" />
  }

  const featured = games.slice(0, 5)
  const active = featured[idx]
  const rc = RATING_COLOR[active.rating.summary] ?? '#66c0f4'

  return (
    <div className="relative h-[240px] overflow-hidden rounded-sm group">
      <img src={active.headerImage} alt={active.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1b2838] via-[#1b2838]/60 to-transparent" />

      <div className="absolute inset-0 p-5 flex flex-col justify-end w-[45%]">
        <p className="text-white font-bold text-[18px] leading-tight mb-1 line-clamp-1">{active.title}</p>
        <p className="text-steam-textMuted text-[11px] leading-relaxed mb-2 line-clamp-2">{active.shortDescription}</p>
        <p className="text-[11px]" style={{ color: rc }}>{active.rating.summary}</p>
        {active.price.isFree
          ? <span className="text-steam-accentPale text-[13px] font-bold mt-1">Free to Play</span>
          : active.price.discountPercent > 0
          ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-steam-discountBg text-steam-discountText text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                -{active.price.discountPercent}%
              </span>
              <span className="text-steam-salePrice font-bold text-[13px]">{formatPrice(active.price.final)}</span>
            </div>
          )
          : <span className="text-steam-text font-bold text-[13px] mt-1">{formatPrice(active.price.final)}</span>
        }
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 flex">
        {featured.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setIdx(i)}
            className={cn('flex-1 relative h-[48px] overflow-hidden transition-opacity', idx === i ? 'opacity-100' : 'opacity-50 hover:opacity-75')}
          >
            <img src={g.headerImage} alt="" className="w-full h-full object-cover" />
            {idx === i && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-steam-blue" />}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Featured Row ─────────────────────────────────────────────────────────────

function GameCard({ game }: { game: Game }) {
  const [, addToCart] = useAtom(addToCartAtom)
  return (
    <div className="w-[180px] shrink-0 bg-steam-card rounded-sm overflow-hidden group cursor-pointer hover:bg-steam-cardHover transition-colors">
      <div className="relative overflow-hidden">
        <img src={game.headerImage} alt={game.title} className="w-full h-[84px] object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-2">
        <p className="text-steam-text text-[12px] font-medium truncate leading-tight">{game.title}</p>
        <div className="flex items-center justify-between mt-1.5">
          {game.price.isFree
            ? <span className="text-steam-accentPale text-[11px]">Free</span>
            : game.price.discountPercent > 0
            ? (
              <div className="flex items-center gap-1">
                <span className="bg-steam-discountBg text-steam-discountText text-[10px] font-bold px-1 py-0.5 rounded-sm leading-none">-{game.price.discountPercent}%</span>
                <span className="text-steam-salePrice text-[11px] font-bold">{formatPrice(game.price.final)}</span>
              </div>
            )
            : <span className="text-steam-text text-[11px]">{formatPrice(game.price.final)}</span>
          }
          {!game.price.isFree && (
            <button
              onClick={() => addToCart(game)}
              className="text-[10px] text-white bg-steam-blue hover:bg-steam-cerulean px-2 py-0.5 rounded-sm transition-colors"
            >
              + Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Special Offers ───────────────────────────────────────────────────────────

function SpecialOfferRow({ game }: { game: Game }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-steam-card hover:bg-steam-cardHover transition-colors rounded-sm cursor-pointer group">
      <div className="shrink-0 w-[120px] h-[45px] overflow-hidden rounded-sm">
        <img src={game.headerImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-steam-text text-[12px] font-medium truncate">{game.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="bg-steam-discountBg text-steam-discountText text-[10px] font-bold px-1 py-0.5 rounded-sm leading-none">-{game.price.discountPercent}%</span>
          <span className="text-steam-textDim text-[10px] line-through">{formatPrice(game.price.initial)}</span>
          <span className="text-steam-salePrice text-[11px] font-bold">{formatPrice(game.price.final)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StoreView() {
  const { data: games, isLoading } = useAllGames()
  const { data: featured } = useFeaturedGames()
  const discounted = games?.filter(g => g.price.discountPercent > 0) ?? []

  return (
    <div className="p-4 space-y-6">
      {/* Hero */}
      <StoreHero />

      {/* Featured & Recommended */}
      <div>
        <p className="text-steam-navActive text-[11px] font-normal uppercase tracking-[0.12em] mb-2">Featured &amp; Recommended</p>
        <ScrollArea>
          <div className="flex gap-2 pb-2">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[180px] h-[120px] bg-steam-card rounded-sm shrink-0" />)
              : featured?.map(g => <GameCard key={g.id} game={g} />)
            }
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Special Offers */}
      {discounted.length > 0 && (
        <div>
          <p className="text-steam-navActive text-[11px] font-normal uppercase tracking-[0.12em] mb-2">Special Offers</p>
          <div className="grid grid-cols-2 gap-1">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[61px] bg-steam-card rounded-sm" />)
              : discounted.slice(0, 6).map(g => <SpecialOfferRow key={g.id} game={g} />)
            }
          </div>
        </div>
      )}
    </div>
  )
}
