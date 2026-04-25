import { useState, useMemo } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Check,
} from 'lucide-react'
import { selectedStoreGameAtom } from '@renderer/stores/uiStore'
import { addToCartAtom, cartItemsAtom } from '@renderer/stores/cartStore'
import { wishlistAtom, toggleWishlistAtom } from '@renderer/stores/wishlistStore'
import { isOwnedAtom } from '@renderer/stores/purchasesStore'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Button } from '@renderer/components/ui/button'
import { PriceDisplay, RatingBadge, PlatformIcons } from '@steam-clone/ui'
import { cn } from '@renderer/lib/utils'

export function StoreGameDetail() {
  const [game, setGame] = useAtom(selectedStoreGameAtom)
  const addToCart = useSetAtom(addToCartAtom)
  const cartItems = useAtomValue(cartItemsAtom)
  const wishlist = useAtomValue(wishlistAtom)
  const toggleWishlist = useSetAtom(toggleWishlistAtom)
  const isOwned = useAtomValue(
    useMemo(() => isOwnedAtom(game?.id ?? -1), [game?.id])
  )
  const [activeMedia, setActiveMedia] = useState(0)

  if (!game) return null

  const inCart = cartItems.some((c) => c.gameId === game.id)
  const wishlisted = wishlist.includes(game.id)
  const screenshots = game.screenshots
  const total = screenshots.length

  function close() {
    setGame(null)
    setActiveMedia(0)
  }

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 bg-steam-bg z-20 flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-black/40">
            <Button
              variant="ghost"
              onClick={close}
              className="flex items-center gap-1 text-steam-link hover:text-steam-linkHover text-[12px] transition-colors h-auto p-0"
            >
              <ChevronLeft size={14} />
              Back to Store
            </Button>
            <span className="text-steam-textDim text-[12px]">›</span>
            <span className="text-steam-text text-[12px] truncate">{game.title}</span>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 max-w-[820px]">
              {/* Hero / media */}
              <div className="relative aspect-video bg-black overflow-hidden rounded-sm group">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={activeMedia}
                    src={screenshots[activeMedia] ?? game.headerImage}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                {total > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setActiveMedia((i) => (i - 1 + total) % total)
                      }
                      aria-label="Previous"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0"
                    >
                      <ChevronLeft size={16} className="text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveMedia((i) => (i + 1) % total)}
                      aria-label="Next"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0"
                    >
                      <ChevronRight size={16} className="text-white" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {total > 1 && (
                <div className="flex gap-1 mt-1 overflow-x-auto bg-[#0e1825] p-1 rounded-sm">
                  {screenshots.map((src, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      onClick={() => setActiveMedia(i)}
                      className={cn(
                        'shrink-0 w-[88px] h-[50px] overflow-hidden rounded-sm border-2 transition-colors p-0',
                        activeMedia === i
                          ? 'border-steam-blue'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </Button>
                  ))}
                </div>
              )}

              {/* Title row */}
              <div className="flex items-start gap-4 mt-5">
                <img
                  src={game.headerImage}
                  alt={game.title}
                  className="w-[200px] h-[94px] object-cover rounded-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h1 className="text-steam-text text-[20px] font-semibold leading-tight">
                    {game.title}
                  </h1>
                  <p className="text-steam-textMuted text-[12px] mt-1">
                    {game.developer} · {game.releaseDate}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <PlatformIcons platforms={game.platforms} size={12} className="text-steam-textMuted" />
                    <RatingBadge summary={game.rating.summary} className="text-[11px]" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-steam-textMuted text-[13px] leading-relaxed mt-4">
                {game.shortDescription}
              </p>
              {game.description && (
                <p className="text-steam-textMuted text-[12px] leading-relaxed mt-2">
                  {game.description}
                </p>
              )}

              {/* Tags */}
              {game.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {game.tags.slice(0, 8).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 text-[11px] text-steam-textMuted bg-[#4a5c6a]/40 border border-[#4a5c6a] rounded-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Buy panel */}
              <div className="mt-6 bg-steam-card rounded-sm p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <PriceDisplay price={game.price} size="lg" />
                </div>
                {isOwned ? (
                  <span className="inline-flex items-center gap-1 text-steam-online text-[12px] font-semibold uppercase tracking-wider">
                    <Check size={13} />
                    In Library
                  </span>
                ) : inCart ? (
                  <span className="inline-flex items-center gap-1 text-steam-textMuted text-[12px]">
                    <Check size={13} className="text-steam-blue" />
                    In Cart
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => addToCart(game)}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-4 py-2 rounded-sm transition-colors"
                  >
                    <ShoppingCart size={13} />
                    Add to Cart
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => toggleWishlist(game.id)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={cn(
                    'inline-flex items-center justify-center w-9 h-9 rounded-sm border transition-colors p-0',
                    wishlisted
                      ? 'border-steam-blue text-steam-blue hover:bg-steam-blue/10'
                      : 'border-steam-borderSubtle text-steam-textMuted hover:text-steam-text hover:border-steam-text'
                  )}
                >
                  <Heart size={14} className={wishlisted ? 'fill-steam-blue' : ''} />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
