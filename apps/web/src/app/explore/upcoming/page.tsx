'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn, formatDate } from '@/lib/utils'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import type { Game } from '@steam-clone/types'

const TABS = ['Coming Soon', 'In Early Access', 'Most Wishlisted'] as const
type Tab = (typeof TABS)[number]

// ─── Game Row ────────────────────────────────────────────────────────────────

function GameRow({ game }: { game: Game }) {
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
            <span
              key={tag.id}
              className="text-[10px] text-[#8f98a0] bg-[#1b2838] px-1.5 py-0.5 rounded-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-2 text-[11px]">
          <RatingBadge summary={game.rating.summary} />
          <span className="text-[#4e5d6e]">·</span>
          <span className="text-[#8f98a0]">{formatDate(game.releaseDate)}</span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end justify-center gap-1">
        <PriceDisplay price={game.price} size="sm" />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UpcomingReleasesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Coming Soon')
  const { data: allGames = [], isLoading } = useAllGames()

  const games = useMemo(() => {
    if (activeTab === 'Coming Soon') {
      return [...allGames]
        .filter(g => !g.isEarlyAccess)
        .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    }
    if (activeTab === 'In Early Access') {
      return [...allGames]
        .filter(g => g.isEarlyAccess)
        .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    }
    // Most Wishlisted — shuffle deterministically by id
    return [...allGames].sort((a, b) => (a.id * 17 + 3) % 31 - (b.id * 17 + 3) % 31)
  }, [allGames, activeTab])

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-white text-[24px] font-bold tracking-tight">Upcoming Releases</h1>
        <p className="text-[#8f98a0] text-[13px] mt-1">
          What&apos;s coming to Steam — browse by release status or wishlist popularity
        </p>
      </div>

      {/* Tab Bar */}
      <Tabs
        value={activeTab}
        onValueChange={v => setActiveTab(v as Tab)}
        className="w-full"
      >
        <TabsList className="flex gap-1 mb-5 border-b border-[#2a3a4a] bg-transparent h-auto rounded-none p-0">
          {TABS.map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                'px-4 py-2.5 text-[13px] font-medium transition-colors relative rounded-none bg-transparent',
                'data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#1a9fff]',
                'data-[state=inactive]:text-[#8f98a0] hover:text-[#c7d5e0]',
                'data-[state=active]:shadow-none'
              )}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(tab => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="space-y-1.5">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : games.map(game => <GameRow key={game.id} game={game} />)
              }
              {!isLoading && games.length === 0 && (
                <div className="py-16 text-center text-[#8f98a0] text-[13px]">
                  No games found in this category.
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
