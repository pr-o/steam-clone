'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFeaturedGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Game } from '@steam-clone/types'

const RATING_COLOR: Record<string, string> = {
  'Overwhelmingly Positive': '#66c0f4',
  'Very Positive': '#66c0f4',
  'Mostly Positive': '#66c0f4',
  'Mixed': '#b9a074',
  'Mostly Negative': '#c34741',
  'Very Negative': '#c34741',
  'Overwhelmingly Negative': '#c34741',
}

function PriceBlock({ game }: { game: Game }) {
  if (game.price.isFree) {
    return <span className="text-steam-accentPale font-bold text-[15px]">Free to Play</span>
  }
  if (game.price.discountPercent > 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="bg-steam-discountBg text-steam-discountText text-[13px] font-bold px-2 py-1 rounded-sm">
          -{game.price.discountPercent}%
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-steam-textDim text-[11px] line-through">
            ${(game.price.initial / 100).toFixed(2)}
          </span>
          <span className="text-steam-salePrice font-bold text-[15px]">
            ${(game.price.final / 100).toFixed(2)}
          </span>
        </div>
      </div>
    )
  }
  return (
    <span className="text-steam-salePrice font-bold text-[15px]">
      ${(game.price.final / 100).toFixed(2)}
    </span>
  )
}

export function HeroCarousel() {
  const { data: games, isLoading } = useFeaturedGames()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!games?.length) return
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % Math.min(games.length, 5))
    }, 6000)
    return () => clearInterval(timer)
  }, [games])

  if (isLoading || !games?.length) {
    return (
      <div className="w-full bg-steam-panel">
        <div className="max-w-[940px] mx-auto">
          <Skeleton className="w-full h-[460px] bg-steam-card" />
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-[70px] bg-[#0e1825]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const featured = games.slice(0, 5)
  const active = featured[activeIndex]
  const ratingColor = RATING_COLOR[active.rating.summary] ?? '#66c0f4'

  return (
    <div className="w-full bg-steam-panel select-none">
      <div className="max-w-[940px] mx-auto">
        {/* Main hero area */}
        <div className="relative flex h-[460px] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              key={active.id}
              src={active.headerImage}
              alt={active.title}
              className="w-full h-full object-cover"
            />
            {/* Left gradient so info panel is readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1b2838] via-[#1b2838]/70 to-transparent" />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838]/40 to-transparent" />
          </div>

          {/* Info panel */}
          <div className="relative z-10 w-[31%] flex flex-col justify-end p-5 pointer-events-none">
            <h2 className="text-white font-bold text-[22px] leading-tight mb-2 line-clamp-2">
              {active.title}
            </h2>
            <p className="text-steam-textMuted text-[12px] leading-relaxed mb-3 line-clamp-3">
              {active.shortDescription}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {active.tags.slice(0, 3).map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-[10px] text-steam-textMuted bg-black/30 border border-steam-borderSubtle rounded-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="mb-3">
              <p className="text-[10px] text-steam-textDim mb-0.5">Overall Reviews:</p>
              <p className="text-[12px] font-medium" style={{ color: ratingColor }}>
                {active.rating.summary}
              </p>
            </div>
            <div className="pointer-events-auto">
              <PriceBlock game={active} />
            </div>
          </div>

          {/* Clickable overlay to game page */}
          <Link
            href={`/app/${active.id}/${active.slug}`}
            className="absolute inset-0 z-0"
            tabIndex={-1}
            aria-label={`View ${active.title}`}
          />
        </div>

        {/* Thumbnail strip */}
        <div className="flex border-t-2 border-[#0e1825]">
          {featured.map((game, i) => (
            <button
              key={game.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'flex-1 relative overflow-hidden transition-opacity focus-visible:outline-none',
                activeIndex === i ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              )}
            >
              <img
                src={game.headerImage}
                alt={game.title}
                className="w-full h-[70px] object-cover"
              />
              {activeIndex === i && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-steam-blue" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
