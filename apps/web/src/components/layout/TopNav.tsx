'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAtom } from 'jotai'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { mobileNavOpenAtom } from '@/stores/uiStore'
import { isSignedInAtom } from '@/stores/userStore'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'STORE', href: '/' },
  { label: 'COMMUNITY', href: '/community' },
  { label: 'ABOUT', href: '/about' },
  { label: 'SUPPORT', href: '/support' },
]

export function TopNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useAtom(mobileNavOpenAtom)
  const [isSignedIn] = useAtom(isSignedInAtom)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-9 bg-steam-bg border-b border-black/30"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div className="flex items-center w-full px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4 shrink-0 group">
          <img
            src="/steam-logo.jpg"
            alt="Steam"
            className="h-[22px] w-[22px] object-contain rounded-sm"
          />
          <span className="hidden sm:block text-white font-bold text-[13px] tracking-[0.15em]">
            STEAM
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center h-full flex-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  'h-9 px-3 flex items-center text-[11px] font-semibold tracking-[0.08em] transition-colors duration-100',
                  isActive
                    ? 'text-white bg-[#395873]'
                    : 'text-steam-navDefault hover:text-white'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right cluster */}
        <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
          <Link
            href="/about/download"
            className="h-[26px] px-3 flex items-center gap-1.5 text-[11px] font-semibold text-white rounded-sm transition-brightness"
            style={{ background: 'linear-gradient(to bottom, #a4c639, #6e8f23)' }}
          >
            <span>Install Steam</span>
          </Link>

          {isSignedIn ? (
            <Link
              href="/profile"
              className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors"
            >
              sign in
            </Link>
          )}

          <button className="text-[11px] text-steam-textMuted hover:text-steam-text transition-colors cursor-pointer">
            Language ▾
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden ml-auto">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="p-1.5 text-steam-navDefault hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-steam-panel border-steam-borderSubtle w-64 p-0"
            >
              <div className="flex flex-col pt-2">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-steam-borderSubtle">
                  <img src="/steam-logo.jpg" alt="Steam" className="h-5 w-5 object-contain rounded-sm" />
                  <span className="text-white font-bold text-sm tracking-[0.15em]">STEAM</span>
                </div>
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="px-5 py-3 text-[13px] text-steam-navDefault hover:text-white hover:bg-steam-card transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-2 px-5 pb-4 border-t border-steam-borderSubtle pt-4 flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-steam-link text-sm"
                  >
                    sign in
                  </Link>
                  <Link
                    href="/about/download"
                    className="text-center py-2 text-sm font-semibold text-white rounded-sm"
                    style={{ background: 'linear-gradient(to bottom, #a4c639, #6e8f23)' }}
                  >
                    Install Steam
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
