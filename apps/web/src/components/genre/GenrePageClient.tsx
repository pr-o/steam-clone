'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useGamesByGenre, useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn, formatGenreName } from '@/lib/utils'
import { GENRE_COLORS, SUB_GENRES } from '@/lib/constants'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { PlatformIcons } from '@/components/shared/PlatformIcons'
import type { Game } from '@steam-clone/types'

// ─── Types ───────────────────────────────────────────────────────────────────

const TABS = ['Featured', 'New & Trending', 'Top Sellers', 'Top Rated', 'Upcoming'] as const
type Tab = (typeof TABS)[number]

// ─── Featured Card ────────────────────────────────────────────────────────────

function FeaturedCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/app/${game.id}/${game.slug}`}
      className="relative overflow-hidden rounded-sm group block"
    >
      <img
        src={game.headerImage}
        alt={game.title}
        className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
        <p className="text-white font-bold text-[15px] leading-tight line-clamp-1 drop-shadow">{game.title}</p>
        <PriceDisplay price={game.price} size="sm" className="shrink-0 ml-2" />
      </div>
      {/* Platform icons */}
      <PlatformIcons platforms={game.platforms} size={11} className="absolute top-2 left-2 text-white/70" />
    </Link>
  )
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function GameListRow({ game }: { game: Game }) {
  return (
    <Link
      href={`/app/${game.id}/${game.slug}`}
      className="flex gap-4 p-4 border-b border-steam-borderSubtle hover:bg-[#1e3346] transition-colors group"
    >
      {/* Capsule */}
      <div className="shrink-0 w-[292px] h-[136px] overflow-hidden rounded-sm">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-steam-text text-[16px] font-semibold leading-tight">{game.title}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 4).map(tag => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 text-[10px] text-steam-textMuted bg-[#4a5c6a]/30 border border-[#4a5c6a]/50 rounded-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <p className="text-steam-textMuted text-[12px] leading-relaxed line-clamp-2">{game.shortDescription}</p>

        <div className="mt-auto flex flex-col gap-0.5 text-[11px] text-steam-textDim">
          <span>Release Date: {game.releaseDate}</span>
          <span>Developed by: {game.developer}</span>
          <span>Published by: {game.publisher}</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <RatingBadge summary={game.rating.summary} className="text-[12px]" />
          <span className="text-steam-textDim text-[11px]">({game.rating.totalReviews.toLocaleString()} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 flex flex-col items-end justify-end w-[100px]">
        <PriceDisplay price={game.price} size="md" />
      </div>
    </Link>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10

export function GenrePageClient({ genreName }: { genreName: string }) {
  const displayName = formatGenreName(genreName)
  const colors = GENRE_COLORS[genreName.toLowerCase()] ?? { from: '#1a2a3a', to: '#0f1820' }
  const subGenres = SUB_GENRES[genreName.toLowerCase()] ?? []

  const [activeTab, setActiveTab] = useState<Tab>('Featured')
  const [page, setPage] = useState(1)

  const { data: genreGames, isLoading } = useGamesByGenre(displayName)
  const { data: allGames } = useAllGames()

  const baseGames = genreGames ?? allGames ?? []

  const tabGames = useMemo(() => {
    let list = [...baseGames]
    if (activeTab === 'Top Sellers') list.sort((a, b) => b.rating.totalReviews - a.rating.totalReviews)
    else if (activeTab === 'Top Rated') list.sort((a, b) => b.rating.score - a.rating.score)
    else if (activeTab === 'New & Trending') list.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    else if (activeTab === 'Upcoming') list = list.filter(g => new Date(g.releaseDate) > new Date())
    return list
  }, [baseGames, activeTab])

  const featured = baseGames.filter(g => g.isFeatured || g.price.discountPercent > 0).slice(0, 6)
  const paginated = tabGames.slice(0, page * PAGE_SIZE)
  const hasMore = tabGames.length > paginated.length

  return (
    <div>
      {/* Genre banner */}
      <div
        className="relative w-full h-[200px] flex items-end"
        style={{ background: `linear-gradient(180deg, ${colors.from} 0%, ${colors.to} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff11 0px, #ffffff11 1px, transparent 1px, transparent 8px)' }}
        />
        <div className="relative max-w-[940px] mx-auto px-4 sm:px-0 w-full pb-5">
          <div className="inline-block bg-[#4c9153]/80 px-4 py-1.5 rounded-sm">
            <h1 className="text-white text-[22px] font-bold uppercase tracking-[0.15em]">{displayName}</h1>
          </div>
        </div>
      </div>

      {/* Sub-genre tabs */}
      {subGenres.length > 0 && (
        <div className="bg-[#2a3f2a] border-b border-[#4c6b4c]">
          <ScrollArea className="max-w-[940px] mx-auto">
            <div className="flex items-center px-4 sm:px-0">
              {subGenres.map((sg, i) => (
                <Button
                  key={sg}
                  variant="ghost"
                  className={cn(
                    'px-4 py-2.5 text-[12px] uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors',
                    i === 0 ? 'text-white border-b-2 border-white' : 'text-[#8fbc8f] hover:text-white'
                  )}
                >
                  {sg}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
        {/* Featured grid */}
        {featured.length > 0 && (
          <div className="mb-8">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] bg-steam-card rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {featured.map(game => <FeaturedCard key={game.id} game={game} />)}
              </div>
            )}
          </div>
        )}

        {/* Tab bar */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => { setActiveTab(val as Tab); setPage(1) }}
        >
          <div className="flex items-end border-b border-steam-borderSubtle mb-4">
            <TabsList className="h-auto bg-transparent p-0 gap-0 flex items-end overflow-x-auto">
              {TABS.map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={cn(
                    'px-4 py-2 text-[12px] uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors relative rounded-none',
                    'data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white',
                    'data-[state=inactive]:text-steam-textMuted hover:text-steam-text',
                    'data-[state=active]:border-b-2 data-[state=active]:border-steam-blue'
                  )}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="ml-auto text-steam-textDim text-[12px] pb-2 shrink-0">
              {tabGames.length} titles
            </div>
          </div>

          {TABS.map(tab => (
            <TabsContent key={tab} value={tab} className="mt-0">
              {/* Game list */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[144px] bg-steam-card rounded-sm mb-1" />
                ))
              ) : tabGames.length === 0 ? (
                <p className="text-steam-textMuted text-[14px] py-8 text-center">
                  No {displayName} games found.
                </p>
              ) : (
                <>
                  {paginated.map(game => <GameListRow key={game.id} game={game} />)}
                  {hasMore && (
                    <div className="text-center pt-6">
                      <Button
                        variant="ghost"
                        onClick={() => setPage(p => p + 1)}
                        className="text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-6 py-2 rounded-sm transition-colors"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
