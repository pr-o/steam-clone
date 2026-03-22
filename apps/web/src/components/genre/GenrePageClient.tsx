'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Monitor, Apple, X as LinuxIcon } from 'lucide-react'
import { useGamesByGenre, useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Game } from '@steam-clone/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GENRE_COLORS: Record<string, { from: string; to: string }> = {
  action:        { from: '#1a3a2a', to: '#0f2018' },
  rpg:           { from: '#2a1a3a', to: '#180f20' },
  strategy:      { from: '#1a2a3a', to: '#0f1820' },
  simulation:    { from: '#1a3a38', to: '#0f2020' },
  indie:         { from: '#2a2a1a', to: '#20200f' },
  'free to play':{ from: '#1a2a1a', to: '#0f1a0f' },
  adventure:     { from: '#2a1a1a', to: '#1a0f0f' },
}

const SUB_GENRES: Record<string, string[]> = {
  action:     ['Action-Adventure', 'Action RPG', 'Arcade', 'Casual', 'Fighting', 'Open World', 'Platformer', 'Shooter'],
  rpg:        ['Action RPG', 'JRPG', 'Turn-Based', 'Roguelike', 'Tactical RPG', 'Open World'],
  strategy:   ['4X', 'City Builder', 'RTS', 'Tower Defense', 'Turn-Based', 'Grand Strategy'],
  simulation: ['City Builder', 'Farming', 'Flight', 'Management', 'Racing', 'Space'],
  indie:      ['Platformer', 'Puzzle', 'Roguelike', 'Metroidvania', 'Visual Novel'],
}

const TABS = ['Featured', 'New & Trending', 'Top Sellers', 'Top Rated', 'Upcoming'] as const
type Tab = (typeof TABS)[number]

const RATING_COLOR: Record<string, string> = {
  'Overwhelmingly Positive': '#66c0f4',
  'Very Positive': '#66c0f4',
  'Mostly Positive': '#66c0f4',
  Mixed: '#b9a074',
  'Mostly Negative': '#c34741',
  'Very Negative': '#c34741',
  'Overwhelmingly Negative': '#c34741',
}

function formatGenreName(raw: string) {
  return raw
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

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
        {game.price.isFree ? (
          <span className="text-steam-accentPale text-[12px] font-semibold shrink-0 ml-2">Free</span>
        ) : game.price.discountPercent > 0 ? (
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="bg-steam-discountBg text-steam-discountText text-[11px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
              -{game.price.discountPercent}%
            </span>
            <span className="text-steam-salePrice text-[13px] font-bold">{formatPrice(game.price.final)}</span>
          </div>
        ) : (
          <span className="text-steam-text text-[13px] font-semibold shrink-0 ml-2">{formatPrice(game.price.final)}</span>
        )}
      </div>
      {/* Platform icons */}
      <div className="absolute top-2 left-2 flex gap-1">
        {game.platforms.windows && <Monitor size={11} className="text-white/70" />}
        {game.platforms.mac && <Apple size={11} className="text-white/70" />}
        {game.platforms.linux && <LinuxIcon size={11} className="text-white/70" />}
      </div>
    </Link>
  )
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function GameListRow({ game }: { game: Game }) {
  const rc = RATING_COLOR[game.rating.summary] ?? '#66c0f4'
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
          <span className="text-[12px]" style={{ color: rc }}>{game.rating.summary}</span>
          <span className="text-steam-textDim text-[11px]">({game.rating.totalReviews.toLocaleString()} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 flex flex-col items-end justify-end w-[100px]">
        {game.price.isFree ? (
          <span className="text-steam-accentPale text-[14px] font-semibold">Free to Play</span>
        ) : game.price.discountPercent > 0 ? (
          <div className="flex flex-col items-end gap-0.5">
            <span className="bg-steam-discountBg text-steam-discountText text-[12px] font-bold px-2 py-0.5 rounded-sm">
              -{game.price.discountPercent}%
            </span>
            <span className="text-steam-textDim text-[11px] line-through">{formatPrice(game.price.initial)}</span>
            <span className="text-steam-salePrice text-[14px] font-bold">{formatPrice(game.price.final)}</span>
          </div>
        ) : (
          <span className="text-steam-text text-[14px] font-semibold">{formatPrice(game.price.final)}</span>
        )}
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
                <button
                  key={sg}
                  className={cn(
                    'px-4 py-2.5 text-[12px] uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors',
                    i === 0 ? 'text-white border-b-2 border-white' : 'text-[#8fbc8f] hover:text-white'
                  )}
                >
                  {sg}
                </button>
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
        <div className="flex items-end border-b border-steam-borderSubtle mb-4 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1) }}
              className={cn(
                'px-4 py-2 text-[12px] uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors relative',
                activeTab === tab ? 'text-white' : 'text-steam-textMuted hover:text-steam-text'
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-steam-blue" />
              )}
            </button>
          ))}
          <div className="ml-auto text-steam-textDim text-[12px] pb-2 shrink-0">
            {tabGames.length} titles
          </div>
        </div>

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
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-6 py-2 rounded-sm transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
