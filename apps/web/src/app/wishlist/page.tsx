'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useAtomValue, useSetAtom } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, ShoppingCart, X } from 'lucide-react'
import { wishlistAtom, toggleWishlistAtom } from '@/stores/wishlistStore'
import { cartItemsAtom, addToCartAtom } from '@/stores/cartStore'
import { ownedGameIdsAtom } from '@/stores/purchasesStore'
import { useAllGames } from '@/hooks/useGames'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { RatingBadge } from '@/components/shared/RatingBadge'
import { PlatformIcons } from '@/components/shared/PlatformIcons'
import type { Game } from '@steam-clone/types'

function WishlistRow({
  game,
  inCart,
  owned,
}: {
  game: Game
  inCart: boolean
  owned: boolean
}) {
  const removeFromWishlist = useSetAtom(toggleWishlistAtom)
  const addToCart = useSetAtom(addToCartAtom)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-stretch bg-steam-card hover:bg-steam-cardHover rounded-sm overflow-hidden transition-colors"
    >
      <Link href={`/app/${game.id}/${game.slug}`} className="shrink-0">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-[268px] h-[125px] object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col">
        <Link
          href={`/app/${game.id}/${game.slug}`}
          className="text-steam-text text-[15px] font-semibold hover:text-steam-link transition-colors leading-tight line-clamp-1"
        >
          {game.title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <PlatformIcons platforms={game.platforms} size={11} className="text-steam-textMuted" />
          <RatingBadge summary={game.rating.summary} className="text-[11px]" />
        </div>
        <p className="text-steam-textMuted text-[11px] mt-1">{game.developer}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceDisplay price={game.price} size="sm" />
          <div className="flex items-center gap-2">
            {owned ? (
              <span className="text-steam-online text-[11px] font-semibold uppercase tracking-wider">
                In Library
              </span>
            ) : inCart ? (
              <Link
                href="/cart"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-steam-text bg-steam-card border border-steam-borderSubtle hover:border-steam-text px-3 py-1.5 rounded-sm transition-colors"
              >
                In Cart →
              </Link>
            ) : (
              <Button
                variant="ghost"
                onClick={() => addToCart(game)}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-3 py-1.5 rounded-sm transition-colors"
              >
                <ShoppingCart size={12} />
                Add to Cart
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => removeFromWishlist(game.id)}
              aria-label="Remove from wishlist"
              className="inline-flex items-center justify-center h-7 w-7 rounded-sm text-steam-textMuted hover:text-steam-text hover:bg-white/5 transition-colors p-0"
            >
              <X size={13} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function WishlistPage() {
  const isSignedIn = useRequireAuth()
  const ids = useAtomValue(wishlistAtom)
  const cartItems = useAtomValue(cartItemsAtom)
  const owned = useAtomValue(ownedGameIdsAtom)
  const { data: allGames, isLoading } = useAllGames()

  const games = useMemo(() => {
    if (!allGames) return []
    const order = new Map(ids.map((id, i) => [id, i]))
    return allGames
      .filter((g) => order.has(g.id))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
  }, [allGames, ids])

  const cartIds = useMemo(() => new Set(cartItems.map((c) => c.gameId)), [cartItems])

  if (!isSignedIn) return null

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-steam-text text-[22px] font-semibold flex items-center gap-2">
          <Heart size={18} className="text-steam-accentPale" fill="currentColor" />
          Your Wishlist
        </h1>
        <p className="text-steam-textMuted text-[12px]">
          {ids.length} {ids.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[125px] bg-steam-card rounded-sm" />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="bg-steam-card rounded-sm p-8 text-center">
          <p className="text-steam-text text-[14px] mb-1">Your wishlist is empty.</p>
          <p className="text-steam-textMuted text-[12px] mb-4">
            Tap the heart on any game page to keep an eye on it.
          </p>
          <Link
            href="/"
            className="inline-block text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 rounded-sm transition-colors"
          >
            Browse the Store
          </Link>
        </div>
      ) : (
        <motion.div layout className="space-y-2">
          <AnimatePresence initial={false}>
            {games.map((game) => (
              <WishlistRow
                key={game.id}
                game={game}
                inCart={cartIds.has(game.id)}
                owned={owned.has(game.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
