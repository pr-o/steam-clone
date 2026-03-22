'use client'

import { Button } from '@/components/ui/button'
import {
  Monitor,
  Apple,
  X,
  Globe,
  Gamepad2,
  Cloud,
  Unlock,
  Wrench,
  CreditCard,
  Users,
  Wifi,
} from 'lucide-react'

// ─── Static data ────────────────────────────────────────────────────────────

const STATS = [
  { label: 'ONLINE', value: '41,310,484' },
  { label: 'GAMES AVAILABLE', value: '13,033,096' },
]

const ALTERNATING_SECTIONS = [
  {
    id: 'access',
    side: 'left' as const,
    tag: 'ACCESS',
    title: 'Access Games Instantly',
    body: `With Steam, you have access to thousands of games from every genre. Enjoy exclusives, early access titles, and the latest releases instantly, from anywhere in the world.`,
    learnMore: '#',
    imgSrc: 'https://placehold.co/630x350/1b2838/66c0f4?text=Access+Games',
    imgAlt: 'Access Games Instantly',
  },
  {
    id: 'community',
    side: 'right' as const,
    tag: 'COMMUNITY',
    title: 'Join the Community',
    body: `Meet other gamers, join groups, form clans, chat in-game, and more. With over 100 million potential friends (or enemies), the Steam Community is the ultimate place to connect.`,
    learnMore: '#',
    imgSrc: 'https://placehold.co/630x350/1b2838/66c0f4?text=Community',
    imgAlt: 'Join the Steam Community',
  },
  {
    id: 'hardware',
    side: 'left' as const,
    tag: 'HARDWARE',
    title: 'Experience Steam Hardware',
    body: `Valve creates innovative hardware to complement the Steam experience — including the award-winning Steam Deck portable gaming PC, and the Steam Controller.`,
    learnMore: '#',
    imgSrc: 'https://placehold.co/630x350/1b2838/66c0f4?text=Steam+Hardware',
    imgAlt: 'Steam Hardware',
  },
  {
    id: 'release',
    side: 'right' as const,
    tag: 'DEVELOPERS',
    title: 'Release your Game',
    body: `Steam is the world's largest game distribution platform. Publish your game to millions of customers worldwide using Steam Direct — our streamlined submission process for game creators.`,
    learnMore: '#',
    imgSrc: 'https://placehold.co/630x350/1b2838/66c0f4?text=Release+Your+Game',
    imgAlt: 'Release your Game on Steam',
  },
]

const FEATURES = [
  {
    icon: Globe,
    title: 'Multi-Platform',
    desc: 'Play your games on Windows, Mac, and Linux. Your library travels with you.',
  },
  {
    icon: Gamepad2,
    title: 'Controller Support',
    desc: 'Full controller support for hundreds of titles, with customizable button mapping.',
  },
  {
    icon: Cloud,
    title: 'Cloud Saves',
    desc: 'Your saves are automatically synced to the cloud. Resume anywhere, anytime.',
  },
  {
    icon: Unlock,
    title: 'Early Access',
    desc: 'Play games in development and help shape the final product with your feedback.',
  },
  {
    icon: Wrench,
    title: 'Workshop',
    desc: 'Browse thousands of user-created mods, maps, and items for your favourite games.',
  },
  {
    icon: CreditCard,
    title: 'Trading Cards',
    desc: 'Collect, trade, and craft badges from games you play to earn Steam rewards.',
  },
  {
    icon: Users,
    title: 'Family Sharing',
    desc: 'Share your Steam library with family members living in your household.',
  },
  {
    icon: Wifi,
    title: 'In-Home Streaming',
    desc: 'Stream games from your gaming PC to any other computer in your home.',
  },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function SteamLogoMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-14 h-14"
      aria-label="Steam logo"
    >
      <circle cx="24" cy="24" r="22" fill="#1b2838" stroke="#66c0f4" strokeWidth="1.5" />
      <path
        d="M24 8C15.163 8 8 15.163 8 24c0 2.46.562 4.787 1.558 6.863L16.5 27.5c.47-1.89 2.18-3.3 4.22-3.3.187 0 .372.012.554.035l3.226-4.657A6.5 6.5 0 0 1 30.5 13a6.5 6.5 0 0 1 0 13c-.187 0-.373-.01-.557-.03l-4.57 3.26c.016.16.027.323.027.49 0 2.485-2.015 4.5-4.5 4.5a4.504 4.504 0 0 1-4.398-3.527l-4.864 2.014A15.936 15.936 0 0 0 24 40c8.837 0 16-7.163 16-16S32.837 8 24 8Zm6.5 17a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"
        fill="#66c0f4"
      />
    </svg>
  )
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1b2838 0%, #171a21 100%)' }}
    >
      {/* Subtle diagonal grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #66c0f4 0, #66c0f4 1px, transparent 0, transparent 50%)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1190px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* ── Left column ── */}
          <div className="flex-1 min-w-0">
            {/* Logo + wordmark */}
            <div className="flex items-center gap-4 mb-6">
              <SteamLogoMark />
              <span
                className="text-4xl font-bold tracking-widest uppercase"
                style={{ color: '#c7d5e0', letterSpacing: '0.18em' }}
              >
                STEAM
              </span>
            </div>

            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-[480px]"
              style={{ color: '#8f98a0' }}
            >
              Steam is the ultimate destination for playing, discussing, and creating games.
            </p>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-10 mb-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-xl sm:text-2xl font-bold tabular-nums"
                    style={{ color: '#c7d5e0' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[11px] font-semibold tracking-widest uppercase mt-0.5"
                    style={{ color: '#8f98a0' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Install button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                className="font-bold text-sm uppercase tracking-wider px-7 py-2.5 h-auto transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b2838]"
                style={{
                  background: '#5c7e10',
                  color: '#ffffff',
                  borderRadius: '3px',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = '#a4d007'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = '#5c7e10'
                }}
              >
                INSTALL STEAM
              </Button>

              {/* Platform icons */}
              <div className="flex items-center gap-3" style={{ color: '#8f98a0' }}>
                <Monitor className="w-5 h-5" aria-label="Windows" />
                <Apple className="w-5 h-5" aria-label="macOS" />
                <X className="w-4 h-4" aria-label="Linux" />
              </div>
            </div>
          </div>

          {/* ── Right column — hero image ── */}
          <div className="flex-1 w-full max-w-[580px] lg:max-w-none">
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(102,192,244,0.08)',
              }}
            >
              <img
                src="https://placehold.co/580x340/1b2838/66c0f4?text=Gaming+Setup"
                alt="Steam gaming setup"
                className="w-full h-auto block"
                width={580}
                height={340}
              />
              {/* Color overlay for depth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(27,40,56,0.3) 0%, transparent 60%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AlternatingSection({
  section,
}: {
  section: (typeof ALTERNATING_SECTIONS)[number]
}) {
  const isLeft = section.side === 'left'

  const textBlock = (
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <div
        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3"
        style={{ color: '#66c0f4' }}
      >
        {section.tag}
      </div>
      <h2
        className="text-2xl sm:text-3xl font-bold mb-4 leading-snug"
        style={{ color: '#c7d5e0' }}
      >
        {section.title}
      </h2>
      <p
        className="text-sm leading-relaxed mb-6 max-w-[420px]"
        style={{ color: '#8f98a0' }}
      >
        {section.body}
      </p>
      <a
        href={section.learnMore}
        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
        style={{ color: '#66c0f4' }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color = '#acdbf5')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color = '#66c0f4')
        }
      >
        LEARN MORE &rsaquo;
      </a>
    </div>
  )

  const imageBlock = (
    <div className="flex-1 w-full max-w-[580px]">
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          boxShadow:
            '0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(102,192,244,0.06)',
        }}
      >
        <img
          src={section.imgSrc}
          alt={section.imgAlt}
          className="w-full h-auto block"
          width={630}
          height={350}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLeft
              ? 'linear-gradient(to left, rgba(23,26,33,0.25) 0%, transparent 50%)'
              : 'linear-gradient(to right, rgba(23,26,33,0.25) 0%, transparent 50%)',
          }}
        />
      </div>
    </div>
  )

  return (
    <section
      className="py-14 sm:py-20"
      style={{
        background: isLeft ? '#171a21' : '#1b2838',
        borderTop: '1px solid #2a3f5a',
      }}
    >
      <div className="max-w-[1190px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {isLeft ? (
            <>
              {textBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {textBlock}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function FeaturesGrid() {
  return (
    <section
      className="py-14 sm:py-20"
      style={{
        background: '#171a21',
        borderTop: '1px solid #2a3f5a',
      }}
    >
      <div className="max-w-[1190px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-2"
          style={{ color: '#c7d5e0' }}
        >
          Features
        </h2>
        <p
          className="text-sm text-center mb-10 max-w-[520px] mx-auto leading-relaxed"
          style={{ color: '#8f98a0' }}
        >
          Thousands of games, a thriving community, and features that keep you playing.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="group flex flex-col items-center text-center p-5 rounded-sm transition-colors"
                style={{
                  background: '#1b2838',
                  border: '1px solid #2a3f5a',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = '#4b6a8b'
                  ;(e.currentTarget as HTMLDivElement).style.background = '#16202d'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = '#2a3f5a'
                  ;(e.currentTarget as HTMLDivElement).style.background = '#1b2838'
                }}
              >
                <div
                  className="mb-3 p-2.5 rounded-sm"
                  style={{ background: 'rgba(102,192,244,0.08)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#66c0f4' }} />
                </div>
                <h3
                  className="text-sm font-bold mb-1.5 leading-snug"
                  style={{ color: '#c7d5e0' }}
                >
                  {feat.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#8f98a0' }}>
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function AndMoreBanner() {
  return (
    <section
      className="py-12 sm:py-16"
      style={{
        background: '#1b2838',
        borderTop: '1px solid #2a3f5a',
      }}
    >
      <div className="max-w-[1190px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold mb-1"
              style={{ color: '#c7d5e0' }}
            >
              And so much more...
            </h2>
            <p className="text-sm" style={{ color: '#8f98a0' }}>
              Discover everything Steam has to offer for players and creators alike.
            </p>
          </div>
          <Button
            className="font-bold text-sm uppercase tracking-wider px-8 py-2.5 h-auto shrink-0 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b2838]"
            style={{
              background: '#4c7b8a',
              color: '#ffffff',
              borderRadius: '3px',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = '#67c1f5'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = '#4c7b8a'
            }}
          >
            LEARN MORE
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div style={{ background: '#171a21' }}>
      <HeroSection />
      {ALTERNATING_SECTIONS.map((section) => (
        <AlternatingSection key={section.id} section={section} />
      ))}
      <FeaturesGrid />
      <AndMoreBanner />
    </div>
  )
}
