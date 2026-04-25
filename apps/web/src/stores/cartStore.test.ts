import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'jotai'
import type { Game } from '@steam-clone/types'
import {
  cartItemsAtom,
  cartCountAtom,
  cartTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  clearCartAtom,
} from './cartStore'

function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    id: 1,
    appId: 0,
    title: 'Test Game',
    slug: 'test-game',
    shortDescription: '',
    description: '',
    headerImage: '',
    screenshots: [],
    videos: [],
    developer: 'Dev',
    publisher: 'Pub',
    releaseDate: '2024-01-01',
    price: { currency: 'USD', initial: 1000, final: 1000, discountPercent: 0, isFree: false },
    categories: [],
    genres: [],
    tags: [],
    platforms: { windows: true, mac: false, linux: false },
    rating: { summary: 'Mixed', score: 50, totalReviews: 0 },
    isFeatured: false,
    isEarlyAccess: false,
    ...overrides,
  }
}

let store: ReturnType<typeof createStore>

beforeEach(() => {
  store = createStore()
})

describe('cartStore', () => {
  it('starts empty', () => {
    expect(store.get(cartItemsAtom)).toEqual([])
    expect(store.get(cartCountAtom)).toBe(0)
    expect(store.get(cartTotalAtom)).toBe(0)
  })

  it('adds a game to the cart', () => {
    const game = makeGame()
    store.set(addToCartAtom, game)
    expect(store.get(cartCountAtom)).toBe(1)
    expect(store.get(cartItemsAtom)[0].gameId).toBe(game.id)
  })

  it('does not duplicate when adding the same game twice', () => {
    const game = makeGame()
    store.set(addToCartAtom, game)
    store.set(addToCartAtom, game)
    expect(store.get(cartCountAtom)).toBe(1)
  })

  it('sums the cart total from final prices', () => {
    store.set(addToCartAtom, makeGame({ id: 1, price: { ...makeGame().price, final: 1500 } }))
    store.set(addToCartAtom, makeGame({ id: 2, price: { ...makeGame().price, final: 2500 } }))
    expect(store.get(cartTotalAtom)).toBe(4000)
  })

  it('removes a game by id', () => {
    store.set(addToCartAtom, makeGame({ id: 1 }))
    store.set(addToCartAtom, makeGame({ id: 2 }))
    store.set(removeFromCartAtom, 1)
    expect(store.get(cartCountAtom)).toBe(1)
    expect(store.get(cartItemsAtom)[0].gameId).toBe(2)
  })

  it('clears the cart', () => {
    store.set(addToCartAtom, makeGame({ id: 1 }))
    store.set(addToCartAtom, makeGame({ id: 2 }))
    store.set(clearCartAtom)
    expect(store.get(cartItemsAtom)).toEqual([])
  })
})
