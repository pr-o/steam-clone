'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAtomValue, useSetAtom } from 'jotai'
import { ThumbsUp, ThumbsDown, Monitor, Apple, X as Linux, ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react'
import { useGame } from '@/hooks/useGames'
import { useGameReviews } from '@/hooks/useReviews'
import { addToCartAtom } from '@/stores/cartStore'
import { toggleWishlistAtom, isWishlistedAtom } from '@/stores/wishlistStore'
import { isSignedInAtom } from '@/stores/userStore'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Game, Review } from '@steam-clone/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

const RATING_COLOR: Record<string, string> = {
  'Overwhelmingly Positive': '#66c0f4',
  'Very Positive': '#66c0f4',
  'Mostly Positive': '#66c0f4',
  Mixed: '#b9a074',
  'Mostly Negative': '#c34741',
  'Very Negative': '#c34741',
  'Overwhelmingly Negative': '#c34741',
}

function ratingColor(summary: string) {
  return RATING_COLOR[summary] ?? '#66c0f4'
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function PlatformIcons({ platforms }: { platforms: Game['platforms'] }) {
  return (
    <div className="flex items-center gap-1.5">
      {platforms.windows && <Monitor size={13} className="text-steam-textMuted" />}
      {platforms.mac && <Apple size={13} className="text-steam-textMuted" />}
      {platforms.linux && <Linux size={13} className="text-steam-textMuted" />}
    </div>
  )
}

function PriceBlock({ game }: { game: Game }) {
  const addToCart = useSetAtom(addToCartAtom)
  if (game.price.isFree) {
    return (
      <div className="mt-4">
        <div className="text-steam-accentPale font-bold text-[15px] mb-2">Free to Play</div>
        <Link
          href={`/app/${game.id}/${game.slug}`}
          className="block w-full text-center text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] py-2 rounded-sm transition-colors"
        >
          Play Game
        </Link>
      </div>
    )
  }
  if (game.price.discountPercent > 0) {
    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-steam-discountBg text-steam-discountText text-[14px] font-bold px-2 py-1 rounded-sm">
            -{game.price.discountPercent}%
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-steam-textDim text-[11px] line-through">{formatPrice(game.price.initial)}</span>
            <span className="text-steam-salePrice font-bold text-[16px]">{formatPrice(game.price.final)}</span>
          </div>
        </div>
        <button
          onClick={() => addToCart(game)}
          className="w-full text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] py-2 rounded-sm transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    )
  }
  return (
    <div className="mt-4">
      <div className="text-steam-text font-bold text-[16px] mb-2">{formatPrice(game.price.final)}</div>
      <button
        onClick={() => addToCart(game)}
        className="w-full text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] py-2 rounded-sm transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart size={14} />
        Add to Cart
      </button>
    </div>
  )
}

// ─── Media Carousel ──────────────────────────────────────────────────────────

function MediaCarousel({ game }: { game: Game }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const media = game.screenshots

  function prev() { setActiveIdx(i => (i - 1 + media.length) % media.length) }
  function next() { setActiveIdx(i => (i + 1) % media.length) }

  return (
    <div>
      {/* Main viewer */}
      <div className="relative bg-black aspect-video w-full overflow-hidden group">
        <img
          key={activeIdx}
          src={media[activeIdx]}
          alt={`Screenshot ${activeIdx + 1}`}
          className="w-full h-full object-cover"
        />
        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-1 mt-1 overflow-x-auto scrollbar-none bg-[#0e1825] p-1">
        {media.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={cn(
              'shrink-0 w-[116px] h-[65px] overflow-hidden rounded-sm border-2 transition-colors',
              activeIdx === i ? 'border-steam-blue' : 'border-transparent opacity-60 hover:opacity-100'
            )}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────

function GameSidebar({ game }: { game: Game }) {
  const isWishlisted = useAtomValue(useMemo(() => isWishlistedAtom(game.id), [game.id]))
  const toggleWishlist = useSetAtom(toggleWishlistAtom)
  const rc = ratingColor(game.rating.summary)
  const genre = game.genres[0]?.description ?? 'Game'

  return (
    <div className="flex flex-col gap-3">
      {/* Header art */}
      <img
        src={game.headerImage}
        alt={game.title}
        className="w-full rounded-sm object-cover"
        style={{ aspectRatio: '460/215' }}
      />

      {/* Short description */}
      <p className="text-steam-textMuted text-[13px] leading-relaxed border-b border-steam-borderSubtle pb-3">
        {game.shortDescription}
      </p>

      {/* Review rows */}
      <div className="flex flex-col gap-1.5 text-[12px]">
        <div className="flex justify-between">
          <span className="text-steam-textDim uppercase tracking-wide text-[10px]">Recent Reviews:</span>
          <span style={{ color: rc }} className="font-medium">
            {game.rating.summary} ({game.rating.totalReviews.toLocaleString()})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-steam-textDim uppercase tracking-wide text-[10px]">All Reviews:</span>
          <span style={{ color: rc }} className="font-medium">
            {game.rating.summary} ({(game.rating.totalReviews * 8).toLocaleString()})
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 text-[12px] border-t border-steam-borderSubtle pt-3">
        <div className="flex gap-3">
          <span className="text-steam-textDim uppercase tracking-wide text-[10px] w-24 shrink-0">Release Date:</span>
          <span className="text-steam-text">{game.releaseDate}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-steam-textDim uppercase tracking-wide text-[10px] w-24 shrink-0">Developer:</span>
          <Link href={`/search?q=${encodeURIComponent(game.developer)}`} className="text-steam-link hover:text-steam-linkHover transition-colors">
            {game.developer}
          </Link>
        </div>
        <div className="flex gap-3">
          <span className="text-steam-textDim uppercase tracking-wide text-[10px] w-24 shrink-0">Publisher:</span>
          <Link href={`/search?q=${encodeURIComponent(game.publisher)}`} className="text-steam-link hover:text-steam-linkHover transition-colors">
            {game.publisher}
          </Link>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 border-t border-steam-borderSubtle pt-3">
        {game.tags.slice(0, 6).map(tag => (
          <Link
            key={tag.id}
            href={`/search?q=${encodeURIComponent(tag.name)}`}
            className="px-2 py-0.5 text-[11px] text-steam-textMuted bg-[#4a5c6a]/40 hover:bg-[#4a5c6a]/70 border border-[#4a5c6a] rounded-sm transition-colors"
          >
            {tag.name}
          </Link>
        ))}
      </div>

      {/* Price + buy */}
      <PriceBlock game={game} />

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(game.id)}
        className={cn(
          'w-full text-[12px] py-1.5 rounded-sm border transition-colors flex items-center justify-center gap-1.5',
          isWishlisted
            ? 'border-steam-blue text-steam-blue hover:bg-steam-blue/10'
            : 'border-steam-borderSubtle text-steam-textMuted hover:text-steam-text hover:border-steam-text'
        )}
      >
        <Heart size={13} className={isWishlisted ? 'fill-steam-blue' : ''} />
        {isWishlisted ? 'On Wishlist' : 'Add to Wishlist'}
      </button>

      {/* Platform icons */}
      <div className="flex items-center gap-2 pt-1">
        <PlatformIcons platforms={game.platforms} />
      </div>
    </div>
  )
}

// ─── News Updates ─────────────────────────────────────────────────────────────

const MOCK_UPDATES = [
  { title: 'Latest Patch Notes', date: 'Mar 19, 2026', image: '' },
  { title: 'Season Update', date: 'Mar 12, 2026', image: '' },
]

function UpdatesSection({ game }: { game: Game }) {
  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-3">
        {MOCK_UPDATES.map((u, i) => (
          <div key={i} className="flex-1 bg-steam-card rounded-sm overflow-hidden group cursor-pointer hover:bg-steam-cardHover transition-colors">
            <div className="h-[110px] bg-steam-panel overflow-hidden">
              <img
                src={`https://placehold.co/460x215/1b2838/66c0f4?text=${encodeURIComponent(u.title)}`}
                alt={u.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2">
              <p className="text-steam-text text-[13px] font-medium leading-tight">{u.title}</p>
              <p className="text-steam-textMuted text-[11px] mt-0.5">{u.date}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="text-steam-link hover:text-steam-linkHover text-[12px] transition-colors flex items-center gap-1">
        ↻ See all updates (Latest: Mar 19)
      </button>
    </div>
  )
}

// ─── Info Sidebar ────────────────────────────────────────────────────────────

function InfoSidebar({ game }: { game: Game }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Content block */}
      <div className="bg-steam-card rounded-sm p-3">
        <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-2">Content</p>
        <ul className="text-steam-textMuted text-[12px] space-y-0.5">
          <li>Includes Interactive Elements</li>
          <li>In-game purchases, In-game chat</li>
          <li>Online Interactivity</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-steam-borderSubtle">
          <p className="text-steam-textMuted text-[12px]">Includes 1 Steam Achievement</p>
        </div>
      </div>

      {/* Info table */}
      <div className="bg-steam-card rounded-sm p-3">
        <div className="flex flex-col gap-1 text-[12px]">
          {[
            ['Title:', game.title],
            ['Genre:', game.genres.map(g => g.description).join(', ') || 'Action'],
            ['Developer:', game.developer],
            ['Publisher:', game.publisher],
            ['Release Date:', game.releaseDate],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="text-steam-textDim shrink-0 w-20">{label}</span>
              <span className="text-steam-text">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-col gap-0.5">
        {['Visit the website', 'View update history', 'Read related news', 'View discussions', 'Visit the Workshop', 'Find Community Groups'].map(link => (
          <button
            key={link}
            className="text-left text-[12px] text-steam-link hover:text-steam-linkHover px-2 py-1.5 rounded-sm hover:bg-steam-card transition-colors"
          >
            {link}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection({ game }: { game: Game }) {
  return (
    <div>
      <h2 className="text-steam-text text-[16px] font-semibold mb-3 pb-2 border-b border-steam-borderSubtle">
        About This Game
      </h2>
      <div className="text-steam-textMuted text-[13px] leading-relaxed space-y-3">
        <p>{game.shortDescription}</p>
        <p>{game.description}</p>
        <ul className="list-disc pl-5 space-y-1 text-[12px]">
          <li>Full featured gameplay with regular content updates</li>
          <li>Global and regional leaderboards</li>
          <li>Upgraded and overhauled maps</li>
          <li>Game-changing dynamic mechanics</li>
          <li>Redesigned visual effects and audio</li>
        </ul>
      </div>
    </div>
  )
}

// ─── System Requirements ──────────────────────────────────────────────────────

function SystemRequirements() {
  const cols = [
    {
      label: 'Minimum',
      rows: [
        ['OS:', 'Windows 10 64-bit'],
        ['Processor:', 'Intel Core i5-4670K / AMD Ryzen 5 1600'],
        ['Memory:', '8 GB RAM'],
        ['Graphics:', 'NVIDIA GeForce GTX 970 / AMD RX 480'],
        ['DirectX:', 'Version 12'],
        ['Storage:', '15 GB available space'],
      ],
    },
    {
      label: 'Recommended',
      rows: [
        ['OS:', 'Windows 11 64-bit'],
        ['Processor:', 'Intel Core i7-9700K / AMD Ryzen 7 3700X'],
        ['Memory:', '16 GB RAM'],
        ['Graphics:', 'NVIDIA GeForce RTX 2070 / AMD RX 5700 XT'],
        ['DirectX:', 'Version 12'],
        ['Storage:', '15 GB available space'],
      ],
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-steam-text text-[16px] font-semibold mb-3 pb-2 border-b border-steam-borderSubtle">
        System Requirements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cols.map(col => (
          <div key={col.label}>
            <p className="text-steam-text text-[13px] font-semibold mb-2">{col.label}:</p>
            <dl className="space-y-1">
              {col.rows.map(([term, def]) => (
                <div key={term} className="flex gap-2 text-[12px]">
                  <dt className="text-steam-textDim w-24 shrink-0">{term}</dt>
                  <dd className="text-steam-textMuted">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const hours = Math.round(review.playtimeAtReview / 60)
  return (
    <div className="bg-steam-card rounded-sm p-4 space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={review.author.avatar || `https://placehold.co/40x40/2a475e/66c0f4?text=${review.author.displayName[0]}`}
          alt={review.author.displayName}
          className="w-9 h-9 rounded-sm shrink-0"
        />
        <div className="min-w-0">
          <p className="text-steam-text text-[13px] font-medium">{review.author.displayName}</p>
          <p className="text-steam-textMuted text-[11px]">{hours} hrs on record</p>
        </div>
        <div className={cn('ml-auto shrink-0 flex items-center gap-1.5 text-[12px] font-semibold', review.recommended ? 'text-steam-accentPale' : 'text-[#c34741]')}>
          {review.recommended
            ? <><ThumbsUp size={13} /> Recommended</>
            : <><ThumbsDown size={13} /> Not Recommended</>
          }
        </div>
      </div>
      <p className="text-steam-textMuted text-[12px] leading-relaxed line-clamp-5">{review.content}</p>
      <div className="flex items-center gap-3 pt-1 border-t border-steam-borderSubtle text-[11px] text-steam-textDim">
        <span>Was this review helpful?</span>
        <button className="flex items-center gap-1 hover:text-steam-text transition-colors">
          <ThumbsUp size={11} /> Yes ({review.helpful})
        </button>
        <button className="flex items-center gap-1 hover:text-steam-text transition-colors">
          Funny ({review.funny})
        </button>
      </div>
    </div>
  )
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection({ game }: { game: Game }) {
  const { data: reviews, isLoading } = useGameReviews(game.id)
  const rc = ratingColor(game.rating.summary)

  return (
    <div className="mt-8">
      <h2 className="text-steam-text text-[16px] font-semibold mb-4 pb-2 border-b border-steam-borderSubtle">
        Customer Reviews
      </h2>

      {/* Summary banner */}
      <div className="bg-steam-card rounded-sm p-4 mb-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Overall Reviews</p>
          <p className="text-[18px] font-bold" style={{ color: rc }}>{game.rating.summary}</p>
          <p className="text-steam-textMuted text-[11px] mt-0.5">{game.rating.totalReviews.toLocaleString()} reviews</p>
        </div>
        <div className="w-px h-12 bg-steam-borderSubtle" />
        <div className="text-[12px] text-steam-textMuted">
          <p>{game.rating.score}% of the {game.rating.totalReviews.toLocaleString()} user reviews for this game are positive.</p>
        </div>
      </div>

      {/* Review grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] bg-steam-card rounded-sm" />
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <div className="text-steam-textMuted text-[13px] text-center py-8">
          No reviews yet for this game.
        </div>
      )}
    </div>
  )
}

// ─── Sign-in Bottom Bar ───────────────────────────────────────────────────────

function SignInBar() {
  const isSignedIn = useAtomValue(isSignedInAtom)
  if (isSignedIn) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#1b4d6e] border-t border-[#4a7a9b] py-2 px-4 flex items-center justify-between text-[12px]">
      <p className="text-steam-text">
        <Link href="/login" className="text-steam-link hover:text-steam-linkHover transition-colors">Sign in</Link>
        {' '}to add this item to your wishlist, follow it, or mark it as ignored.
      </p>
      <button className="text-steam-textMuted hover:text-steam-text transition-colors ml-4">✕</button>
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function GameDetailSkeleton() {
  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-4">
      <Skeleton className="h-4 w-64 bg-steam-card mb-4" />
      <Skeleton className="h-7 w-80 bg-steam-card mb-6" />
      <div className="flex gap-4">
        <div className="flex-1">
          <Skeleton className="w-full aspect-video bg-steam-card rounded-sm mb-1" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[116px] h-[65px] bg-steam-card rounded-sm" />)}
          </div>
        </div>
        <div className="w-[298px] shrink-0 space-y-3">
          <Skeleton className="w-full h-[140px] bg-steam-card rounded-sm" />
          <Skeleton className="h-20 bg-steam-card rounded-sm" />
          <Skeleton className="h-16 bg-steam-card rounded-sm" />
        </div>
      </div>
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function GameDetailPage({ gameId }: { gameId: number }) {
  const { data: game, isLoading, isError } = useGame(gameId)

  if (isLoading) return <GameDetailSkeleton />

  if (isError || !game) {
    return (
      <div className="max-w-[940px] mx-auto px-4 py-16 text-center">
        <p className="text-steam-textMuted text-[15px]">Game not found.</p>
        <Link href="/" className="text-steam-link hover:text-steam-linkHover text-[13px] mt-2 inline-block">← Back to Store</Link>
      </div>
    )
  }

  const genre = game.genres[0]?.description ?? 'Games'

  return (
    <>
      {/* "Not signed in" desktop app banner */}
      <div className="bg-[#1b4d6e] border-b border-[#4a7a9b]">
        <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-1.5 flex items-center gap-3">
          <button className="text-[11px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-3 py-1 rounded-sm transition-colors shrink-0">
            Open in Desktop App
          </button>
          <p className="text-steam-text text-[12px]">
            <span className="font-semibold text-white">You&apos;re not signed in!</span>
            {' '}Open this page in the Steam App to wishlist, follow, purchase and see recommendations.
          </p>
        </div>
      </div>

      <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-4 pb-16">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-steam-link mb-3 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-steam-linkHover transition-colors">All Games</Link>
          <span className="text-steam-textDim">›</span>
          <Link href={`/genre/${genre.toLowerCase()}`} className="hover:text-steam-linkHover transition-colors">{genre} Games</Link>
          <span className="text-steam-textDim">›</span>
          <span className="text-steam-textMuted">{game.title}</span>
        </nav>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-steam-text text-[22px] font-semibold leading-tight">{game.title}</h1>
          <Link
            href="#"
            className="shrink-0 text-[12px] text-steam-link hover:text-steam-linkHover border border-steam-borderSubtle hover:border-steam-link px-3 py-1.5 rounded-sm transition-colors"
          >
            Community Hub
          </Link>
        </div>

        {/* Two-column content */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Left: media */}
          <div className="flex-1 min-w-0">
            <MediaCarousel game={game} />
          </div>

          {/* Right: sidebar */}
          <div className="w-full md:w-[298px] shrink-0">
            <GameSidebar game={game} />
          </div>
        </div>

        {/* Below-fold: two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <UpdatesSection game={game} />
            <AboutSection game={game} />
            <SystemRequirements />
            <ReviewsSection game={game} />
          </div>

          {/* Right info sidebar */}
          <div className="w-full md:w-[220px] shrink-0">
            <InfoSidebar game={game} />
          </div>
        </div>
      </div>

      <SignInBar />
    </>
  )
}
