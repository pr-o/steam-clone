import { atom } from 'jotai'
import type { Game, User } from '@steam-clone/types'
import { MOCK_FRIENDS } from '../mocks/data/users'
import { MOCK_GAMES } from '../mocks/data/games'

export type ActivityKind = 'started_playing' | 'achievement' | 'wishlist_add' | 'purchased'

export interface ActivityEvent {
  id: string
  kind: ActivityKind
  user: Pick<User, 'steamId' | 'displayName' | 'avatar'>
  game: Pick<Game, 'id' | 'title' | 'slug' | 'headerImage'>
  /** ISO timestamp */
  at: string
  /** kind === 'achievement' */
  achievementName?: string
}

const friend = (i: number) => {
  const f = MOCK_FRIENDS[i]
  return { steamId: f.steamId, displayName: f.displayName, avatar: f.avatar }
}
const gameRef = (id: number) => {
  const g = MOCK_GAMES.find((x) => x.id === id)!
  return { id: g.id, title: g.title, slug: g.slug, headerImage: g.headerImage }
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

const SEED_ACTIVITY: ActivityEvent[] = [
  { id: 'a1', kind: 'started_playing', user: friend(0), game: gameRef(1), at: minutesAgo(4) },
  { id: 'a2', kind: 'achievement', user: friend(4), game: gameRef(7), at: minutesAgo(11), achievementName: 'Tarnished No More' },
  { id: 'a3', kind: 'started_playing', user: friend(1), game: gameRef(6), at: minutesAgo(22) },
  { id: 'a4', kind: 'wishlist_add', user: friend(2), game: gameRef(4), at: minutesAgo(58) },
  { id: 'a5', kind: 'achievement', user: friend(0), game: gameRef(1), at: minutesAgo(78), achievementName: 'Ace Defuser' },
  { id: 'a6', kind: 'purchased', user: friend(3), game: gameRef(11), at: minutesAgo(140) },
  { id: 'a7', kind: 'started_playing', user: friend(4), game: gameRef(7), at: minutesAgo(220) },
  { id: 'a8', kind: 'wishlist_add', user: friend(5), game: gameRef(15), at: minutesAgo(360) },
]

export const activityFeedAtom = atom<ActivityEvent[]>(SEED_ACTIVITY)
