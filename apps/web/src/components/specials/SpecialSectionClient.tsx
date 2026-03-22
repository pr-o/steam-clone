'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAllGames } from '@/hooks/useGames'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { Game } from '@steam-clone/types'

// ─── Slug Config ──────────────────────────────────────────────────────────────

interface SlugConfig {
  title: string
  subtitle: string
  accentColor: string
  bannerBgFrom: string
  bannerBgTo: string
}

const SLUG_CONFIG: Record<string, SlugConfig> = {
  demos: {
    title: 'Free Demos',
    subtitle: 'Try before you buy',
    accentColor: '#1a9fff',
    bannerBgFrom: '#0d2d45',
    bannerBgTo: '#071520',
  },
  dlc: {
    title: 'Downloadable Content',
    subtitle: 'Expand your favorite games',
    accentColor: '#7c3aed',
    bannerBgFrom: '#1a0d3a',
    bannerBgTo: '#0d0720',
  },
  'early-access': {
    title: 'Early Access',
    subtitle: 'Get in early and shape the game',
    accentColor: '#f59e0b',
    bannerBgFrom: '#2d1a0d',
    bannerBgTo: '#150a05',
  },
  software: {
    title: 'Software',
    subtitle: 'Tools, creative apps, and utilities on Steam',
    accentColor: '#059669',
    bannerBgFrom: '#0d2a1a',
    bannerBgTo: '#071510',
  },
  soundtracks: {
    title: 'Steam Soundtracks',
    subtitle: 'Listen to your favorite game OSTs',
    accentColor: '#ec4899',
    bannerBgFrom: '#2d0d2a',
    bannerBgTo: '#150715',
  },
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'New Releases' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'review', label: 'Review Score' },
]

const PRICE_FILTERS = [
  { value: 'any', label: 'Any Price' },
  { value: 'free', label: 'Free' },
  { value: '10', label: 'Under $10' },
  { value: '25', label: 'Under $25' },
]

const PAGE_SIZE = 10

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterGamesBySlug(games: Game[], slug: string): Game[] {
  if (slug === 'demos') return games.filter(g => g.price.isFree)
  if (slug === 'early-access') return games.filter(g => g.isEarlyAccess)
  return games
}

function applyPriceFilter(games: Game[], priceFilter: string): Game[] {
  if (priceFilter === 'any') return games
  if (priceFilter === 'free') return games.filter(g => g.price.isFree)
  if (priceFilter === '10') return games.filter(g => g.price.final < 1000)
  if (priceFilter === '25') return games.filter(g => g.price.final < 2500)
  return games
}

function applySort(games: Game[], sort: string): Game[] {
  const sorted = [...games]
  if (sort === 'new') {
    sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
  } else if (sort === 'price-asc') {
    sorted.sort((a, b) => a.price.final - b.price.final)
  } else if (sort === 'review') {
    const ORDER: Record<string, number> = {
      'Overwhelmingly Positive': 0,
      'Very Positive': 1,
      'Mostly Positive': 2,
      'Mixed': 3,
      'Mostly Negative': 4,
      'Very Negative': 5,
      'Overwhelmingly Negative': 6,
    }
    sorted.sort((a, b) => (ORDER[a.rating.summary] ?? 9) - (ORDER[b.rating.summary] ?? 9))
  }
  // 'popular' — keep original order (most popular first by default)
  return sorted
}

// ─── Game Row ─────────────────────────────────────────────────────────────────

function GameRow({ game }: { game: Game }) {
  const shortDesc =
    game.shortDescription.length > 80
      ? game.shortDescription.slice(0, 80) + '…'
      : game.shortDescription

  return (
    <Link
      href={`/app/${game.id}/${game.slug}`}
      className="flex gap-3 p-3 border-b border-[#2a3d52] hover:bg-[#1e3346] transition-colors duration-150 group"
    >
      {/* Header image */}
      <div className="shrink-0 w-[184px] h-[69px] overflow-hidden rounded-sm">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-[#c7d5e0] text-[14px] font-semibold leading-tight truncate">{game.title}</p>
        <p className="text-[#8f98a0] text-[11px] leading-snug">{shortDesc}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {game.tags.slice(0, 3).map(tag => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 text-[10px] text-[#8f98a0] bg-[#2a3d52]/60 border border-[#4a5c6a]/40 rounded-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Right col: rating, date, price */}
      <div className="shrink-0 flex flex-col items-end justify-between min-w-[110px]">
        <div className="flex flex-col items-end gap-0.5">
          <RatingBadge
            summary={game.rating.summary}
            score={game.rating.totalReviews}
            showScore={false}
            className="text-[11px]"
          />
          <span className="text-[#8f98a0] text-[10px]">
            {formatDate(game.releaseDate)}
          </span>
        </div>
        <PriceDisplay price={game.price} size="sm" />
      </div>
    </Link>
  )
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex gap-3 p-3 border-b border-[#2a3d52]">
      <Skeleton className="shrink-0 w-[184px] h-[69px] rounded-sm bg-[#16202d]" />
      <div className="flex-1 flex flex-col gap-2 py-1">
        <Skeleton className="h-4 w-3/4 bg-[#16202d] rounded-sm" />
        <Skeleton className="h-3 w-full bg-[#16202d] rounded-sm" />
        <Skeleton className="h-3 w-1/2 bg-[#16202d] rounded-sm" />
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2 py-1 min-w-[100px]">
        <Skeleton className="h-3 w-20 bg-[#16202d] rounded-sm" />
        <Skeleton className="h-4 w-14 bg-[#16202d] rounded-sm" />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  slug: string
}

export function SpecialSectionClient({ slug }: Props) {
  const config = SLUG_CONFIG[slug] ?? {
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    subtitle: 'Explore titles',
    accentColor: '#66c0f4',
    bannerBgFrom: '#1b2838',
    bannerBgTo: '#0d1520',
  }

  const [sort, setSort] = useState('popular')
  const [priceFilter, setPriceFilter] = useState('any')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { data: allGames, isLoading } = useAllGames()

  const filteredGames = useMemo(() => {
    const base = filterGamesBySlug(allGames ?? [], slug)
    const priceFiltered = applyPriceFilter(base, priceFilter)
    return applySort(priceFiltered, sort)
  }, [allGames, slug, priceFilter, sort])

  const visibleGames = filteredGames.slice(0, visibleCount)
  const hasMore = visibleCount < filteredGames.length

  const encodedTitle = encodeURIComponent(config.title)
  const bannerImageUrl = `https://placehold.co/1280x300/0a0f14/66c0f4?text=${encodedTitle}`

  return (
    <div style={{ backgroundColor: '#171a21', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div
        className="relative w-full h-[200px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${config.bannerBgFrom} 0%, ${config.bannerBgTo} 100%)`,
        }}
      >
        {/* Background image with dark overlay */}
        <img
          src={bannerImageUrl}
          alt={config.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171a21]/80 via-transparent to-transparent" />

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1
            className="text-[36px] font-black uppercase leading-none tracking-[-0.02em] drop-shadow-lg"
            style={{ color: config.accentColor }}
          >
            {config.title}
          </h1>
          <p className="text-[#8f98a0] text-[14px] mt-2 tracking-wide">
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="border-b border-[#2a3d52]"
        style={{ backgroundColor: '#1b2838' }}
      >
        <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-2 flex items-center gap-4">
          <span className="text-[#c7d5e0] text-[12px] font-semibold">
            {isLoading ? '—' : filteredGames.length} titles available
          </span>
          <span className="text-[#4a5c6a] text-[11px]">|</span>
          <span className="text-[#8f98a0] text-[11px]">Updated daily</span>
        </div>
      </div>

      {/* Category label bar */}
      <div
        className="border-b border-[#2a3d52]"
        style={{ backgroundColor: '#1b2838' }}
      >
        <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-2">
          <p
            className="text-[13px] font-bold uppercase tracking-[0.2em] text-center"
            style={{ color: config.accentColor }}
          >
            {config.title}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
        {/* Filter + Sort row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#2a3d52]">
          {/* Price filter */}
          <div className="flex items-center gap-4">
            <span className="text-[#8f98a0] text-[11px] uppercase tracking-wider shrink-0">Price</span>
            <RadioGroup
              value={priceFilter}
              onValueChange={setPriceFilter}
              className="flex flex-row flex-wrap gap-x-4 gap-y-1"
            >
              {PRICE_FILTERS.map(f => (
                <div key={f.value} className="flex items-center gap-1.5 cursor-pointer group/opt">
                  <RadioGroupItem
                    value={f.value}
                    id={`price-${f.value}`}
                    className="w-3.5 h-3.5"
                  />
                  <Label
                    htmlFor={`price-${f.value}`}
                    className={`text-[11px] cursor-pointer transition-colors ${
                      priceFilter === f.value ? 'text-[#c7d5e0]' : 'text-[#8f98a0] group-hover/opt:text-[#c7d5e0]'
                    }`}
                  >
                    {f.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[#8f98a0] text-[11px] uppercase tracking-wider">Sort by</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-7 text-[12px] bg-[#1b2838] border-[#2a3d52] text-[#c7d5e0] w-[160px] focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1b2838] border-[#2a3d52] text-[#c7d5e0]">
                {SORT_OPTIONS.map(o => (
                  <SelectItem
                    key={o.value}
                    value={o.value}
                    className="text-[12px] text-[#c7d5e0] focus:bg-[#2a3d52] focus:text-white cursor-pointer"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Game list */}
        <div className="rounded-sm overflow-hidden border border-[#2a3d52]" style={{ backgroundColor: '#16202d' }}>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          ) : filteredGames.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#8f98a0] text-[14px]">No titles found matching your filters.</p>
            </div>
          ) : (
            visibleGames.map(game => <GameRow key={game.id} game={game} />)
          )}
        </div>

        {/* Load More */}
        {!isLoading && hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              variant="outline"
              className="px-8 text-[13px] border-[#4a5c6a] text-[#c7d5e0] bg-transparent hover:bg-[#1e3346] hover:text-white hover:border-[#66c0f4] transition-colors"
            >
              Show More ({filteredGames.length - visibleCount} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
