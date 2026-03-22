import { atom } from 'jotai'

export const wishlistAtom = atom<number[]>([]) // array of gameIds

export const toggleWishlistAtom = atom(null, (get, set, gameId: number) => {
  const list = get(wishlistAtom)
  set(
    wishlistAtom,
    list.includes(gameId) ? list.filter(id => id !== gameId) : [...list, gameId]
  )
})

export const isWishlistedAtom = (gameId: number) =>
  atom(get => get(wishlistAtom).includes(gameId))
