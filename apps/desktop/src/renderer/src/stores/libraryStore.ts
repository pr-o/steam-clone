import { atom } from 'jotai'
import type { Game } from '@steam-clone/types'

export type DownloadStatus = 'downloading' | 'paused' | 'queued'

export interface DownloadItem {
  game: Game
  progress: number  // 0–100
  speed: string     // e.g. "12.4 MB/s"
  status: DownloadStatus
}

export const installedGamesAtom = atom<Game[]>([])

export const downloadQueueAtom = atom<DownloadItem[]>([])

export const currentlyPlayingAtom = atom<Game | null>(null)
