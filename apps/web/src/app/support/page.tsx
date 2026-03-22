'use client'

import { useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAtomValue } from 'jotai'
import { isSignedInAtom } from '@/stores/userStore'

const POPULAR_PRODUCTS = [
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    icon: 'https://placehold.co/32x32/1b2838/66c0f4?text=CS',
  },
  {
    id: 'pubg',
    title: 'PUBG: BATTLEGROUNDS',
    icon: 'https://placehold.co/32x32/1b2838/66c0f4?text=PG',
  },
  {
    id: 'slay',
    title: 'Slay the Spire 2',
    icon: 'https://placehold.co/32x32/1b2838/66c0f4?text=SS',
  },
  {
    id: 'dota2',
    title: 'Dota 2',
    icon: 'https://placehold.co/32x32/1b2838/66c0f4?text=D2',
  },
]

const TOPIC_CATEGORIES = [
  'Steam Spring Sale and Rewards',
  'Games, Software, etc.',
  'Purchases',
  'My Account',
  'Trading, Gifting, Market and Steam Points',
  'Steam Client',
  'Steam Community',
  'Steam Hardware',
  'I have charges from Steam that I didn\'t make',
]

export default function SupportPage() {
  const isSignedIn = useAtomValue(isSignedInAtom)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryToggle = (category: string) => {
    setOpenCategory(prev => (prev === category ? null : category))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#171a21' }}>
      <div className="max-w-[700px] mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#c7d5e0' }}
          >
            Steam Support
          </h1>
          <p
            className="text-lg font-medium"
            style={{ color: '#66c0f4' }}
          >
            What do you need help with?
          </p>
        </div>

        {/* Sign-in row */}
        {!isSignedIn && (
          <div
            className="rounded px-5 py-4 mb-6 text-center"
            style={{ backgroundColor: '#1b2838' }}
          >
            <p
              className="text-sm mb-4"
              style={{ color: '#c7d5e0' }}
            >
              Sign in to your Steam account to review purchases, account status, and get personalized help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                className="text-sm font-semibold px-6 py-2"
                style={{
                  backgroundColor: '#1a9fff',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1b8fe6'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a9fff'
                }}
              >
                Sign in to Steam
              </Button>
              <Button
                variant="secondary"
                className="text-sm font-semibold px-6 py-2"
                style={{
                  backgroundColor: '#4a5568',
                  color: '#c7d5e0',
                  border: 'none',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#5a6578'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4a5568'
                }}
              >
                Help, I can&apos;t sign in
              </Button>
            </div>
          </div>
        )}

        {/* Popular Products */}
        <div className="mb-4">
          <p
            className="text-xs font-bold tracking-widest mb-3 uppercase"
            style={{ color: '#8f98a0' }}
          >
            Popular Products
          </p>
          <div
            className="rounded overflow-hidden"
            style={{ border: '1px solid #2a3f5a' }}
          >
            {POPULAR_PRODUCTS.map((product, index) => (
              <a
                key={product.id}
                href={`/app/${product.id}/support`}
                className="flex items-center gap-3 px-4 py-3 group transition-colors duration-150"
                style={{
                  backgroundColor: '#1b2838',
                  borderBottom:
                    index < POPULAR_PRODUCTS.length - 1
                      ? '1px solid #2a3f5a'
                      : 'none',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#213a50'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1b2838'
                }}
              >
                {/* Game icon */}
                <img
                  src={product.icon}
                  alt={product.title}
                  width={32}
                  height={32}
                  className="rounded flex-shrink-0"
                  style={{ imageRendering: 'auto' }}
                />
                {/* Title */}
                <span
                  className="flex-1 text-sm font-medium"
                  style={{ color: '#c7d5e0' }}
                >
                  {product.title}
                </span>
                {/* Chevron */}
                <ChevronRight
                  size={16}
                  style={{ color: '#8f98a0' }}
                  className="flex-shrink-0 group-hover:text-[#66c0f4] transition-colors duration-150"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Topic Categories — Accordion */}
        <div
          className="rounded overflow-hidden mb-6"
          style={{ border: '1px solid #2a3f5a' }}
        >
          {TOPIC_CATEGORIES.map((category, index) => {
            const isOpen = openCategory === category
            return (
              <div
                key={category}
                style={{
                  borderBottom:
                    index < TOPIC_CATEGORIES.length - 1
                      ? '1px solid #2a3f5a'
                      : 'none',
                }}
              >
                {/* Accordion trigger */}
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9fff] focus-visible:ring-offset-0"
                  style={{
                    backgroundColor: isOpen ? '#213a50' : '#1b2838',
                  }}
                  onMouseEnter={e => {
                    if (!isOpen) {
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e3347'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isOpen) {
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1b2838'
                    }
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#c7d5e0' }}
                  >
                    {category}
                  </span>
                  <ChevronRight
                    size={16}
                    className="flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: '#8f98a0',
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Accordion content */}
                {isOpen && (
                  <div
                    className="px-5 py-4"
                    style={{ backgroundColor: '#16202d' }}
                  >
                    <p
                      className="text-sm mb-3"
                      style={{ color: '#8f98a0' }}
                    >
                      Contact Steam Support about{' '}
                      <span style={{ color: '#c7d5e0' }}>{category}</span>.
                    </p>
                    <a
                      href="#"
                      className="text-sm underline underline-offset-2 transition-colors duration-150"
                      style={{ color: '#66c0f4' }}
                      onMouseEnter={e => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color = '#1a9fff'
                      }}
                      onMouseLeave={e => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color = '#66c0f4'
                      }}
                    >
                      Contact Support &rarr;
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#8f98a0' }}
          />
          <Input
            type="text"
            placeholder="Search issues, features, and games"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 text-sm rounded placeholder:text-[#8f98a0] focus-visible:ring-1 focus-visible:ring-[#1a9fff] border-0"
            style={{
              backgroundColor: '#316282',
              color: '#c7d5e0',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}
