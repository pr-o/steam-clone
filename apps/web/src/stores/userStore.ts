import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { User } from '@steam-clone/types'

export const currentUserAtom = atomWithStorage<User | null>(
  'steam-clone:current-user',
  null
)

export const isSignedInAtom = atom((get) => get(currentUserAtom) !== null)

export const signOutAtom = atom(null, (_get, set) => {
  set(currentUserAtom, null)
})
