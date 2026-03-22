'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import {
  Heart,
  MessageSquare,
  Star,
  Users,
  Camera,
  ChevronRight,
  LogIn,
  ImageIcon,
  Palette,
  Video,
  Wrench,
  Home,
  BookOpen,
} from 'lucide-react'
import { useAllGames } from '@/hooks/useGames'
import { isSignedInAtom } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Game } from '@steam-clone/types'

// ─── Static mock data ──────────────────────────────────────────────────────────

const COMMUNITY_STATS = {
  onlineNow: 8_241_337,
  screenshotsThisWeek: 124_802,
  newDiscussions: 34_217,
  workshopItems: 2_890_445,
}

const MOCK_USERNAMES = [
  'ShadowByte', 'NightOwl99', 'PixelKnight', 'GamerPro',
  'IndieHunter', 'RPGFanatic', 'StrategyMaster', 'CyberWolf',
  'VoidWalker', 'StarForge', 'IronClad88', 'FrostBite47',
]

const MOCK_DISCUSSION_TITLES = [
  'Anyone else experiencing lag spikes after last patch?',
  'Best settings for competitive play — share yours',
  'Weekly tournament signups are now open!',
  'New map confirmed — what are your thoughts?',
  'Achievement hunting guide — tips & tricks',
  'Looking for team members for ranked matches',
  'Patch notes analysis — what changed and why it matters',
  'Controller vs. mouse debate — where do you stand?',
]

const WORKSHOP_TITLES = [
  'Enhanced Texture Pack HD',
  'Realistic Weapon Sounds',
  'UI Overhaul — Dark Theme',
  'Custom Map Collection Vol.3',
  'Character Skin Bundle',
  'Performance Optimization Mod',
  'Lore-Friendly Item Pack',
  'Seasonal Event Decorations',
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

function pseudoRandom(seed: number, max: number, min = 0) {
  const x = Math.sin(seed + 1) * 10000
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar() {
  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 text-xs"
      style={{ background: '#16202d', borderBottom: '1px solid #2a3f5a' }}
    >
      {[
        { icon: <Users size={12} />, label: `${fmtNumber(COMMUNITY_STATS.onlineNow)} members online` },
        { icon: <Camera size={12} />, label: `${fmtNumber(COMMUNITY_STATS.screenshotsThisWeek)} new screenshots this week` },
        { icon: <MessageSquare size={12} />, label: `${fmtNumber(COMMUNITY_STATS.newDiscussions)} new discussions today` },
        { icon: <Wrench size={12} />, label: `${fmtNumber(COMMUNITY_STATS.workshopItems)} workshop items` },
      ].map(({ icon, label }) => (
        <div key={label} className="flex items-center gap-1.5" style={{ color: '#8f98a0' }}>
          <span style={{ color: '#66c0f4' }}>{icon}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2
        className="text-sm font-semibold uppercase tracking-wider"
        style={{ color: '#c7d5e0', letterSpacing: '0.08em' }}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs transition-colors duration-150 hover:underline"
          style={{ color: '#66c0f4' }}
        >
          View all <ChevronRight size={12} />
        </Link>
      )}
    </div>
  )
}

// ─── Screenshot Card ───────────────────────────────────────────────────────────

function ScreenshotCardSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="w-full aspect-video rounded-sm" style={{ background: '#1e2d3d' }} />
      <Skeleton className="h-3 w-3/4 rounded-sm" style={{ background: '#1e2d3d' }} />
      <Skeleton className="h-3 w-1/2 rounded-sm" style={{ background: '#1e2d3d' }} />
    </div>
  )
}

function ScreenshotCard({ game, index }: { game: Game; index: number }) {
  const username = MOCK_USERNAMES[index % MOCK_USERNAMES.length]
  const likes = pseudoRandom(index * 7 + 3, 2400, 12)
  const comments = pseudoRandom(index * 5 + 1, 340, 2)
  const bgColors = ['1b2838', '16202d', '1a2c3d', '0d1b2a', '1e2f40', '172030']
  const fgColors = ['66c0f4', 'c7d5e0', '8f98a0', '5db3e8', 'a0c8e0', '7aafcf']
  const bg = bgColors[index % bgColors.length]
  const fg = fgColors[index % fgColors.length]
  const imgUrl = `https://placehold.co/320x180/${bg}/${fg}?text=${encodeURIComponent(game.title)}`

  return (
    <div
      className="group flex flex-col gap-1.5 cursor-pointer"
      tabIndex={0}
      role="button"
      aria-label={`Screenshot from ${game.title} by ${username}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{ aspectRatio: '16/9', background: '#0d1b2a' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={`${game.title} screenshot`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#c7d5e0' }}>
            <Heart size={12} style={{ color: '#e95f5f' }} /> {fmtNumber(likes)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#c7d5e0' }}>
            <MessageSquare size={12} style={{ color: '#66c0f4' }} /> {fmtNumber(comments)}
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium leading-tight truncate" style={{ color: '#c7d5e0' }}>
          {game.title}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs truncate" style={{ color: '#8f98a0' }}>{username}</p>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-0.5 text-xs" style={{ color: '#8f98a0' }}>
              <Heart size={10} /> {fmtNumber(likes)}
            </span>
            <span className="flex items-center gap-0.5 text-xs" style={{ color: '#8f98a0' }}>
              <MessageSquare size={10} /> {fmtNumber(comments)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Discussion Row ────────────────────────────────────────────────────────────

function DiscussionRow({ game, index }: { game: Game; index: number }) {
  const title = MOCK_DISCUSSION_TITLES[index % MOCK_DISCUSSION_TITLES.length]
  const replies = pseudoRandom(index * 11 + 7, 1200, 3)
  const hoursAgo = pseudoRandom(index * 3, 47, 1)
  const timeLabel = hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`

  return (
    <div
      className="flex items-start gap-3 py-2.5 group cursor-pointer"
      style={{ borderBottom: '1px solid #1e2d3d' }}
      tabIndex={0}
      role="button"
    >
      <div
        className="shrink-0 rounded-sm overflow-hidden"
        style={{ width: 32, height: 32, background: '#0d1b2a' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://placehold.co/32x32/1b2838/66c0f4?text=${encodeURIComponent(game.title.slice(0, 2))}`}
          alt={game.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs leading-snug truncate group-hover:underline"
          style={{ color: '#66c0f4' }}
        >
          {title}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: '#8f98a0' }}>{game.title}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs" style={{ color: '#8f98a0' }}>{fmtNumber(replies)} replies</p>
        <p className="text-xs" style={{ color: '#4e5b68' }}>{timeLabel}</p>
      </div>
    </div>
  )
}

// ─── Workshop Card ────────────────────────────────────────────────────────────

function WorkshopCard({ game, index }: { game: Game; index: number }) {
  const title = WORKSHOP_TITLES[index % WORKSHOP_TITLES.length]
  const rating = (pseudoRandom(index * 9 + 4, 5, 3) / 5) * 5
  const fullStars = Math.floor(rating)
  const downloads = pseudoRandom(index * 13 + 6, 98000, 200)
  const bgPalette = ['2a1b3d', '1b3a2a', '3a1b1b', '1b2e3a', '2e2a1b', '1b3d3a', '2e1b3a', '1b2a3d']
  const bg = bgPalette[index % bgPalette.length]

  return (
    <div
      className="flex-shrink-0 flex flex-col group cursor-pointer"
      style={{ width: 180 }}
    >
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ width: 180, height: 100, background: '#0d1b2a' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://placehold.co/180x100/${bg}/c7d5e0?text=${encodeURIComponent(title.split(' ').slice(0, 2).join(' '))}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(26,159,255,0.12)' }}
        />
      </div>
      <div className="mt-1.5 px-0.5">
        <p
          className="text-xs font-medium leading-tight line-clamp-2"
          style={{ color: '#c7d5e0', minHeight: 30 }}
        >
          {title}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: '#8f98a0' }}>{game.title}</p>
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={9}
              fill={i < fullStars ? '#a4d007' : 'none'}
              style={{ color: i < fullStars ? '#a4d007' : '#4e5b68' }}
            />
          ))}
          <span className="text-xs ml-1" style={{ color: '#8f98a0' }}>{fmtNumber(downloads)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Community Hub Panel ──────────────────────────────────────────────────────

function CommunityHubPanel({ isSignedIn }: { isSignedIn: boolean }) {
  if (!isSignedIn) {
    return (
      <div
        className="rounded-sm p-4 flex flex-col gap-3"
        style={{ background: '#1b2838', border: '1px solid #2a3f5a' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#c7d5e0', letterSpacing: '0.08em' }}>
          Community Hub
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#8f98a0' }}>
          Sign in to post screenshots, write reviews, and join discussions.
        </p>
        <Button
          asChild
          size="sm"
          className="w-full text-xs font-semibold uppercase tracking-wide"
          style={{
            background: 'linear-gradient(to right, #1a9fff, #00adee)',
            color: '#fff',
            border: 'none',
          }}
        >
          <Link href="/login">
            <LogIn size={13} className="mr-1.5" />
            Sign In
          </Link>
        </Button>
        <p className="text-center text-xs" style={{ color: '#4e5b68' }}>
          New to Steam?{' '}
          <Link href="/join" className="hover:underline" style={{ color: '#66c0f4' }}>
            Join for free
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-sm p-4 flex flex-col gap-3"
      style={{ background: '#1b2838', border: '1px solid #2a3f5a' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#c7d5e0', letterSpacing: '0.08em' }}>
        Your Activity
      </p>
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://placehold.co/40x40/1b2838/66c0f4?text=SU"
          alt="Avatar"
          className="rounded-sm"
          style={{ width: 40, height: 40 }}
        />
        <div>
          <p className="text-xs font-semibold" style={{ color: '#c7d5e0' }}>SteamUser</p>
          <p className="text-xs" style={{ color: '#8f98a0' }}>Member since 2010</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        {[
          { label: 'Screenshots', val: '47' },
          { label: 'Reviews', val: '12' },
          { label: 'Workshop', val: '3' },
          { label: 'Guides', val: '8' },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="rounded-sm py-2 px-1"
            style={{ background: '#16202d' }}
          >
            <p className="text-sm font-bold" style={{ color: '#66c0f4' }}>{val}</p>
            <p className="text-xs" style={{ color: '#8f98a0' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Loading Skeletons ─────────────────────────────────────────────────────────

function ScreenshotsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 9 }, (_, i) => <ScreenshotCardSkeleton key={i} />)}
    </div>
  )
}

function DiscussionsSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex gap-3 py-2.5" style={{ borderBottom: '1px solid #1e2d3d' }}>
          <Skeleton className="shrink-0 rounded-sm" style={{ width: 32, height: 32, background: '#1e2d3d' }} />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-3 w-full rounded-sm" style={{ background: '#1e2d3d' }} />
            <Skeleton className="h-3 w-2/3 rounded-sm" style={{ background: '#1e2d3d' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Home Tab Content ──────────────────────────────────────────────────────────

function HomeTabContent({ games, isSignedIn }: { games: Game[]; isSignedIn: boolean }) {
  const sorted = useMemo(() => [...games].sort((a, b) => a.id - b.id), [games])
  const screenshotGames = sorted.slice(0, 9)
  const discussionGames = sorted.slice(0, 5)
  const workshopGames = sorted.slice(0, 8)

  return (
    <div className="flex flex-col gap-6">
      {/* 2-col layout */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: screenshots grid */}
        <div className="flex-1 min-w-0">
          <SectionHeader title="Recent Screenshots & Artwork" href="/community/screenshots" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {screenshotGames.map((g, i) => (
              <ScreenshotCard key={g.id} game={g} index={i} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full md:w-[272px] shrink-0 flex flex-col gap-4">
          <div>
            <SectionHeader title="Popular Discussions" href="/community/discussions" />
            <div>
              {discussionGames.map((g, i) => (
                <DiscussionRow key={g.id} game={g} index={i} />
              ))}
            </div>
          </div>
          <CommunityHubPanel isSignedIn={isSignedIn} />
        </div>
      </div>

      {/* Featured Workshop Items */}
      <div>
        <SectionHeader title="Featured Workshop Items" href="/community/workshop" />
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-3">
            {workshopGames.map((g, i) => (
              <WorkshopCard key={g.id} game={g} index={i} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}

// ─── Placeholder Tab ──────────────────────────────────────────────────────────

function PlaceholderTabContent({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-3 rounded-sm"
      style={{ background: '#1b2838', border: '1px solid #2a3f5a' }}
    >
      <p className="text-sm" style={{ color: '#8f98a0' }}>{label} content coming soon.</p>
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
        style={{ borderColor: '#2a3f5a', color: '#66c0f4', background: 'transparent' }}
      >
        Browse all
      </Button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const TAB_ITEMS = [
  { value: 'home', label: 'Home', icon: <Home size={13} /> },
  { value: 'discussions', label: 'Discussions', icon: <MessageSquare size={13} /> },
  { value: 'screenshots', label: 'Screenshots', icon: <Camera size={13} /> },
  { value: 'artwork', label: 'Artwork', icon: <Palette size={13} /> },
  { value: 'videos', label: 'Videos', icon: <Video size={13} /> },
  { value: 'workshop', label: 'Workshop', icon: <Wrench size={13} /> },
  { value: 'guides', label: 'Guides', icon: <BookOpen size={13} /> },
]

export default function CommunityPage() {
  const { data: games, isLoading } = useAllGames()
  const isSignedIn = useAtomValue(isSignedInAtom)
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen" style={{ background: '#171a21' }}>
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d1b2a 0%, #1b2838 60%, #171a21 100%)',
          borderBottom: '1px solid #2a3f5a',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,159,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-[940px] mx-auto px-4 pt-8 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-1"
                style={{ color: '#1a9fff' }}
              >
                Steam
              </p>
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{
                  color: '#c7d5e0',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 12px rgba(26,159,255,0.2)',
                }}
              >
                Community
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8f98a0' }}>
                Find and share content with other players
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="text-xs font-semibold uppercase tracking-wide"
                style={{
                  background: 'linear-gradient(to right, #1a9fff, #00adee)',
                  color: '#fff',
                  border: 'none',
                }}
              >
                <ImageIcon size={13} className="mr-1.5" />
                Upload Screenshot
              </Button>
            </div>
          </div>
        </div>
        <StatBar />
      </div>

      {/* Main Content */}
      <div className="max-w-[940px] mx-auto px-4 py-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Bar */}
          <TabsList
            className="flex w-full h-auto p-0 gap-0 mb-5 overflow-x-auto rounded-none"
            style={{
              background: '#16202d',
              border: '1px solid #2a3f5a',
              borderRadius: 2,
            }}
          >
            {TAB_ITEMS.map(({ value, label, icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-none whitespace-nowrap data-[state=active]:shadow-none"
                style={{
                  color: activeTab === value ? '#c7d5e0' : '#8f98a0',
                  background: activeTab === value ? '#1b2838' : 'transparent',
                  borderBottom: activeTab === value ? '2px solid #1a9fff' : '2px solid transparent',
                  borderRadius: 0,
                }}
              >
                {icon}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="mt-0 outline-none">
            {isLoading || !games ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1 min-w-0">
                    <ScreenshotsGridSkeleton />
                  </div>
                  <div className="w-full md:w-[272px] shrink-0">
                    <DiscussionsSkeleton />
                  </div>
                </div>
              </div>
            ) : (
              <HomeTabContent games={games} isSignedIn={isSignedIn} />
            )}
          </TabsContent>

          {/* Other Tabs */}
          {['discussions', 'screenshots', 'artwork', 'videos', 'workshop', 'guides'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 outline-none">
              <PlaceholderTabContent
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
