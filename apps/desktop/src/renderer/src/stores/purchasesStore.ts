import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { CartItem, PurchasedGame } from '@steam-clone/types'
import { cartItemsAtom } from './cartStore'
import { wishlistAtom } from './wishlistStore'

export const purchasesAtom = atomWithStorage<PurchasedGame[]>(
  'steam-clone:purchases',
  []
)

export const ownedGameIdsAtom = atom((get) =>
  new Set(get(purchasesAtom).map((p) => p.gameId))
)

export const isOwnedAtom = (gameId: number) =>
  atom((get) => get(ownedGameIdsAtom).has(gameId))

// Move all current cart contents into purchases, clear cart, drop owned IDs
// from the wishlist. Returns the just-purchased items so a future desktop
// checkout dialog can render them on a confirmation step.
export const checkoutAtom = atom(null, (get, set): PurchasedGame[] => {
  const items = get(cartItemsAtom)
  if (items.length === 0) return []

  const now = new Date().toISOString()
  const purchased: PurchasedGame[] = items.map((item: CartItem) => ({
    gameId: item.gameId,
    game: item.game,
    purchasedAt: now,
    totalPaid: item.game.price.final,
  }))

  const existing = get(purchasesAtom)
  const existingIds = new Set(existing.map((p) => p.gameId))
  const merged = [
    ...existing,
    ...purchased.filter((p) => !existingIds.has(p.gameId)),
  ]

  set(purchasesAtom, merged)
  set(cartItemsAtom, [])

  const newOwnedIds = new Set(purchased.map((p) => p.gameId))
  set(
    wishlistAtom,
    get(wishlistAtom).filter((id) => !newOwnedIds.has(id))
  )

  return purchased
})
