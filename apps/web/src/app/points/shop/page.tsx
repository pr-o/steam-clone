'use client'

import { atom, useAtom, useAtomValue } from 'jotai'
import { cn } from '@/lib/utils'
import { currentUserAtom } from '@/stores/userStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Category =
  | 'Featured'
  | 'Avatars'
  | 'Backgrounds'
  | 'Badges'
  | 'Awards'
  | 'Chat Effects'
  | 'Keyboard Themes'
  | 'Startup Movies'
  | 'Mini Profile'

const NAV: { label: string; category: Category; indent?: boolean }[] = [
  { label: 'Featured', category: 'Featured' },
  { label: 'Profile Items', category: 'Avatars' },
  { label: 'Avatars', category: 'Avatars', indent: true },
  { label: 'Backgrounds', category: 'Backgrounds', indent: true },
  { label: 'Badges', category: 'Badges', indent: true },
  { label: 'Awards', category: 'Awards', indent: true },
  { label: 'Chat Effects', category: 'Chat Effects' },
  { label: 'Keyboard Themes', category: 'Keyboard Themes' },
  { label: 'Startup Movies', category: 'Startup Movies' },
  { label: 'Mini Profile', category: 'Mini Profile' },
]

interface ShopItem {
  id: number
  name: string
  category: Category
  cost: number
  color: string
  label: string
}

const SHOP_ITEMS: ShopItem[] = [
  // Featured
  { id: 1, name: 'Holiday Sale Avatar Frame', category: 'Featured', cost: 500, color: '#1a3a4a', label: 'AVATAR FRAME' },
  { id: 2, name: 'Steam Anniversary Badge', category: 'Featured', cost: 1000, color: '#2a1a3a', label: 'BADGE' },
  { id: 3, name: 'Neon Pulse Background', category: 'Featured', cost: 2500, color: '#1a2a1a', label: 'BACKGROUND' },
  { id: 4, name: 'Cozy Cat Chat Effect', category: 'Featured', cost: 800, color: '#2a2a1a', label: 'CHAT EFFECT' },
  { id: 5, name: 'Retro Wave Startup Movie', category: 'Featured', cost: 3000, color: '#1a1a2a', label: 'STARTUP MOVIE' },
  { id: 6, name: 'Gold Trophy Award', category: 'Featured', cost: 200, color: '#2a1a1a', label: 'AWARD' },

  // Avatars
  { id: 7, name: 'Astronaut Corgis', category: 'Avatars', cost: 500, color: '#1b2838', label: 'AVATAR' },
  { id: 8, name: 'Pixel Warrior', category: 'Avatars', cost: 500, color: '#1b2838', label: 'AVATAR' },
  { id: 9, name: 'Steam Robot', category: 'Avatars', cost: 500, color: '#1b2838', label: 'AVATAR' },
  { id: 10, name: 'Night Owl', category: 'Avatars', cost: 500, color: '#1b2838', label: 'AVATAR' },
  { id: 11, name: 'Dragon Slayer', category: 'Avatars', cost: 500, color: '#1b2838', label: 'AVATAR' },
  { id: 12, name: 'Space Cadet', category: 'Avatars', cost: 500, color: '#1b2838', label: 'AVATAR' },

  // Backgrounds
  { id: 13, name: 'City at Night', category: 'Backgrounds', cost: 2500, color: '#0f1520', label: 'BACKGROUND' },
  { id: 14, name: 'Deep Space', category: 'Backgrounds', cost: 2500, color: '#0a0a14', label: 'BACKGROUND' },
  { id: 15, name: 'Neon Tokyo', category: 'Backgrounds', cost: 2500, color: '#14051a', label: 'BACKGROUND' },
  { id: 16, name: 'Mountain Dawn', category: 'Backgrounds', cost: 2500, color: '#0a1410', label: 'BACKGROUND' },

  // Badges
  { id: 17, name: 'Completionist', category: 'Badges', cost: 1000, color: '#1a1a00', label: 'BADGE' },
  { id: 18, name: 'Community Leader', category: 'Badges', cost: 1500, color: '#001a00', label: 'BADGE' },
  { id: 19, name: 'Early Adopter', category: 'Badges', cost: 750, color: '#1a0a00', label: 'BADGE' },

  // Awards
  { id: 20, name: 'Helpful Award', category: 'Awards', cost: 100, color: '#1a2a0a', label: 'AWARD' },
  { id: 21, name: 'Funny Award', category: 'Awards', cost: 100, color: '#1a1a0a', label: 'AWARD' },
  { id: 22, name: 'Exceptional Award', category: 'Awards', cost: 200, color: '#0a1a1a', label: 'AWARD' },
  { id: 23, name: 'MVP Award', category: 'Awards', cost: 500, color: '#1a0a1a', label: 'AWARD' },

  // Chat Effects
  { id: 24, name: 'Raining Cats', category: 'Chat Effects', cost: 800, color: '#0a1a0a', label: 'CHAT EFFECT' },
  { id: 25, name: 'Fireworks Burst', category: 'Chat Effects', cost: 800, color: '#1a0a0a', label: 'CHAT EFFECT' },
  { id: 26, name: 'Pixel Rain', category: 'Chat Effects', cost: 800, color: '#0a0a1a', label: 'CHAT EFFECT' },

  // Keyboard Themes
  { id: 27, name: 'Dark Matter', category: 'Keyboard Themes', cost: 1500, color: '#0a0a0a', label: 'KEYBOARD' },
  { id: 28, name: 'Sakura Pink', category: 'Keyboard Themes', cost: 1500, color: '#1a0514', label: 'KEYBOARD' },

  // Startup Movies
  { id: 29, name: 'Neon Pulse', category: 'Startup Movies', cost: 3000, color: '#050514', label: 'STARTUP MOVIE' },
  { id: 30, name: 'Steam Classic', category: 'Startup Movies', cost: 3000, color: '#0a0f14', label: 'STARTUP MOVIE' },

  // Mini Profile
  { id: 31, name: 'Cyberpunk Edge', category: 'Mini Profile', cost: 5000, color: '#051414', label: 'MINI PROFILE' },
  { id: 32, name: 'Fantasy Quest', category: 'Mini Profile', cost: 5000, color: '#050514', label: 'MINI PROFILE' },
]

// ─── Atom ─────────────────────────────────────────────────────────────────────

const activeCategoryAtom = atom<Category>('Featured')

// ─── Item Card ────────────────────────────────────────────────────────────────

function ItemCard({ item }: { item: ShopItem }) {
  return (
    <div className="group cursor-pointer">
      <div
        className="aspect-square rounded-sm overflow-hidden mb-2 flex flex-col items-center justify-center gap-2 border border-[#2a3a4a] group-hover:border-[#66c0f4]/40 transition-colors"
        style={{ background: `linear-gradient(135deg, ${item.color} 0%, #0d1117 100%)` }}
      >
        <span className="text-[9px] font-bold tracking-widest text-[#4e5d6e] uppercase">{item.label}</span>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a9fff]/20 to-[#00adee]/10 border border-[#1a9fff]/20 flex items-center justify-center">
          <span className="text-[#66c0f4] text-[18px]">⊙</span>
        </div>
      </div>
      <p className="text-[#c7d5e0] text-[12px] font-medium leading-tight group-hover:text-white transition-colors">
        {item.name}
      </p>
      <p className="text-[#a4d007] text-[11px] font-bold mt-0.5 flex items-center gap-1">
        <span className="text-[#66c0f4]">⊙</span>
        {item.cost.toLocaleString()} pts
      </p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PointsShopPage() {
  const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom)
  const user = useAtomValue(currentUserAtom)

  const items = SHOP_ITEMS.filter(
    item => activeCategory === 'Featured' || item.category === activeCategory
  )

  const currentNavLabel = NAV.find(n => n.category === activeCategory && !n.indent)?.label
    ?? NAV.find(n => n.category === activeCategory)?.label
    ?? activeCategory

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-[24px] font-bold tracking-tight">Steam Points Shop</h1>
          <p className="text-[#8f98a0] text-[13px] mt-1">Use your points to pick up new profile items and more.</p>
        </div>
        {user && (
          <div className="text-right">
            <p className="text-[#8f98a0] text-[11px] uppercase tracking-wider">Your Balance</p>
            <p className="text-[#a4d007] text-[20px] font-bold flex items-center gap-1.5 justify-end">
              <span className="text-[#66c0f4] text-[16px]">⊙</span>
              {(user.wallet.amount ?? 0).toLocaleString()}
              <span className="text-[13px] font-normal text-[#8f98a0]">pts</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-5">
        {/* Left Sidebar */}
        <div className="w-[200px] shrink-0">
          <ScrollArea className="h-full">
            <nav className="space-y-0.5">
              {NAV.map((item, i) => {
                // "Profile Items" is a non-clickable section header
                if (item.label === 'Profile Items') {
                  return (
                    <p key={i} className="text-[#8f98a0] text-[10px] uppercase tracking-wider px-3 pt-4 pb-1 font-semibold">
                      Profile Items
                    </p>
                  )
                }
                return (
                  <Button
                    key={i}
                    variant="ghost"
                    onClick={() => setActiveCategory(item.category)}
                    className={cn(
                      'w-full text-left rounded-sm transition-colors text-[13px] justify-start',
                      item.indent ? 'px-6 py-1.5' : 'px-3 py-2',
                      activeCategory === item.category
                        ? 'text-white bg-[#1b2838]'
                        : 'text-[#8f98a0] hover:text-[#c7d5e0] hover:bg-white/5'
                    )}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </ScrollArea>
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[#c7d5e0] text-[15px] font-semibold mb-4 border-b border-[#2a3a4a] pb-3">
            {currentNavLabel}
            <span className="text-[#4e5d6e] text-[12px] font-normal ml-2">({items.length} items)</span>
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
