import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { CartItem, Game } from '@steam-clone/types'
import { cartItemsAtom } from './cartStore'
import { wishlistAtom } from './wishlistStore'

export interface PurchasedGame {
  gameId: number
  game: Game
  purchasedAt: string
  totalPaid: number
}

export const purchasesAtom = atomWithStorage<PurchasedGame[]>(
  'steam-clone:purchases',
  []
)

export const ownedGameIdsAtom = atom((get) =>
  new Set(get(purchasesAtom).map((p) => p.gameId))
)

export const isOwnedAtom = (gameId: number) =>
  atom((get) => get(ownedGameIdsAtom).has(gameId))

// Moves the entire cart into purchases, clears the cart, and removes those
// gameIds from the wishlist. Returns the just-purchased items so the caller
// can render them on the confirmation screen.
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

  // De-dupe against existing library
  const existing = get(purchasesAtom)
  const existingIds = new Set(existing.map((p) => p.gameId))
  const merged = [
    ...existing,
    ...purchased.filter((p) => !existingIds.has(p.gameId)),
  ]

  set(purchasesAtom, merged)
  set(cartItemsAtom, [])

  // Drop newly-owned games from wishlist
  const newOwnedIds = new Set(purchased.map((p) => p.gameId))
  set(
    wishlistAtom,
    get(wishlistAtom).filter((id) => !newOwnedIds.has(id))
  )

  return purchased
})
