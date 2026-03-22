'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAllGames } from '@/hooks/useGames'
import { useSetAtom } from 'jotai'
import { addToCartAtom } from '@/stores/cartStore'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Game } from '@steam-clone/types'

const TABS = ['Popular New Releases', 'Top Sellers', 'Upcoming', 'Trending Free'] as const
type Tab = (typeof TABS)[number]

function PriceTag({ game }: { game: Game }) {
  if (game.price.isFree) {
    return <span className="text-steam-accentPale text-[12px] font-medium">Free</span>
  }
  if (game.price.discountPercent > 0) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="bg-steam-discountBg text-steam-discountText text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
          -{game.price.discountPercent}%
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-steam-textDim text-[10px] line-through">
            ${(game.price.initial / 100).toFixed(2)}
          </span>
          <span className="text-steam-salePrice text-[11px] font-bold">
            ${(game.price.final / 100).toFixed(2)}
          </span>
        </div>
      </div>
    )
  }
  return (
    <span className="text-steam-accentPale text-[12px]">
      ${(game.price.final / 100).toFixed(2)}
    </span>
  )
}

function GameRow({
  game,
  isSelected,
  onClick,
}: {
  game: Game
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 p-1.5 rounded-sm transition-colors text-left group',
        isSelected ? 'bg-[#4c6b9f]' : 'hover:bg-steam-card'
      )}
    >
      <div className="shrink-0 w-[120px] h-[45px] overflow-hidden rounded-sm">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-steam-text text-[13px] font-medium leading-tight truncate">
          {game.title}
        </p>
        <p className="text-steam-textMuted text-[11px] truncate mt-0.5">
          {game.tags
            .slice(0, 3)
            .map(t => t.name)
            .join(', ')}
        </p>
      </div>
      <div className="shrink-0 text-right pr-1">
        <PriceTag game={game} />
      </div>
    </button>
  )
}

function PreviewPanel({ game }: { game: Game }) {
  const addToCart = useSetAtom(addToCartAtom)
  const ratingColor =
    game.rating.summary.includes('Positive') ? '#66c0f4' : '#b9a074'

  return (
    <div className="flex flex-col h-full bg-[#16202d] rounded-sm overflow-hidden">
      {/* Hero image */}
      <div className="relative h-[140px] shrink-0 overflow-hidden">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16202d]/80 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-bold text-[14px] leading-tight line-clamp-1">
            {game.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
      <div className="flex flex-col p-3 gap-2">
        {/* Rating */}
        <div>
          <p className="text-steam-textDim text-[10px] mb-0.5">
            {game.rating.totalReviews.toLocaleString()} reviews
          </p>
          <p className="text-[11px] font-medium" style={{ color: ratingColor }}>
            {game.rating.summary}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 4).map(tag => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 text-[10px] text-steam-textMuted bg-black/30 border border-steam-borderSubtle rounded-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Screenshots */}
        <div className="grid grid-cols-2 gap-1">
          {game.screenshots.slice(0, 4).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-sm">
              <img
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="w-full h-[52px] object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>

        {/* Buy */}
        <div className="mt-auto pt-2 border-t border-steam-borderSubtle">
          <div className="flex items-center justify-between">
            <PriceTag game={game} />
            {!game.price.isFree ? (
              <button
                onClick={() => addToCart(game)}
                className="text-[11px] font-semibold text-white bg-steam-blue hover:bg-steam-cerulean px-3 py-1.5 rounded-sm transition-colors"
              >
                Add to Cart
              </button>
            ) : (
              <Link
                href={`/app/${game.id}/${game.slug}`}
                className="text-[11px] font-semibold text-white bg-steam-blue hover:bg-steam-cerulean px-3 py-1.5 rounded-sm transition-colors"
              >
                Play Free
              </Link>
            )}
          </div>
        </div>
      </div>
      </ScrollArea>
    </div>
  )
}

export function TopSellersSection() {
  const { data: games, isLoading } = useAllGames()
  const [activeTab, setActiveTab] = useState<Tab>('Top Sellers')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const tabGames = games?.slice(0, 10) ?? []
  const selectedGame = tabGames.find(g => g.id === selectedId) ?? tabGames[0] ?? null

  return (
    <section className="py-3">
      {/* Tab bar */}
      <div className="flex items-end gap-0 mb-3 border-b border-steam-borderSubtle">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 text-[13px] transition-colors relative',
              activeTab === tab
                ? 'text-white'
                : 'text-steam-textMuted hover:text-steam-text'
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-steam-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-2">
        {/* Game list */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[60px] bg-steam-card rounded-sm" />
              ))
            : tabGames.map(game => (
                <GameRow
                  key={game.id}
                  game={game}
                  isSelected={game.id === (selectedId ?? tabGames[0]?.id)}
                  onClick={() => setSelectedId(game.id)}
                />
              ))}
        </div>

        {/* Preview panel */}
        <div className="w-[240px] shrink-0 hidden sm:block">
          {isLoading ? (
            <Skeleton className="w-full h-full min-h-[400px] bg-steam-card rounded-sm" />
          ) : selectedGame ? (
            <PreviewPanel game={selectedGame} />
          ) : null}
        </div>
      </div>
    </section>
  )
}
