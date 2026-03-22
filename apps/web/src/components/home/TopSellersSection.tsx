'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAllGames } from '@/hooks/useGames'
import { useSetAtom } from 'jotai'
import { addToCartAtom } from '@/stores/cartStore'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import type { Game } from '@steam-clone/types'

const TABS = ['Popular New Releases', 'Top Sellers', 'Upcoming', 'Trending Free'] as const
type Tab = (typeof TABS)[number]

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
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 p-1.5 rounded-sm transition-colors text-left group h-auto justify-start',
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
        <PriceDisplay price={game.price} size="sm" />
      </div>
    </Button>
  )
}

function PreviewPanel({ game }: { game: Game }) {
  const addToCart = useSetAtom(addToCartAtom)

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
          <RatingBadge summary={game.rating.summary} />
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
            <PriceDisplay price={game.price} size="sm" />
            {!game.price.isFree ? (
              <Button
                variant="ghost"
                onClick={() => addToCart(game)}
                className="text-[11px] font-semibold text-white bg-steam-blue hover:bg-steam-cerulean px-3 py-1.5 rounded-sm transition-colors h-auto"
              >
                Add to Cart
              </Button>
            ) : (
              <Button variant="ghost" asChild className="text-[11px] font-semibold text-white bg-steam-blue hover:bg-steam-cerulean px-3 py-1.5 rounded-sm transition-colors h-auto">
                <Link href={`/app/${game.id}/${game.slug}`}>
                  Play Free
                </Link>
              </Button>
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
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as Tab)}>
        {/* Tab bar */}
        <TabsList className="flex items-end gap-0 mb-3 border-b border-steam-borderSubtle bg-transparent h-auto p-0 rounded-none justify-start w-full">
          {TABS.map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                'px-3 py-1.5 text-[13px] transition-colors relative rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=inactive]:text-steam-textMuted data-[state=inactive]:hover:text-steam-text',
                activeTab === tab && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-steam-blue after:content-[""]'
              )}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Two-column layout — same content for all tabs (data not filtered per tab) */}
        {TABS.map(tab => (
          <TabsContent key={tab} value={tab} className="mt-0">
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
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
