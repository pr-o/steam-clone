'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── Sub-nav sections ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Steam Hardware', href: '#steam-hardware' },
  { label: 'Steam Deck',     href: '#steam-deck' },
  { label: 'Steam Controller', href: '#steam-controller' },
  { label: 'Steam Machine',  href: '#steam-machine' },
  { label: 'Steam Frame',    href: '#steam-frame' },
] as const

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="steam-hardware"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0f14' }}
    >
      {/* Atmospheric radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(26,159,255,0.08) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(0,173,238,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Hero image */}
      <div className="relative w-full max-w-[1280px] mx-auto px-4">
        <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <img
            src="https://placehold.co/1280x560/0a0f14/1a9fff?text=Steam+Hardware"
            alt="Steam Hardware"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.55) contrast(1.1)' }}
          />
          {/* Overlay gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,15,20,0.95) 0%, rgba(10,15,20,0.5) 40%, rgba(10,15,20,0.1) 100%)',
            }}
          />

          {/* Hero text overlay */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-10 md:p-16">
            <h1
              className="text-white font-black tracking-[-0.02em] leading-none"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                letterSpacing: '-0.03em',
              }}
            >
              COMING IN 2026
            </h1>
            <Link
              href="#"
              className="mt-4 flex items-center gap-2 text-[#1a9fff] hover:text-[#66c0f4] transition-colors text-[14px] font-medium tracking-wide group"
              style={{ textShadow: '0 2px 12px rgba(26,159,255,0.4)' }}
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#1a9fff] group-hover:border-[#66c0f4] group-hover:bg-[#1a9fff]/10 transition-all"
                style={{ fontSize: '10px' }}
                aria-hidden
              >
                ▶
              </span>
              Watch the Announcement Video
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4e5d6e] text-[11px] tracking-widest uppercase">
        <span>Explore</span>
        <span className="animate-bounce text-[#1a9fff]">↓</span>
      </div>
    </section>
  )
}

// ─── Sticky Product Sub-nav ───────────────────────────────────────────────────

function ProductSubNav() {
  const [active, setActive] = useState('steam-hardware')

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setActive(id)
  }

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b"
      style={{
        background: 'rgba(10,15,20,0.96)',
        backdropFilter: 'blur(12px)',
        borderColor: '#1a9fff',
        borderBottomWidth: '2px',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 flex items-center overflow-x-auto scrollbar-none">
        {NAV_ITEMS.map(item => {
          const id = item.href.replace('#', '')
          const isActive = active === id
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={e => handleClick(e, item.href)}
              className="shrink-0 px-4 py-3 text-[13px] font-semibold tracking-wide transition-colors relative whitespace-nowrap"
              style={{
                color: isActive ? '#ffffff' : '#8f98a0',
                background: isActive ? 'rgba(26,159,255,0.12)' : 'transparent',
              }}
            >
              {item.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: '#1a9fff' }}
                />
              )}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

// ─── Section: Steam Deck ──────────────────────────────────────────────────────

function SteamDeckSection() {
  return (
    <section
      id="steam-deck"
      className="w-full py-20 md:py-28"
      style={{ background: '#0d1117' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: content */}
        <div className="flex flex-col gap-6">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e8441a 0%, #c0392b 100%)' }}
            >
              <span className="text-white font-black text-[18px]">S</span>
            </div>
            <span
              className="text-white font-black tracking-wide text-[22px] uppercase"
              style={{ letterSpacing: '0.05em' }}
            >
              STEAM DECK
            </span>
          </div>

          <div>
            <h2
              className="text-white font-black leading-none"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 0%, #c7d5e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              YOUR GAMES.
            </h2>
            <h2
              className="font-black leading-none"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #1a9fff 0%, #66c0f4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EVERYWHERE.
            </h2>
          </div>

          <ul className="space-y-3">
            {[
              'Play your entire Steam library on the go',
              'Thousands of titles Verified for Steam Deck',
              'Dock it to your TV for living-room gaming',
            ].map(point => (
              <li key={point} className="flex items-start gap-3 text-[#c7d5e0] text-[14px]">
                <span
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(26,159,255,0.15)', color: '#1a9fff', border: '1px solid rgba(26,159,255,0.3)' }}
                >
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div>
            <a
              href="/hardware/steam-deck"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[13px] tracking-wider uppercase rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9fff] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1a9fff 0%, #0077cc 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 24px rgba(26,159,255,0.3), 0 1px 0 rgba(255,255,255,0.1) inset',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 8px 32px rgba(26,159,255,0.5), 0 1px 0 rgba(255,255,255,0.1) inset'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 4px 24px rgba(26,159,255,0.3), 0 1px 0 rgba(255,255,255,0.1) inset'
              }}
            >
              Shop Steam Deck →
            </a>
          </div>
        </div>

        {/* Right: product image */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(26,159,255,0.1) 0%, transparent 70%)',
            }}
          />
          <img
            src="https://placehold.co/640x400/0d1117/1a9fff?text=Steam+Deck"
            alt="Steam Deck"
            className="relative rounded-xl w-full max-w-[500px] object-cover"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(26,159,255,0.15)',
            }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Section: Steam Controller ────────────────────────────────────────────────

function SteamControllerSection() {
  return (
    <section
      id="steam-controller"
      className="w-full py-20 md:py-28"
      style={{ background: '#0a0f14' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: product image (reversed column order on md+) */}
        <div className="relative flex items-center justify-center order-2 md:order-1">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,173,238,0.08) 0%, transparent 70%)',
            }}
          />
          <img
            src="https://placehold.co/640x400/0a0f14/00adee?text=Steam+Controller"
            alt="Steam Controller"
            className="relative rounded-xl w-full max-w-[500px] object-cover"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,173,238,0.15)',
            }}
          />
        </div>

        {/* Right: content */}
        <div className="flex flex-col gap-6 order-1 md:order-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a9fff 0%, #0077cc 100%)' }}
            >
              <span className="text-white font-black text-[16px]">⊕</span>
            </div>
            <span
              className="text-white font-black tracking-wide text-[22px] uppercase"
              style={{ letterSpacing: '0.05em' }}
            >
              STEAM CONTROLLER
            </span>
          </div>

          <h2
            className="text-white font-black leading-none"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
            }}
          >
            PRECISION
            <br />
            <span style={{ color: '#1a9fff' }}>REDEFINED.</span>
          </h2>

          <p className="text-[#8f98a0] text-[14px] leading-relaxed max-w-md">
            The Steam Controller puts a trackpad in your hands and a universe of games
            at your fingertips. Dual trackpads deliver mouse-like precision, while
            haptic feedback gives you the sensation of physical buttons — on any game.
          </p>

          <ul className="space-y-3">
            {[
              'Dual trackpads with haptic feedback',
              'Fully customizable button layout via Steam Input',
              'Compatible with the entire Steam library',
            ].map(point => (
              <li key={point} className="flex items-start gap-3 text-[#c7d5e0] text-[14px]">
                <span
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(0,173,238,0.15)', color: '#00adee', border: '1px solid rgba(0,173,238,0.3)' }}
                >
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div>
            <a
              href="/hardware/steam-controller"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[13px] tracking-wider uppercase rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00adee] active:scale-95"
              style={{
                background: 'transparent',
                color: '#1a9fff',
                border: '1px solid rgba(26,159,255,0.4)',
                boxShadow: '0 4px 16px rgba(26,159,255,0.1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(26,159,255,0.1)'
                el.style.borderColor = 'rgba(26,159,255,0.7)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.borderColor = 'rgba(26,159,255,0.4)'
              }}
            >
              Learn More →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section: Steam Machine ───────────────────────────────────────────────────

function SteamMachineSection() {
  return (
    <section
      id="steam-machine"
      className="w-full py-20 md:py-28"
      style={{ background: '#0d1117' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span
            className="text-white font-black tracking-wide text-[22px] uppercase"
            style={{ letterSpacing: '0.05em' }}
          >
            STEAM MACHINE
          </span>

          <h2
            className="text-white font-black leading-none"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
            }}
          >
            PC GAMING.
            <br />
            <span style={{ color: '#66c0f4' }}>IN YOUR LIVING ROOM.</span>
          </h2>

          <p className="text-[#8f98a0] text-[14px] leading-relaxed max-w-md">
            Steam Machines bring the power of a gaming PC to your living room.
            Built by hardware partners and powered by SteamOS, they deliver
            a seamless couch gaming experience with access to your full Steam library.
          </p>

          <ul className="space-y-3">
            {[
              'Runs SteamOS — purpose-built for gaming',
              'Access to thousands of Linux-compatible games',
              'Play with keyboard, mouse, or controller',
            ].map(point => (
              <li key={point} className="flex items-start gap-3 text-[#c7d5e0] text-[14px]">
                <span
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(102,192,244,0.15)', color: '#66c0f4', border: '1px solid rgba(102,192,244,0.3)' }}
                >
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(102,192,244,0.07) 0%, transparent 70%)',
            }}
          />
          <img
            src="https://placehold.co/640x400/0d1117/66c0f4?text=Steam+Machine"
            alt="Steam Machine"
            className="relative rounded-xl w-full max-w-[500px] object-cover"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(102,192,244,0.12)',
            }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Section: Steam Frame ─────────────────────────────────────────────────────

function SteamFrameSection() {
  return (
    <section
      id="steam-frame"
      className="w-full py-20 md:py-28"
      style={{ background: '#0a0f14' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image left */}
        <div className="relative flex items-center justify-center order-2 md:order-1">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(26,159,255,0.06) 0%, transparent 70%)',
            }}
          />
          <img
            src="https://placehold.co/640x400/0a0f14/1a9fff?text=Steam+Frame"
            alt="Steam Frame"
            className="relative rounded-xl w-full max-w-[500px] object-cover"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(26,159,255,0.1)',
            }}
          />
        </div>

        {/* Content right */}
        <div className="flex flex-col gap-6 order-1 md:order-2">
          <span
            className="text-white font-black tracking-wide text-[22px] uppercase"
            style={{ letterSpacing: '0.05em' }}
          >
            STEAM FRAME
          </span>

          <h2
            className="text-white font-black leading-none"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
            }}
          >
            YOUR GAME.
            <br />
            <span style={{ color: '#1a9fff' }}>ANY DISPLAY.</span>
          </h2>

          <p className="text-[#8f98a0] text-[14px] leading-relaxed max-w-md">
            Steam Frame turns any display into a gaming powerhouse. Stream games
            directly from your PC or Steam Machine to any screen in your home —
            with near-zero latency and full quality.
          </p>

          <ul className="space-y-3">
            {[
              'Stream from any Steam-connected PC',
              'Near-zero latency over local network',
              'Supports up to 4K HDR output',
            ].map(point => (
              <li key={point} className="flex items-start gap-3 text-[#c7d5e0] text-[14px]">
                <span
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(26,159,255,0.15)', color: '#1a9fff', border: '1px solid rgba(26,159,255,0.3)' }}
                >
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ─── Discover More CTA ────────────────────────────────────────────────────────

function DiscoverMoreCTA() {
  return (
    <section
      className="w-full py-24"
      style={{
        background:
          'linear-gradient(180deg, #0a0f14 0%, #0d1520 50%, #0a0f14 100%)',
        borderTop: '1px solid rgba(26,159,255,0.1)',
      }}
    >
      <div
        className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-8 text-center relative"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(26,159,255,0.05) 0%, transparent 70%)',
          }}
        />

        <p className="text-[#4e5d6e] text-[11px] tracking-[0.2em] uppercase font-semibold">
          The Steam Hardware Ecosystem
        </p>

        <h2
          className="text-white font-black max-w-2xl"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          One platform.
          <br />
          <span style={{ color: '#1a9fff' }}>Every way to play.</span>
        </h2>

        <p className="text-[#8f98a0] text-[15px] leading-relaxed max-w-lg">
          From handheld to living room, from mouse to controller — Steam hardware
          is engineered to put your games anywhere you want them.
        </p>

        <a
          href="/hardware"
          className="inline-flex items-center gap-3 px-10 py-4 font-bold text-[13px] tracking-[0.15em] uppercase rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9fff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f14] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #1a9fff 0%, #0077cc 100%)',
            color: '#ffffff',
            boxShadow:
              '0 4px 24px rgba(26,159,255,0.35), 0 1px 0 rgba(255,255,255,0.12) inset',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow =
              '0 8px 40px rgba(26,159,255,0.55), 0 1px 0 rgba(255,255,255,0.12) inset'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow =
              '0 4px 24px rgba(26,159,255,0.35), 0 1px 0 rgba(255,255,255,0.12) inset'
          }}
        >
          EXPLORE ALL STEAM HARDWARE
        </a>

        <p className="text-[#4e5d6e] text-[12px]">
          All hardware ships with a 2-year warranty and 30-day return policy.
        </p>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HardwarePage() {
  return (
    <div className="w-full" style={{ background: '#0a0f14' }}>
      <Hero />
      <ProductSubNav />
      <SteamDeckSection />
      <SteamControllerSection />
      <SteamMachineSection />
      <SteamFrameSection />
      <DiscoverMoreCTA />
    </div>
  )
}
