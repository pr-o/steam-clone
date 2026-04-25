import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'jotai'
import { wishlistAtom, toggleWishlistAtom, isWishlistedAtom } from './wishlistStore'

let store: ReturnType<typeof createStore>

beforeEach(() => {
  store = createStore()
})

describe('wishlistStore', () => {
  it('seeds from MOCK_USER.wishlist by default', () => {
    // MOCK_USER.wishlist is [4, 5, 15]
    expect(store.get(wishlistAtom)).toEqual([4, 5, 15])
  })

  it('toggleWishlist adds a missing id', () => {
    const seed = store.get(wishlistAtom)
    store.set(toggleWishlistAtom, 99)
    expect(store.get(wishlistAtom)).toEqual([...seed, 99])
  })

  it('toggleWishlist removes an existing id', () => {
    store.set(toggleWishlistAtom, 4)
    expect(store.get(wishlistAtom)).not.toContain(4)
  })

  it('isWishlistedAtom reflects current membership', () => {
    expect(store.get(isWishlistedAtom(4))).toBe(true)
    expect(store.get(isWishlistedAtom(999))).toBe(false)
    store.set(toggleWishlistAtom, 999)
    expect(store.get(isWishlistedAtom(999))).toBe(true)
  })
})
