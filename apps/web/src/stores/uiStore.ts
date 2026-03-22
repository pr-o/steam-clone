import { atom } from 'jotai'

export const searchQueryAtom = atom('')

export const mobileNavOpenAtom = atom(false)

export const activeVideoAtom = atom<number | null>(null) // screenshot/video index on game page
