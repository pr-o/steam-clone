import { useQuery } from '@tanstack/react-query'
import type { Review } from '@steam-clone/types'

export function useGameReviews(gameId: number) {
  return useQuery<Review[]>({
    queryKey: ['reviews', gameId],
    queryFn: async () => {
      const res = await fetch(`/api/games/${gameId}/reviews`)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      return res.json()
    },
    enabled: !!gameId,
  })
}
