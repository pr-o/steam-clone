import { atom } from 'jotai'
import type { User } from '@steam-clone/types'

export const currentUserAtom = atom<User | null>(null)

export const isSignedInAtom = atom(get => get(currentUserAtom) !== null)
