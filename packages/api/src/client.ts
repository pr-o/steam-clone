import type { Game, Review, User } from '@steam-clone/types'

export interface ApiConfig {
  baseUrl: string
  headers?: Record<string, string>
}

export interface ApiClient {
  games: {
    getFeatured: () => Promise<Game[]>
    getById: (id: number) => Promise<Game>
    search: (query: string) => Promise<Game[]>
    getByGenre: (genre: string) => Promise<Game[]>
  }
  reviews: {
    getByGame: (gameId: number) => Promise<Review[]>
    create: (review: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'funny'>) => Promise<Review>
  }
  users: {
    getMe: () => Promise<User>
    getById: (steamId: string) => Promise<User>
    addToCart: (gameId: number) => Promise<void>
    addToWishlist: (gameId: number) => Promise<void>
  }
}

export function createApiClient(config: ApiConfig): ApiClient {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
        ...options?.headers,
      },
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }

    return res.json() as Promise<T>
  }

  return {
    games: {
      getFeatured: () => request<Game[]>('/games/featured'),
      getById: (id) => request<Game>(`/games/${id}`),
      search: (query) => request<Game[]>(`/games/search?q=${encodeURIComponent(query)}`),
      getByGenre: (genre) => request<Game[]>(`/games?genre=${encodeURIComponent(genre)}`),
    },
    reviews: {
      getByGame: (gameId) => request<Review[]>(`/games/${gameId}/reviews`),
      create: (review) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(review) }),
    },
    users: {
      getMe: () => request<User>('/users/me'),
      getById: (steamId) => request<User>(`/users/${steamId}`),
      addToCart: (gameId) => request<void>('/users/me/cart', { method: 'POST', body: JSON.stringify({ gameId }) }),
      addToWishlist: (gameId) => request<void>('/users/me/wishlist', { method: 'POST', body: JSON.stringify({ gameId }) }),
    },
  }
}
