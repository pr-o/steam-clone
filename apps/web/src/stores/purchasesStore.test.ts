import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'jotai'
import type { Game } from '@steam-clone/types'
import { addToCartAtom, cartItemsAtom } from './cartStore'
import { wishlistAtom, toggleWishlistAtom } from './wishlistStore'
import {
  purchasesAtom,
  ownedGameIdsAtom,
  isOwnedAtom,
  checkoutAtom,
} from './purchasesStore'

function makeGame(id: number, final = 1000): Game {
  return {
    id,
    appId: 0,
    title: `Game ${id}`,
    slug: `game-${id}`,
    shortDescription: '',
    description: '',
    headerImage: '',
    screenshots: [],
    videos: [],
    developer: 'Dev',
    publisher: 'Pub',
    releaseDate: '2024-01-01',
    price: { currency: 'USD', initial: final, final, discountPercent: 0, isFree: false },
    categories: [],
    genres: [],
    tags: [],
    platforms: { windows: true, mac: false, linux: false },
    rating: { summary: 'Mixed', score: 50, totalReviews: 0 },
    isFeatured: false,
    isEarlyAccess: false,
  }
}

let store: ReturnType<typeof createStore>

beforeEach(() => {
  store = createStore()
})

describe('purchasesStore', () => {
  it('starts with no purchases', () => {
    expect(store.get(purchasesAtom)).toEqual([])
    expect(store.get(ownedGameIdsAtom).size).toBe(0)
  })

  it('checkoutAtom moves cart contents into purchases and clears the cart', () => {
    const a = makeGame(1, 1500)
    const b = makeGame(2, 2500)
    store.set(addToCartAtom, a)
    store.set(addToCartAtom, b)

    const purchased = store.set(checkoutAtom)

    expect(purchased.length).toBe(2)
    expect(store.get(cartItemsAtom)).toEqual([])
    const owned = store.get(ownedGameIdsAtom)
    expect(owned.has(1)).toBe(true)
    expect(owned.has(2)).toBe(true)
  })

  it('records totalPaid as the final price at checkout time', () => {
    store.set(addToCartAtom, makeGame(1, 1500))
    store.set(checkoutAtom)
    const [p] = store.get(purchasesAtom)
    expect(p.totalPaid).toBe(1500)
  })

  it('drops newly-owned ids from the wishlist', () => {
    store.set(toggleWishlistAtom, 7) // adds 7 to seed list
    store.set(addToCartAtom, makeGame(7, 999))
    expect(store.get(wishlistAtom)).toContain(7)
    store.set(checkoutAtom)
    expect(store.get(wishlistAtom)).not.toContain(7)
  })

  it('checkoutAtom is a no-op when cart is empty', () => {
    const purchased = store.set(checkoutAtom)
    expect(purchased).toEqual([])
    expect(store.get(purchasesAtom)).toEqual([])
  })

  it('does not duplicate purchases on a second checkout', () => {
    store.set(addToCartAtom, makeGame(1))
    store.set(checkoutAtom)
    store.set(addToCartAtom, makeGame(1))
    store.set(checkoutAtom)
    expect(store.get(purchasesAtom).length).toBe(1)
  })

  it('isOwnedAtom reflects ownership', () => {
    expect(store.get(isOwnedAtom(1))).toBe(false)
    store.set(addToCartAtom, makeGame(1))
    store.set(checkoutAtom)
    expect(store.get(isOwnedAtom(1))).toBe(true)
  })
})
