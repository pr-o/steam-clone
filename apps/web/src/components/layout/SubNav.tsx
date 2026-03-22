'use client'

import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { Search, ChevronDown } from 'lucide-react'
import { searchQueryAtom } from '@/stores/uiStore'
import { isSignedInAtom } from '@/stores/userStore'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const BROWSE_ITEMS = [
  { label: 'Browse', hasDropdown: true },
  { label: 'Recommendations', hasDropdown: true },
  { label: 'Categories', hasDropdown: true },
  { label: 'Hardware', hasDropdown: false },
  { label: 'Ways to Play', hasDropdown: true },
  { label: 'Special Sections', hasDropdown: true },
]

export function SubNav() {
  const router = useRouter()
  const [query, setQuery] = useAtom(searchQueryAtom)
  const [isSignedIn] = useAtom(isSignedInAtom)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="fixed top-9 left-0 right-0 z-40 h-9 bg-steam-bg border-b border-black/40 flex items-center">
      {/* Horizontally scrollable on mobile */}
      <ScrollAreaPrimitive.Root className="flex-1 min-w-0 overflow-hidden">
        <ScrollAreaPrimitive.Viewport className="w-full h-9">
          <div className="flex items-center h-9">
            {BROWSE_ITEMS.map(({ label, hasDropdown }) => (
              <button
                key={label}
                className="h-9 px-3 flex items-center gap-1 text-[12px] text-steam-navDefault hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {label}
                {hasDropdown && <ChevronDown size={11} className="opacity-70" />}
              </button>
            ))}

            {isSignedIn && (
              <button className="h-9 px-3 flex items-center gap-1 text-[12px] text-steam-navDefault hover:text-white transition-colors whitespace-nowrap shrink-0">
                Your Store
              </button>
            )}
          </div>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="horizontal" className="h-1" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex items-center shrink-0 pr-3"
      >
        <div className="flex items-center bg-[#316282] rounded-sm overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="search the store"
            className={cn(
              'h-[26px] w-[180px] sm:w-[220px] px-2 text-[12px] bg-transparent',
              'text-steam-text placeholder:text-steam-textDim',
              'outline-none focus:ring-0 border-0'
            )}
          />
          <button
            type="submit"
            className="h-[26px] w-[30px] flex items-center justify-center bg-steam-blue hover:bg-steam-cerulean transition-colors shrink-0"
          >
            <Search size={13} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  )
}
