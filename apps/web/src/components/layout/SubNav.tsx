'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import {
  Search,
  ChevronDown,
  Gamepad2,
  Monitor,
  Headphones,
  Users,
  Download,
  Puzzle,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import { searchQueryAtom } from '@/stores/uiStore'
import { isSignedInAtom } from '@/stores/userStore'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAllGames } from '@/hooks/useGames'

// ─── Shared link style ────────────────────────────────────────────────────────
const linkCls =
  'text-[13px] text-[#c7d5e0] hover:text-[#66c0f4] transition-colors leading-6 block'

// ─── Section header style ─────────────────────────────────────────────────────
const sectionHeaderCls =
  'text-[10px] font-semibold uppercase tracking-widest text-[#8f98a0] mb-2'

// ─── Large CTA card (Ways to Play / Special Sections / Browse) ────────────────
function CtaCard({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-4 rounded',
        'bg-gradient-to-br from-[#1b4a6b] to-[#0d2d45]',
        'border border-[#2a5a7a]/60',
        'text-white font-bold text-[13px] uppercase tracking-wide',
        'hover:from-[#255a7e] hover:to-[#152f4a] hover:border-[#3a7aaa]/60',
        'transition-all duration-150 group'
      )}
    >
      <span className="text-[#66c0f4] group-hover:text-[#a0d8f8] transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  )
}

// ─── Browse Dropdown ──────────────────────────────────────────────────────────
function BrowseDropdown() {
  return (
    <div className="flex gap-6 w-full">
      {/* Left column */}
      <div className="w-[170px] shrink-0">
        <Link href="/" className={linkCls}>
          Store Home
        </Link>
        <Link href="/explore/new" className={linkCls}>
          New Releases
          <span className="block text-[11px] text-[#8f98a0] leading-tight -mt-1">
            Explore new content on Steam
          </span>
        </Link>
        <Link href="/explore/upcoming" className={cn(linkCls, 'mt-1')}>
          Upcoming Releases
          <span className="block text-[11px] text-[#8f98a0] leading-tight -mt-1">
            See what&apos;s on the release calendar
          </span>
        </Link>
        <Link
          href="/search?sort_by=Reviews_DESC"
          className={cn(linkCls, 'mt-1')}
        >
          All Charts &amp; Stats
          <span className="block text-[11px] text-[#8f98a0] leading-tight -mt-1">
            Explore top titles by week, month, or year
          </span>
        </Link>
      </div>

      {/* Center: large CTA cards */}
      <div className="flex flex-col gap-2 flex-1 min-w-0 max-w-[240px]">
        <Link
          href="/search?filter=topsellers"
          className={cn(
            'flex items-center justify-center rounded font-bold text-white text-[15px] uppercase tracking-wider',
            'bg-gradient-to-br from-[#1b4a6b] to-[#0d2d45]',
            'border border-[#2a5a7a]/60',
            'hover:from-[#255a7e] hover:to-[#152f4a]',
            'transition-all duration-150 h-[56px]'
          )}
        >
          TOP SELLERS
        </Link>
        <Link
          href="/specials"
          className={cn(
            'flex items-center justify-center rounded font-bold text-white text-[15px] uppercase tracking-wider',
            'bg-gradient-to-br from-[#1b4a6b] to-[#0d2d45]',
            'border border-[#2a5a7a]/60',
            'hover:from-[#255a7e] hover:to-[#152f4a]',
            'transition-all duration-150 h-[56px]'
          )}
        >
          DISCOUNTS &amp; EVENTS
        </Link>
      </div>

      {/* Right: top destinations + my account */}
      <div className="flex gap-8 ml-auto">
        <div>
          <p className={sectionHeaderCls}>Top Destinations</p>
          <Link href="/genre/Free+to+Play" className={linkCls}>
            Free to Play
          </Link>
          <Link href="/specials/demos" className={linkCls}>
            Demos
          </Link>
          <Link href="/community" className={linkCls}>
            News &amp; Updates
          </Link>
          <Link href="/points/shop" className={linkCls}>
            Points Shop
          </Link>
          <Link href="#" className={linkCls}>
            Gift Cards
          </Link>
        </div>
        <div>
          <p className={sectionHeaderCls}>My Account</p>
          <Link href="#" className={linkCls}>
            My Preferences
          </Link>
          <Link href="/cart" className={linkCls}>
            My Wishlist
          </Link>
          <Link href="#" className={linkCls}>
            My Family
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Recommendations Dropdown ─────────────────────────────────────────────────

interface MockTopSeller {
  id: number
  title: string
  isFree: boolean
  finalPrice: number
  imageUrl: string
}

const MOCK_TOP_SELLERS: MockTopSeller[] = [
  {
    id: 1,
    title: 'PUBG: BATTLEGROUNDS',
    isFree: true,
    finalPrice: 0,
    imageUrl: 'https://placehold.co/60x34/1b2838/66c0f4?text=PUBG',
  },
  {
    id: 2,
    title: 'Crimson Desert',
    isFree: false,
    finalPrice: 79000,
    imageUrl: 'https://placehold.co/60x34/1b2838/66c0f4?text=Crimson',
  },
  {
    id: 3,
    title: 'Slay the Spire 2',
    isFree: false,
    finalPrice: 27000,
    imageUrl: 'https://placehold.co/60x34/1b2838/66c0f4?text=StS2',
  },
]

function RecommendationsDropdown() {
  const { data: games } = useAllGames()

  // Convert real Game data to a displayable shape, or fall back to mock
  const topSellers: MockTopSeller[] =
    games && games.length >= 3
      ? games.slice(0, 3).map((g) => ({
          id: g.id,
          title: g.title,
          isFree: g.price.isFree,
          finalPrice: g.price.final,
          imageUrl: g.headerImage,
        }))
      : MOCK_TOP_SELLERS

  return (
    <div className="flex gap-6 w-full">
      {/* Left: top sellers */}
      <div className="w-[220px] shrink-0">
        <p className={sectionHeaderCls}>Top Sellers</p>
        <div className="flex flex-col gap-1">
          {topSellers.map((g) => (
            <Link
              key={g.id}
              href={`/game/${g.id}`}
              className="flex items-center gap-2 py-1 rounded hover:bg-[#2a475e]/40 transition-colors group"
            >
              <img
                src={g.imageUrl}
                alt={g.title}
                className="w-[60px] h-[34px] object-cover rounded shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[12px] text-[#c7d5e0] group-hover:text-[#66c0f4] transition-colors leading-tight truncate">
                  {g.title}
                </p>
                <p className="text-[11px] text-[#8f98a0]">
                  {g.isFree ? 'Free' : `₩ ${g.finalPrice.toLocaleString()}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Center: personal calendar card */}
      <div className="flex-1 min-w-0 max-w-[260px]">
        <div
          className={cn(
            'rounded p-4 h-full min-h-[120px]',
            'bg-gradient-to-br from-[#1b2838] to-[#16202d]',
            'border border-[#2a3a4a]'
          )}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-[#2a475e] rounded flex items-center justify-center shrink-0">
              <span className="text-[#66c0f4] text-[14px]">📅</span>
            </div>
            <div>
              <p className="text-white font-bold text-[13px] leading-tight">
                Your Personal Calendar
              </p>
              <span className="inline-block text-[10px] bg-[#4c6b22] text-[#a4d007] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mt-0.5">
                NEW
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#8f98a0] leading-relaxed mb-3">
            Explore a personalized list of games that have released recently
            or are coming soon
          </p>
          <Link
            href="/explore/new"
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1.5 rounded text-[12px] font-semibold',
              'bg-[#1a9fff] hover:bg-[#00adee] text-white transition-colors'
            )}
          >
            Explore My Calendar →
          </Link>
        </div>
      </div>

      {/* Right: links */}
      <div className="ml-auto">
        <Link href="/explore/new" className={linkCls}>
          Your Discovery Queue
        </Link>
        <Link href="/community" className={linkCls}>
          Community Recommendations
        </Link>
        <Link href="/explore/new" className={linkCls}>
          New Releases Queue
        </Link>
        <Link href="/search" className={linkCls}>
          Interactive Recommender
        </Link>
        <Link href="/" className={linkCls}>
          Popular Among Friends
        </Link>
        <Link href="/community" className={linkCls}>
          Steam Curators
        </Link>
        <Link href="/specials/dlc" className={linkCls}>
          DLC For You
        </Link>
      </div>
    </div>
  )
}

// ─── Categories Dropdown ──────────────────────────────────────────────────────
const CATEGORY_TILES = [
  { label: 'Simulation', href: '/genre/Simulation' },
  { label: 'All Sports', href: '/genre/Sports' },
  { label: 'City & Settlement', href: '/genre/Strategy' },
  { label: 'Anime', href: '/genre/Anime' },
  { label: 'Story-Rich', href: '/genre/RPG' },
  { label: 'Visual Novel', href: '/genre/Indie' },
]

const TAG_PILLS = [
  'Survival',
  'Racing',
  'Free To Play',
  'Early Access',
  'Action',
  'Open World',
  'Co-Operative',
  'Horror',
  'Rogue-Like',
  'Role-Playing',
  'Adventure',
  'Sci-Fi & Cyberpunk',
]

const ALL_GENRES = [
  ['First-Person Shooter', 'Third-Person Shooter', 'Hack & Slash'],
  [
    'Hidden Object',
    'Casual',
    'Strategy & Tactical Role-Playing',
    'Metroidvania',
    'Dating Sims',
  ],
  [
    'Action Role-Playing',
    'Building & Automation Sims',
    'Hobby & Job Sims',
    'Japanese Role-Playing',
    'Tower Defense',
  ],
  [
    'Turn-Based Strategy',
    'Sports Sims',
    'Real-Time Strategy',
    'Racing Sim',
    'Space',
  ],
  ['Horror', 'Sci-Fi & Cyberpunk'],
]

function CategoriesDropdown() {
  return (
    <div className="w-full">
      {/* Top label */}
      <p className={cn(sectionHeaderCls, 'mb-3')}>Your Top Categories</p>

      {/* Image tile row */}
      <div className="flex gap-2 mb-3">
        {CATEGORY_TILES.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="relative rounded overflow-hidden shrink-0 group"
            style={{ width: 'calc(16.666% - 7px)' }}
          >
            <img
              src={`https://placehold.co/120x68/1b2838/66c0f4?text=${encodeURIComponent(label.slice(0, 8))}`}
              alt={label}
              className="w-full h-[68px] object-cover block"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <span className="absolute bottom-0 left-0 right-0 px-1 py-1 text-white font-bold text-[10px] uppercase tracking-wide leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {TAG_PILLS.map((tag) => (
          <Link
            key={tag}
            href={`/genre/${encodeURIComponent(tag)}`}
            className={cn(
              'px-2 py-0.5 rounded text-[11px] text-[#c7d5e0]',
              'bg-[#2a3a4a] hover:bg-[#3a5068] hover:text-[#66c0f4]',
              'transition-colors'
            )}
          >
            {tag}
          </Link>
        ))}
        <Link
          href="/genre"
          className="px-2 py-0.5 rounded text-[11px] text-[#66c0f4] bg-[#2a3a4a] hover:bg-[#3a5068] transition-colors"
        >
          View all tags →
        </Link>
      </div>

      {/* All genres section */}
      <div className="flex items-start justify-between mb-1">
        <p className={sectionHeaderCls}>All Genres &amp; Themes</p>
        <Link
          href="/genre"
          className="text-[11px] text-[#66c0f4] hover:text-[#a0d8f8] transition-colors"
        >
          Expand ↗
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-x-6 gap-y-0">
        {ALL_GENRES.map((col, ci) => (
          <div key={ci} className="flex flex-col">
            {col.map((g) => (
              <Link
                key={g}
                href={`/genre/${encodeURIComponent(g)}`}
                className="text-[12px] text-[#c7d5e0] hover:text-[#66c0f4] transition-colors leading-6"
              >
                {g}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Ways to Play Dropdown ────────────────────────────────────────────────────
const WAYS_MAIN = [
  {
    icon: <Gamepad2 size={24} />,
    label: 'GREAT ON DECK',
    href: '/ways-to-play/steam-deck',
  },
  {
    icon: <Monitor size={24} />,
    label: 'REMOTE PLAY',
    href: '/ways-to-play/remote-play',
  },
  {
    icon: <Headphones size={24} />,
    label: 'VR TITLES',
    href: '/ways-to-play/vr',
  },
  {
    icon: <Gamepad2 size={24} />,
    label: 'CONTROLLER-FRIENDLY',
    href: '/ways-to-play/controller',
  },
  {
    icon: <Users size={24} />,
    label: 'CO-OPERATIVE',
    href: '/ways-to-play/co-op',
  },
]

function WaysToPlayDropdown() {
  return (
    <div className="flex gap-6 w-full">
      {/* Left: icon button grid */}
      <div className="flex-1 min-w-0">
        <p className={cn(sectionHeaderCls, 'mb-2')}>Ways to Play Games</p>
        <div className="grid grid-cols-3 gap-2">
          {WAYS_MAIN.slice(0, 3).map((item) => (
            <CtaCard key={item.label} {...item} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {WAYS_MAIN.slice(3).map((item) => (
            <CtaCard key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* Right: links */}
      <div className="w-[180px] shrink-0">
        <Link href="/ways-to-play/co-op" className={linkCls}>
          Local Area Network
        </Link>
        <Link href="/ways-to-play/co-op" className={linkCls}>
          Local Multiplayer &amp; Party
        </Link>
        <Link href="/search?filter=mmo" className={linkCls}>
          Massively Multiplayer
        </Link>
        <Link href="/search?filter=multiplayer" className={linkCls}>
          Multiplayer
        </Link>
        <Link href="/search?filter=competitive" className={linkCls}>
          Online Competitive
        </Link>
        <Link href="/search?filter=singleplayer" className={linkCls}>
          Singleplayer
        </Link>
      </div>
    </div>
  )
}

// ─── Special Sections Dropdown ────────────────────────────────────────────────
function SpecialSectionsDropdown() {
  return (
    <div className="flex gap-6 w-full">
      {/* Left: icon cards */}
      <div className="flex-1 min-w-0">
        <p className={cn(sectionHeaderCls, 'mb-2')}>Special Sections</p>
        <div className="grid grid-cols-2 gap-2">
          <CtaCard
            icon={<Download size={24} />}
            label="DEMOS"
            href="/specials/demos"
          />
          <CtaCard
            icon={<Puzzle size={24} />}
            label="DLC"
            href="/specials/dlc"
          />
        </div>
        <div className="mt-2">
          <CtaCard
            icon={<Tag size={24} />}
            label="SALE EVENTS"
            href="/specials"
          />
        </div>
      </div>

      {/* Right: two link columns */}
      <div className="flex gap-10">
        <div>
          <Link href="/specials/software" className={linkCls}>
            Software
          </Link>
          <Link href="/specials/soundtracks" className={linkCls}>
            Soundtracks
          </Link>
          <Link href="/specials/early-access" className={linkCls}>
            Early Access
          </Link>
          <Link href="#" className={linkCls}>
            For PC Cafes
          </Link>
          <Link href="/search?os=mac" className={linkCls}>
            macOS
          </Link>
          <Link href="/search?os=linux" className={linkCls}>
            SteamOS + Linux
          </Link>
        </div>
        <div>
          <Link href="#" className={linkCls}>
            Steam Next Fest
          </Link>
          <Link href="#" className={linkCls}>
            The Steam Awards
          </Link>
          <Link href="#" className={linkCls}>
            Steam Replay
          </Link>
          <Link href="#" className={linkCls}>
            Steam Labs
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Dropdown panel wrapper ───────────────────────────────────────────────────
type DropdownKey =
  | 'Browse'
  | 'Recommendations'
  | 'Categories'
  | 'Ways to Play'
  | 'Special Sections'

function DropdownPanel({ which }: { which: DropdownKey }) {
  return (
    <div
      className="fixed left-0 right-0 z-50"
      style={{ top: '72px' }} // top-9 (36px nav) + h-9 (36px sub-nav) = 72px
    >
      <div
        className="w-full border-t border-[#0a0d11] border-b border-[#2a3a4a] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        style={{ background: '#0e1319' }}
      >
        <div className="max-w-[960px] mx-auto px-6 py-4">
          {which === 'Browse' && <BrowseDropdown />}
          {which === 'Recommendations' && <RecommendationsDropdown />}
          {which === 'Categories' && <CategoriesDropdown />}
          {which === 'Ways to Play' && <WaysToPlayDropdown />}
          {which === 'Special Sections' && <SpecialSectionsDropdown />}
        </div>
      </div>
    </div>
  )
}

// ─── Navigation items config ──────────────────────────────────────────────────
const NAV_ITEMS: Array<{ label: string; hasDropdown: boolean }> = [
  { label: 'Browse', hasDropdown: true },
  { label: 'Recommendations', hasDropdown: true },
  { label: 'Categories', hasDropdown: true },
  { label: 'Hardware', hasDropdown: false },
  { label: 'Ways to Play', hasDropdown: true },
  { label: 'Special Sections', hasDropdown: true },
]

// ─── SubNav ───────────────────────────────────────────────────────────────────
export function SubNav() {
  const router = useRouter()
  const [query, setQuery] = useAtom(searchQueryAtom)
  const [isSignedIn] = useAtom(isSignedInAtom)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null)

  const navRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function toggleDropdown(label: string) {
    if (!isDropdownKey(label)) return
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  return (
    <div
      ref={navRef}
      className="fixed top-9 left-0 right-0 z-40 h-9 bg-steam-bg border-b border-black/40 flex items-center"
    >
      {/* Horizontally scrollable on mobile */}
      <ScrollAreaPrimitive.Root className="flex-1 min-w-0 overflow-hidden">
        <ScrollAreaPrimitive.Viewport className="w-full h-9">
          <div className="flex items-center h-9">
            {NAV_ITEMS.map(({ label, hasDropdown }) => {
              const isOpen = openDropdown === label
              return (
                <Button
                  key={label}
                  variant="ghost"
                  onClick={() =>
                    hasDropdown ? toggleDropdown(label) : undefined
                  }
                  className={cn(
                    'h-9 px-3 flex items-center gap-1 text-[12px] transition-colors whitespace-nowrap shrink-0',
                    isOpen
                      ? 'text-white bg-[#1b2838]'
                      : 'text-steam-navDefault hover:text-white'
                  )}
                >
                  {label}
                  {hasDropdown && (
                    <ChevronDown
                      size={11}
                      className={cn(
                        'opacity-70 transition-transform duration-150',
                        isOpen && 'rotate-180'
                      )}
                    />
                  )}
                </Button>
              )
            })}

            {isSignedIn && (
              <Button
                variant="ghost"
                className="h-9 px-3 flex items-center gap-1 text-[12px] text-steam-navDefault hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Your Store
              </Button>
            )}
          </div>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="horizontal" className="h-1" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center shrink-0 pr-3">
        <div className="flex items-center bg-[#316282] rounded-sm overflow-hidden">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search the store"
            className={cn(
              'h-[26px] w-[180px] sm:w-[220px] px-2 text-[12px] bg-transparent',
              'text-steam-text placeholder:text-steam-textDim',
              'outline-none focus:ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
          />
          <Button
            type="submit"
            variant="ghost"
            className="h-[26px] w-[30px] flex items-center justify-center bg-steam-blue hover:bg-steam-cerulean transition-colors shrink-0 p-0 rounded-none"
          >
            <Search size={13} className="text-white" />
          </Button>
        </div>
      </form>

      {/* Flyout panel — rendered outside scrollable area */}
      {openDropdown && <DropdownPanel which={openDropdown} />}
    </div>
  )
}

function isDropdownKey(label: string): label is DropdownKey {
  return [
    'Browse',
    'Recommendations',
    'Categories',
    'Ways to Play',
    'Special Sections',
  ].includes(label)
}
