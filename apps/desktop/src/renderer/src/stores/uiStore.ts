import { atom } from 'jotai'
import type { Game } from '@steam-clone/types'

export type AppTab = 'store' | 'library' | 'community' | 'downloads' | 'profile' | 'settings'

export const activeTabAtom = atom<AppTab>('store')

export const activeSidebarGameAtom = atom<Game | null>(null) // selected game in Library sidebar

export const titleBarTitleAtom = atom<string>('Steam')

export const searchQueryAtom = atom('')

export const activeVideoAtom = atom<number | null>(null) // screenshot/video index on game page
