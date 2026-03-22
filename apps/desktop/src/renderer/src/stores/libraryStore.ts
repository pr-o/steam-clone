import { atom } from 'jotai'
import type { Game } from '@steam-clone/types'
import { MOCK_GAMES } from '../mocks/data/games'

export type DownloadStatus = 'downloading' | 'paused' | 'queued'

export interface DownloadItem {
  game: Game
  progress: number  // 0–100
  speed: string     // e.g. "12.4 MB/s"
  status: DownloadStatus
  eta: string       // e.g. "14 min"
  sizeGb: number
}

// Seed installed games from the mock user's library (gameIds 1, 6, 7, 8, 11)
const LIBRARY_IDS = [1, 7, 6, 8, 11]
const INSTALLED_GAMES = MOCK_GAMES.filter(g => LIBRARY_IDS.includes(g.id))

export const installedGamesAtom = atom<Game[]>(INSTALLED_GAMES)

export const downloadQueueAtom = atom<DownloadItem[]>([
  {
    game: MOCK_GAMES.find(g => g.id === 4)!,
    progress: 63,
    speed: '18.4 MB/s',
    status: 'downloading',
    eta: '14 min',
    sizeGb: 70,
  },
  {
    game: MOCK_GAMES.find(g => g.id === 5)!,
    progress: 0,
    speed: '—',
    status: 'queued',
    eta: '—',
    sizeGb: 15,
  },
  {
    game: MOCK_GAMES.find(g => g.id === 2)!,
    progress: 41,
    speed: '0 MB/s',
    status: 'paused',
    eta: '—',
    sizeGb: 90,
  },
])

export const currentlyPlayingAtom = atom<Game | null>(null)
