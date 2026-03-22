'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { useAllGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

export function SteamDeckSection() {
  const { data: games, isLoading } = useAllGames()
  const viewportRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    viewportRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <section className="py-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-steam-text text-[13px]">⊙</span>
        <h2 className="text-steam-navActive text-[13px] font-normal uppercase tracking-[0.12em] flex-1">
          Top Played on Steam Deck
        </h2>
        <Link
          href="/steamdeck"
          className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors"
        >
          See More
        </Link>
      </div>

      <div className="relative group/deck">
        <Button
          variant="ghost"
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-start pl-1 bg-gradient-to-r from-steam-bg to-transparent opacity-0 group-hover/deck:opacity-100 transition-opacity h-auto rounded-none p-0"
          aria-label="Scroll left"
        >
          <ChevronLeft size={22} className="text-white drop-shadow" />
        </Button>

        <ScrollAreaPrimitive.Root className="relative overflow-hidden">
          <ScrollAreaPrimitive.Viewport ref={viewportRef} className="w-full">
            <div className="flex gap-1.5 pb-2">
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="w-[184px] h-[69px] shrink-0 rounded-sm bg-steam-card" />
                  ))
                : games?.slice(0, 10).map(game => (
                    <Link
                      key={game.id}
                      href={`/app/${game.id}/${game.slug}`}
                      className="shrink-0 w-[184px] group/card"
                    >
                      <div className="relative overflow-hidden rounded-sm">
                        <img
                          src={game.headerImage}
                          alt={game.title}
                          className="w-full h-[69px] object-cover group-hover/card:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {game.price.discountPercent > 0 && (
                          <span className="absolute bottom-1 right-1 bg-steam-discountBg text-steam-discountText text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
                            -{game.price.discountPercent}%
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
            </div>
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar orientation="horizontal" />
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>

        <Button
          variant="ghost"
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-end pr-1 bg-gradient-to-l from-steam-bg to-transparent opacity-0 group-hover/deck:opacity-100 transition-opacity h-auto rounded-none p-0"
          aria-label="Scroll right"
        >
          <ChevronRight size={22} className="text-white drop-shadow" />
        </Button>
      </div>
    </section>
  )
}
