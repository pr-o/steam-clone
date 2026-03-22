import { atom } from 'jotai'
import type { User } from '@steam-clone/types'
import { MOCK_USER, MOCK_FRIENDS } from '../mocks/data/users'

// Desktop auto signs in with mock user
export const currentUserAtom = atom<User | null>(MOCK_USER)

export const friendsAtom = atom<User[]>(MOCK_FRIENDS)

export const isSignedInAtom = atom(get => get(currentUserAtom) !== null)
