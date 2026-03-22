'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Game } from '@steam-clone/types'

const TABS = ['New Releases', 'Coming Soon', 'Recently Updated'] as const
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

function formatPrice(cents: number) {
  if (cents === 0) return 'Free'
  if (cents < 0) return 'Free to Play'
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Game Row ────────────────────────────────────────────────────────────────

function GameRow({ game }: { game: Game }) {
  const hasDiscount = game.price.discountPercent > 0
  const ratingColor = RATING_COLOR[game.rating.summary] ?? '#8f98a0'

  return (
    <Link
      href={`/app/${game.id}/${game.slug}`}
      className="flex gap-3 p-3 rounded-sm bg-[#16202d] hover:bg-[#1e2d3d] transition-colors group"
    >
      <img
        src={game.headerImage}
        alt={game.title}
        className="w-[184px] h-[69px] object-cover rounded-sm shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-[#c7d5e0] text-[13px] font-medium group-hover:text-white transition-colors truncate">
          {game.title}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {game.tags.slice(0, 4).map(tag => (
            <span key={tag.id} className="text-[10px] text-[#8f98a0] bg-[#1b2838] px-1.5 py-0.5 rounded-sm">
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-2 text-[11px]">
          <span style={{ color: ratingColor }}>{game.rating.summary}</span>
          <span className="text-[#4e5d6e]">·</span>
          <span className="text-[#8f98a0]">{formatDate(game.releaseDate)}</span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end justify-center gap-1">
        {hasDiscount && (
          <span className="bg-[#4c6b22] text-[#a4d007] text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
            -{game.price.discountPercent}%
          </span>
        )}
        <div className="text-right">
          {hasDiscount && (
            <p className="text-[11px] text-[#8f98a0] line-through">{formatPrice(game.price.initial)}</p>
          )}
          <p className={cn('text-[13px] font-semibold', hasDiscount ? 'text-[#acdbf5]' : 'text-[#c7d5e0]')}>
            {formatPrice(game.price.final)}
          </p>
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex gap-3 p-3 rounded-sm bg-[#16202d]">
      <Skeleton className="w-[184px] h-[69px] rounded-sm shrink-0 bg-[#1b2838]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48 bg-[#1b2838]" />
        <Skeleton className="h-3 w-32 bg-[#1b2838]" />
        <Skeleton className="h-3 w-40 bg-[#1b2838]" />
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NewReleasesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('New Releases')
  const { data: allGames = [], isLoading } = useAllGames()

  const games = useMemo(() => {
    const sorted = [...allGames].sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    )

    if (activeTab === 'New Releases') return sorted
    if (activeTab === 'Coming Soon') {
      // Show early access + upcoming (use first third of list as "coming soon")
      return sorted.filter(g => g.isEarlyAccess).concat(sorted.slice(0, 6))
    }
    // Recently Updated — show by lowest id (simulates recent patch)
    return [...allGames].sort((a, b) => b.id - a.id)
  }, [allGames, activeTab])

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-white text-[24px] font-bold tracking-tight">New & Upcoming</h1>
        <p className="text-[#8f98a0] text-[13px] mt-1">The latest releases and what&apos;s coming soon to Steam</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-5 border-b border-[#2a3a4a]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-[13px] font-medium transition-colors relative',
              activeTab === tab
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1a9fff]'
                : 'text-[#8f98a0] hover:text-[#c7d5e0]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Game List */}
      <div className="space-y-1.5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : games.map(game => <GameRow key={game.id} game={game} />)
        }
      </div>
    </div>
  )
}
