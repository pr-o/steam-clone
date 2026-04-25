import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { User } from '@steam-clone/types'
import { MOCK_USER, MOCK_FRIENDS } from '../mocks/data/users'

// Desktop auto signs in with the mock user on first launch; clearing this
// (sign-out) persists so the next launch shows the sign-in screen.
export const currentUserAtom = atomWithStorage<User | null>(
  'steam-clone:current-user',
  MOCK_USER
)

export const friendsAtom = atom<User[]>(MOCK_FRIENDS)

export const isSignedInAtom = atom((get) => get(currentUserAtom) !== null)

export const signOutAtom = atom(null, (_get, set) => {
  set(currentUserAtom, null)
})

export const signInAtom = atom(null, (_get, set, user: User = MOCK_USER) => {
  set(currentUserAtom, user)
})
