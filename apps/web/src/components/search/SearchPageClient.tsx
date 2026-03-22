'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { useAllGames, useSearchGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { PlatformIcons } from '@/components/shared/PlatformIcons'
import type { Game } from '@steam-clone/types'

// ─── Types ───────────────────────────────────────────────────────────────────

type SortKey = 'relevance' | 'name' | 'release' | 'price_asc' | 'price_desc'
type PriceFilter = 'any' | 'free' | 'under5' | 'under10' | 'under20' | 'sale'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyFilters(
  games: Game[],
  price: PriceFilter,
  tags: string[],
  os: string[],
  sort: SortKey
): Game[] {
  let result = [...games]

  // Price
  if (price === 'free') result = result.filter(g => g.price.isFree)
  else if (price === 'under5') result = result.filter(g => g.price.final <= 500)
  else if (price === 'under10') result = result.filter(g => g.price.final <= 1000)
  else if (price === 'under20') result = result.filter(g => g.price.final <= 2000)
  else if (price === 'sale') result = result.filter(g => g.price.discountPercent > 0)

  // Tags
  if (tags.length > 0) {
    result = result.filter(g => tags.some(t => g.tags.some(gt => gt.name === t)))
  }

  // OS
  if (os.includes('windows')) result = result.filter(g => g.platforms.windows)
  if (os.includes('mac')) result = result.filter(g => g.platforms.mac)
  if (os.includes('linux')) result = result.filter(g => g.platforms.linux)

  // Sort
  if (sort === 'name') result.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort === 'release') result.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  else if (sort === 'price_asc') result.sort((a, b) => a.price.final - b.price.final)
  else if (sort === 'price_desc') result.sort((a, b) => b.price.final - a.price.final)

  return result
}

// ─── Result Row ───────────────────────────────────────────────────────────────

function ResultRow({ game }: { game: Game }) {
  return (
    <Link
      href={`/app/${game.id}/${game.slug}`}
      className="flex items-stretch gap-0 bg-steam-bg hover:bg-[#1e3346] transition-colors border-b border-steam-borderSubtle group"
    >
      {/* Capsule art */}
      <div className="shrink-0 w-[184px] h-[69px] overflow-hidden">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex items-center px-3 py-2 gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-steam-text text-[14px] font-medium leading-tight truncate">{game.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <PlatformIcons platforms={game.platforms} size={11} className="text-steam-textMuted" />
            <RatingBadge summary={game.rating.summary} className="text-[11px]" />
          </div>
        </div>

        {/* Date */}
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-steam-textMuted text-[12px]">{game.releaseDate}</p>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 flex items-center justify-end pr-3 w-[120px]">
        <PriceDisplay price={game.price} size="sm" />
      </div>
    </Link>
  )
}

// ─── Filter Section ───────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-steam-borderSubtle">
      <Button
        variant="ghost"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-2 text-[12px] font-semibold text-steam-text hover:text-white transition-colors"
      >
        {title}
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </Button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

const ALL_TAGS = [
  'Action', 'RPG', 'Strategy', 'Simulation', 'Indie',
  'Multiplayer', 'Singleplayer', 'Open World', 'FPS', 'Adventure',
]

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: 'any', label: 'Any Price' },
  { value: 'free', label: 'Free to Play' },
  { value: 'sale', label: 'Special Offers' },
  { value: 'under5', label: 'Under $5' },
  { value: 'under10', label: 'Under $10' },
  { value: 'under20', label: 'Under $20' },
]

function FilterSidebar({
  price, setPrice,
  tags, setTags,
  os, setOs,
}: {
  price: PriceFilter; setPrice: (p: PriceFilter) => void
  tags: string[]; setTags: (t: string[]) => void
  os: string[]; setOs: (o: string[]) => void
}) {
  function toggleTag(tag: string) {
    setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
  }
  function toggleOs(name: string) {
    setOs(os.includes(name) ? os.filter(o => o !== name) : [...os, name])
  }

  return (
    <div className="flex flex-col">
      <FilterSection title="Narrow by Price">
        <RadioGroup
          value={price}
          onValueChange={(val) => setPrice(val as PriceFilter)}
          className="flex flex-col gap-1"
        >
          {PRICE_OPTIONS.map(opt => (
            <div key={opt.value} className="flex items-center gap-2 cursor-pointer group/opt">
              <RadioGroupItem
                value={opt.value}
                id={`price-${opt.value}`}
                className="accent-steam-blue"
              />
              <Label
                htmlFor={`price-${opt.value}`}
                className={cn('text-[12px] transition-colors cursor-pointer', price === opt.value ? 'text-steam-text' : 'text-steam-textMuted group-hover/opt:text-steam-text')}
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      <FilterSection title="Narrow by Tag">
        <div className="flex flex-col gap-1">
          {ALL_TAGS.map(tag => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer group/tag">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="accent-steam-blue"
              />
              <span className={cn('text-[12px] transition-colors', tags.includes(tag) ? 'text-steam-text' : 'text-steam-textMuted group-hover/tag:text-steam-text')}>
                {tag}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Narrow by OS">
        {(['windows', 'mac', 'linux'] as const).map(name => (
          <label key={name} className="flex items-center gap-2 cursor-pointer group/os capitalize">
            <input
              type="checkbox"
              checked={os.includes(name)}
              onChange={() => toggleOs(name)}
              className="accent-steam-blue"
            />
            <span className={cn('text-[12px] transition-colors capitalize', os.includes(name) ? 'text-steam-text' : 'text-steam-textMuted group-hover/os:text-steam-text')}>
              {name}
            </span>
          </label>
        ))}
      </FilterSection>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [sort, setSort] = useState<SortKey>('relevance')
  const [price, setPrice] = useState<PriceFilter>('any')
  const [tags, setTags] = useState<string[]>([])
  const [os, setOs] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: searchResults, isLoading: searchLoading } = useSearchGames(query)
  const { data: allGames, isLoading: allLoading } = useAllGames()

  const baseGames = query.length > 1 ? searchResults : allGames
  const isLoading = query.length > 1 ? searchLoading : allLoading

  const filtered = useMemo(
    () => applyFilters(baseGames ?? [], price, tags, os, sort),
    [baseGames, price, tags, os, sort]
  )

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-4">
      {/* Header */}
      <h1 className="text-steam-text text-[18px] font-semibold mb-4">
        {query ? `Search results for "${query}"` : 'All Products'}
      </h1>

      {/* Controls row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-steam-textMuted text-[12px]">
          {isLoading ? 'Loading…' : `${filtered.length} results`}
        </p>
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowFilters(s => !s)}
            className="md:hidden flex items-center gap-1.5 text-[12px] text-steam-textMuted hover:text-steam-text transition-colors"
          >
            <SlidersHorizontal size={13} />
            Filters
          </Button>
          {/* Sort */}
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="text-steam-textMuted">Sort by:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-2 py-1 outline-none focus:border-steam-blue cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="release">Release Date</option>
              <option value="name">Name</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-4 items-start">
        {/* Results list */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[69px] bg-steam-card rounded-sm mb-0.5" />
            ))
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <img
                src="https://placehold.co/120x120/1b2838/4a7a9b?text=:("
                alt=""
                className="mx-auto mb-4 rounded-sm opacity-50"
              />
              <p className="text-steam-textMuted text-[14px]">No results match your filters.</p>
              <Button
                variant="ghost"
                onClick={() => { setPrice('any'); setTags([]); setOs([]) }}
                className="mt-3 text-steam-link hover:text-steam-linkHover text-[12px] transition-colors"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filtered.map(game => <ResultRow key={game.id} game={game} />)
          )}
        </div>

        {/* Filter sidebar — desktop always visible, mobile toggled */}
        <div className={cn('w-[220px] shrink-0', showFilters ? 'block' : 'hidden md:block')}>
          <ScrollArea className="max-h-[calc(100vh-140px)]">
            <FilterSidebar
              price={price} setPrice={setPrice}
              tags={tags} setTags={setTags}
              os={os} setOs={setOs}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
