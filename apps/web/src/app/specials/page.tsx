'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Game } from '@steam-clone/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const GENRE_TABS = ['Featured', 'Action', 'Adventure', 'Casual', 'RPG', 'Simulation', 'Strategy', 'Sports & Racing', 'Controller', 'Co-op'] as const
type GenreTab = (typeof GENRE_TABS)[number]

const MOCK_EVENTS = [
  { title: 'Steam Spring Sale 2026', subtitle: 'Up to 90% off thousands of games', date: 'Sat, March 26, 2026', color: '#4c6b22' },
  { title: 'Publisher Weekend', subtitle: 'Indie Showcase — Up to 80% off', date: 'Fri, March 20, 2026', color: '#1b4d6e' },
  { title: 'Focus Spring Sale', subtitle: 'Up to 90% off', date: 'Sat, March 21, 2026', color: '#4a3a6e' },
  { title: 'Saber Spring Sale', subtitle: 'Up to 80% off select titles', date: 'Fri, March 20, 2026', color: '#6e2a2a' },
  { title: 'Genre Franchise Sale', subtitle: 'Franchise discounts live now', date: 'Fri, March 20, 2026', color: '#1b4d3e' },
  { title: 'Indie Playground', subtitle: 'DreamHack — Indie Gaming Festival', date: 'Fri, March 20, 2026', color: '#3a1b6e' },
]

const PRICE_FILTERS = [
  { value: 'any', label: 'Any Discount' },
  { value: '20', label: 'At Least 20% Off' },
  { value: '40', label: 'At Least 40% Off' },
  { value: '60', label: 'At Least 60% Off' },
  { value: '75', label: '75% Off or More' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RATING_COLOR: Record<string, string> = {
  'Overwhelmingly Positive': '#66c0f4',
  'Very Positive': '#66c0f4',
  'Mostly Positive': '#66c0f4',
  Mixed: '#b9a074',
  'Mostly Negative': '#c34741',
  'Very Negative': '#c34741',
  'Overwhelmingly Negative': '#c34741',
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: typeof MOCK_EVENTS[0] }) {
  return (
    <div
      className="relative overflow-hidden rounded-sm cursor-pointer group h-[140px] flex flex-col justify-end p-3"
      style={{ background: `linear-gradient(135deg, ${event.color} 0%, ${event.color}88 100%)` }}
    >
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #ffffff22 0%, transparent 60%)' }}
      />
      <p className="text-white font-bold text-[14px] leading-tight relative z-10">{event.title}</p>
      <p className="text-white/80 text-[11px] mt-0.5 relative z-10">{event.subtitle}</p>
      <p className="text-white/60 text-[10px] mt-1 relative z-10">{event.date}</p>
    </div>
  )
}

// ─── Game Row ─────────────────────────────────────────────────────────────────

function DiscountRow({ game }: { game: Game }) {
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

      {/* Discount price */}
      <div className="shrink-0 flex flex-col items-end justify-end w-[110px] gap-1">
        <span className="bg-steam-discountBg text-steam-discountText text-[14px] font-bold px-2.5 py-1 rounded-sm">
          -{game.price.discountPercent}%
        </span>
        <span className="text-steam-textDim text-[12px] line-through">{formatPrice(game.price.initial)}</span>
        <span className="text-steam-salePrice text-[16px] font-bold">{formatPrice(game.price.final)}</span>
      </div>
    </Link>
  )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  minDiscount, setMinDiscount,
}: {
  minDiscount: string; setMinDiscount: (v: string) => void
}) {
  return (
    <div className="w-[160px] shrink-0 hidden md:block">
      <div className="sticky top-[76px] flex flex-col gap-1">
        <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-2">Filters</p>

        <p className="text-steam-text text-[12px] font-semibold mb-1 flex items-center justify-between cursor-pointer hover:text-white transition-colors">
          Price <ChevronRight size={12} />
        </p>
        <div className="flex flex-col gap-1 pl-1 mb-4">
          {PRICE_FILTERS.map(f => (
            <label key={f.value} className="flex items-center gap-2 cursor-pointer group/opt">
              <input
                type="radio"
                name="discount"
                checked={minDiscount === f.value}
                onChange={() => setMinDiscount(f.value)}
                className="accent-steam-blue"
              />
              <span className={cn(
                'text-[11px] transition-colors',
                minDiscount === f.value ? 'text-steam-text' : 'text-steam-textMuted group-hover/opt:text-steam-text'
              )}>
                {f.label}
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-steam-link hover:text-steam-linkHover text-[11px] transition-colors text-left"
        >
          Return to top
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SpecialsPage() {
  const [activeTab, setActiveTab] = useState<GenreTab>('Featured')
  const [minDiscount, setMinDiscount] = useState('any')
  const { data: games, isLoading } = useAllGames()

  const discounted = useMemo(() => {
    const base = (games ?? []).filter(g => g.price.discountPercent > 0)
    if (minDiscount === 'any') return base
    const min = Number(minDiscount)
    return base.filter(g => g.price.discountPercent >= min)
  }, [games, minDiscount])

  return (
    <div>
      {/* Hero sale banner */}
      <div className="relative w-full h-[280px] overflow-hidden">
        <img
          src="https://placehold.co/1440x280/4c6b22/a4d007?text=STEAM+SPRING+SALE"
          alt="Steam Spring Sale"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[#a4d007] text-[13px] font-bold uppercase tracking-[0.3em] mb-1">Steam</p>
          <h1 className="text-white text-[52px] font-black uppercase leading-none tracking-[-0.02em] drop-shadow-lg">
            Spring Sale
          </h1>
          <p className="text-white/90 text-[16px] font-semibold mt-1 tracking-wider">
            On Now Thru Mar 26 at 10 AM PT
          </p>
        </div>
      </div>

      {/* "Discounts & Events" bar */}
      <div className="bg-[#4c6b22] border-b border-[#6b9313]">
        <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-2">
          <p className="text-white text-[13px] font-bold uppercase tracking-[0.2em] text-center">
            Discounts &amp; Events
          </p>
        </div>
      </div>

      {/* Genre tab strip */}
      <div className="bg-[#2a3f2a] border-b border-[#4c6b4c]">
        <ScrollArea className="max-w-[940px] mx-auto">
          <div className="flex items-center px-4 sm:px-0">
            {GENRE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2.5 text-[12px] uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors relative',
                  activeTab === tab
                    ? 'text-white border-b-2 border-white'
                    : 'text-[#8fbc8f] hover:text-white'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
        {/* Special Events grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-steam-navActive text-[13px] font-normal uppercase tracking-[0.12em]">
              Special Events
            </h2>
            <Link href="#" className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors">
              View All Events
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {MOCK_EVENTS.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </div>
        </div>

        {/* Discounts section */}
        <div className="flex gap-6 items-start">
          {/* Filter sidebar */}
          <FilterSidebar minDiscount={minDiscount} setMinDiscount={setMinDiscount} />

          {/* Game list */}
          <div className="flex-1 min-w-0">
            <p className="text-steam-textMuted text-[12px] mb-3">
              {isLoading ? 'Loading…' : `${discounted.length} discounted titles`}
            </p>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[144px] bg-steam-card rounded-sm mb-1" />
                ))
              : discounted.length === 0
              ? (
                <p className="text-steam-textMuted text-[14px] py-8 text-center">
                  No games match the selected discount level.
                </p>
              )
              : discounted.map(game => <DiscountRow key={game.id} game={game} />)
            }
          </div>
        </div>
      </div>
    </div>
  )
}
