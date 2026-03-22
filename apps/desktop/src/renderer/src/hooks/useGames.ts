import { useQuery } from '@tanstack/react-query'
import type { Game } from '@steam-clone/types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export function useFeaturedGames() {
  return useQuery<Game[]>({
    queryKey: ['games', 'featured'],
    queryFn: () => fetchJson('/api/games/featured'),
  })
}

export function useGame(id: number) {
  return useQuery<Game>({
    queryKey: ['games', id],
    queryFn: () => fetchJson(`/api/games/${id}`),
    enabled: !!id,
  })
}

export function useSearchGames(query: string) {
  return useQuery<Game[]>({
    queryKey: ['games', 'search', query],
    queryFn: () => fetchJson(`/api/games/search?q=${encodeURIComponent(query)}`),
    enabled: query.length > 1,
  })
}

export function useGamesByGenre(genre: string) {
  return useQuery<Game[]>({
    queryKey: ['games', 'genre', genre],
    queryFn: () => fetchJson(`/api/games?genre=${encodeURIComponent(genre)}`),
    enabled: !!genre,
  })
}

export function useAllGames() {
  return useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: () => fetchJson('/api/games'),
  })
}
