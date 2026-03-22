import { useQuery } from '@tanstack/react-query'
import type { User } from '@steam-clone/types'

export function useMe() {
  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await fetch('/api/users/me')
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      return res.json()
    },
  })
}
