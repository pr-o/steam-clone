import { atom } from 'jotai'
import type { CartItem, Game } from '@steam-clone/types'

export const cartItemsAtom = atom<CartItem[]>([])

export const cartCountAtom = atom(get => get(cartItemsAtom).length)

export const cartTotalAtom = atom(get =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.game.price.final, 0)
)

export const addToCartAtom = atom(null, (get, set, game: Game) => {
  const items = get(cartItemsAtom)
  if (items.some(i => i.gameId === game.id)) return
  set(cartItemsAtom, [
    ...items,
    { gameId: game.id, game, addedAt: new Date().toISOString() },
  ])
})

export const removeFromCartAtom = atom(null, (get, set, gameId: number) => {
  set(cartItemsAtom, get(cartItemsAtom).filter(i => i.gameId !== gameId))
})

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, [])
})
