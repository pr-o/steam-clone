'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  Gamepad2,
  Eye,
  Cast,
  Gamepad,
  Users,
  ArrowLeft,
  ChevronRight,
  Wifi,
  Zap,
  Shield,
  Globe,
  Monitor,
  Headphones,
  Star,
  Trophy,
  Heart,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAllGames } from '@/hooks/useGames'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { PlatformIcons } from '@/components/shared/PlatformIcons'
import type { Game } from '@steam-clone/types'

// ─── Config ──────────────────────────────────────────────────────────────────

interface SlugConfig {
  title: string
  tagline: string
  icon: LucideIcon
  accent: string
  description: string
  features: Array<{ icon: LucideIcon; heading: string; description: string }>
}

const SLUG_CONFIG: Record<string, SlugConfig> = {
  'steam-deck': {
    title: 'Steam Deck',
    tagline: 'YOUR GAMES. EVERYWHERE.',
    icon: Gamepad2,
    accent: '#1a9fff',
    description:
      'Take your entire Steam library anywhere you go. Steam Deck is a powerful, portable PC gaming device that lets you play the games you love — at home or on the move.',
    features: [
      {
        icon: Globe,
        heading: 'Full Library Access',
        description:
          'Your entire Steam library travels with you. Thousands of games verified and playable on Steam Deck right out of the box.',
      },
      {
        icon: Zap,
        heading: 'PC-Power in Your Hands',
        description:
          'Custom AMD APU delivers desktop-class performance in a handheld form factor. Play AAA titles smoothly wherever you are.',
      },
      {
        icon: Shield,
        heading: 'SteamOS Built-In',
        description:
          'Optimized gaming OS based on Linux with a controller-friendly interface. Boot into Desktop Mode for full PC power.',
      },
    ],
  },
  vr: {
    title: 'VR Titles',
    tagline: 'STEP INTO ANOTHER WORLD.',
    icon: Eye,
    accent: '#7c3aed',
    description:
      'Experience games like never before. Steam VR brings you thousands of immersive virtual reality titles compatible with all major headsets — from action adventures to creative experiences.',
    features: [
      {
        icon: Headphones,
        heading: 'Total Immersion',
        description:
          'Step beyond the screen into fully realized virtual worlds. Spatial audio and 6DoF tracking put you inside the experience.',
      },
      {
        icon: Monitor,
        heading: 'Headset Agnostic',
        description:
          'Compatible with Valve Index, Meta Quest, HTC Vive, Windows Mixed Reality, and more. One library, every headset.',
      },
      {
        icon: Star,
        heading: 'Exclusive VR Experiences',
        description:
          'Discover groundbreaking titles built exclusively for VR — from award-winning narrative experiences to pulse-pounding action.',
      },
    ],
  },
  'remote-play': {
    title: 'Remote Play',
    tagline: 'PLAY FROM ANYWHERE.',
    icon: Cast,
    accent: '#0891b2',
    description:
      'Stream your Steam games from your PC to any device — phone, tablet, TV, or another computer. Keep playing your library no matter where you are, with your full controls and saves.',
    features: [
      {
        icon: Wifi,
        heading: 'Stream Over Any Network',
        description:
          'Play from across the room or across the world. Remote Play uses adaptive streaming to deliver smooth gameplay on any connection.',
      },
      {
        icon: Users,
        heading: 'Remote Play Together',
        description:
          'Invite friends to join your local co-op games online. Share your screen and controls even if they don\'t own the game.',
      },
      {
        icon: Zap,
        heading: 'Low-Latency Streaming',
        description:
          'Advanced codec support and predictive input smoothing keep your gameplay feeling responsive even on high-latency connections.',
      },
    ],
  },
  controller: {
    title: 'Controller-Friendly',
    tagline: 'PICK UP AND PLAY.',
    icon: Gamepad,
    accent: '#059669',
    description:
      'Sit back and play with your favorite controller. Steam supports hundreds of controllers natively — from Xbox to PlayStation to Nintendo — with full button remapping and haptic feedback.',
    features: [
      {
        icon: Gamepad,
        heading: 'Universal Controller Support',
        description:
          'Xbox, PlayStation, Nintendo Switch Pro, and hundreds more controllers work out-of-the-box. No drivers or configuration needed.',
      },
      {
        icon: Zap,
        heading: 'Steam Input',
        description:
          'Remap every button, set action layers, and share configurations with the community. Make any controller work perfectly with any game.',
      },
      {
        icon: Trophy,
        heading: 'Big Picture Mode',
        description:
          'A full-screen interface designed for couch gaming. Browse the store, manage your library, and chat — all from your sofa.',
      },
    ],
  },
  'co-op': {
    title: 'Co-Operative',
    tagline: 'BETTER TOGETHER.',
    icon: Users,
    accent: '#dc2626',
    description:
      'Game nights, forever. Steam has thousands of co-op games — local split-screen, online multiplayer, and everything in between. Team up with friends and tackle challenges together.',
    features: [
      {
        icon: Users,
        heading: 'Local & Online Co-Op',
        description:
          'Play side-by-side on the couch or team up online with friends from anywhere. Both modes supported across thousands of titles.',
      },
      {
        icon: Heart,
        heading: 'Remote Play Together',
        description:
          'Turn any local co-op game into an online experience. Invite friends to join even if they don\'t own the game.',
      },
      {
        icon: Globe,
        heading: 'Cross-Platform Play',
        description:
          'Many co-op games support cross-platform multiplayer. Play with friends regardless of whether they\'re on PC, console, or mobile.',
      },
    ],
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  for (let i = copy.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) | 0
    const j = Math.abs(h) % (i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// ─── Game Row ────────────────────────────────────────────────────────────────

function GameRow({ game, accent }: { game: Game; accent: string }) {
  return (
    <Link
      href={`/app/${game.id}/${game.slug}`}
      className="flex gap-3 p-3 rounded-sm bg-[#16202d] hover:bg-[#1e2d3d] transition-colors group"
    >
      <img
        src={game.headerImage}
        alt={game.title}
        width={184}
        height={69}
        className="w-[184px] h-[69px] object-cover rounded-sm shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-[#c7d5e0] text-[13px] font-medium group-hover:text-white transition-colors truncate">
          {game.title}
        </p>

        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {game.tags.slice(0, 3).map(tag => (
            <span
              key={tag.id}
              className="text-[10px] text-[#8f98a0] bg-[#1b2838] px-1.5 py-0.5 rounded-sm border border-[#2a3f50]"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2 text-[11px]">
          <RatingBadge summary={game.rating.summary} />
          <span className="text-[#4e5d6e]">·</span>
          <PlatformIcons platforms={game.platforms} size={11} />
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end justify-center gap-1">
        <PriceDisplay price={game.price} size="sm" />
      </div>

      <div
        className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: accent }}
      >
        <ChevronRight size={16} />
      </div>
    </Link>
  )
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex gap-3 p-3 rounded-sm bg-[#16202d]">
      <Skeleton className="w-[184px] h-[69px] rounded-sm shrink-0 bg-[#1b2838]" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-3.5 w-48 bg-[#1b2838]" />
        <Skeleton className="h-3 w-32 bg-[#1b2838]" />
        <Skeleton className="h-3 w-40 bg-[#1b2838]" />
      </div>
      <div className="shrink-0 flex flex-col items-end justify-center">
        <Skeleton className="h-5 w-16 bg-[#1b2838]" />
      </div>
    </div>
  )
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-[#8f98a0] text-[16px]">Page not found.</p>
      <Link
        href="/"
        className="text-[#66c0f4] text-[13px] hover:text-white transition-colors flex items-center gap-1"
      >
        <ArrowLeft size={14} />
        Back to Store
      </Link>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function WaysToPlayClient({ slug }: { slug: string }) {
  const config = SLUG_CONFIG[slug]
  const { data: allGames = [], isLoading } = useAllGames()

  const games = useMemo(() => {
    if (!allGames.length) return []
    return seededShuffle(allGames, slug).slice(0, 15)
  }, [allGames, slug])

  if (!config) return <NotFound />

  const {
    title,
    tagline,
    icon: Icon,
    accent,
    description,
    features,
  } = config

  const accentHex = accent.replace('#', '')
  const heroImageUrl = `https://placehold.co/1280x400/0a0f14/${accentHex}?text=${encodeURIComponent(title)}`

  return (
    <div className="min-h-screen bg-[#171a21]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        {/* Background image */}
        <img
          src={heroImageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f14]/95 via-[#0a0f14]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] via-transparent to-transparent" />

        {/* Accent color tint strip at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ backgroundColor: accent }}
        />

        {/* Content */}
        <div className="relative max-w-[940px] mx-auto px-4 sm:px-0 py-12 sm:py-16">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#8f98a0] text-[12px] hover:text-[#c7d5e0] transition-colors mb-8 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Ways to Play
          </Link>

          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-sm"
              style={{ backgroundColor: `${accent}22`, border: `1px solid ${accent}44` }}
            >
              <Icon size={22} style={{ color: accent }} />
            </div>
            <h1 className="text-white text-[32px] sm:text-[40px] font-bold tracking-tight leading-none">
              {title}
            </h1>
          </div>

          {/* Tagline */}
          <p
            className="text-[20px] sm:text-[26px] font-extrabold tracking-[0.12em] uppercase mb-4"
            style={{ color: accent }}
          >
            {tagline}
          </p>

          {/* Description */}
          <p className="text-[#8f98a0] text-[14px] leading-relaxed max-w-[560px]">
            {description}
          </p>
        </div>
      </div>

      {/* ── Feature Grid ──────────────────────────────────────────────────── */}
      <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map(({ icon: FeatureIcon, heading, description: desc }) => (
            <div
              key={heading}
              className="bg-[#1b2838] rounded-sm p-5 border border-[#2a3a4a] hover:border-[#3a4f60] transition-colors"
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-sm mb-4"
                style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <FeatureIcon size={18} style={{ color: accent }} />
              </div>
              <h3 className="text-[#c7d5e0] text-[14px] font-semibold mb-2">{heading}</h3>
              <p className="text-[#8f98a0] text-[12px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Games Section ─────────────────────────────────────────────────── */}
      <div className="max-w-[940px] mx-auto px-4 sm:px-0 pb-10">
        {/* Section header */}
        <div
          className="flex items-center gap-3 mb-4 pb-3"
          style={{ borderBottom: `1px solid ${accent}33` }}
        >
          <div
            className="w-[3px] h-5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <h2 className="text-[#c7d5e0] text-[17px] font-bold">
            Games Supporting {title}
          </h2>
          {!isLoading && (
            <span className="text-[#8f98a0] text-[12px] ml-auto">{games.length} titles</span>
          )}
        </div>

        {/* Game rows */}
        <div className="space-y-1.5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : games.map(game => <GameRow key={game.id} game={game} accent={accent} />)}
        </div>
      </div>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <div
        className="border-t"
        style={{ borderColor: `${accent}22`, backgroundColor: `${accent}08` }}
      >
        <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-white text-[18px] font-bold mb-1">
              Browse More {title} Games
            </h2>
            <p className="text-[#8f98a0] text-[13px]">
              Discover the full catalog of titles available for this play style.
            </p>
          </div>
          <Link href="/search">
            <Button
              className="shrink-0 px-6 py-2.5 text-[13px] font-semibold rounded-sm transition-all duration-150 active:scale-[0.98]"
              style={{
                backgroundColor: accent,
                color: '#fff',
              }}
            >
              Search Games
              <ChevronRight size={15} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
