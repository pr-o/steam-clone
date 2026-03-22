import { http, HttpResponse } from 'msw'
import { MOCK_GAMES } from '../data/games'

export const gameHandlers = [
  http.get('/api/games/featured', () => {
    return HttpResponse.json(MOCK_GAMES.filter(g => g.isFeatured))
  }),

  http.get('/api/games/search', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() ?? ''
    const results = MOCK_GAMES.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.tags.some(t => t.name.toLowerCase().includes(q))
    )
    return HttpResponse.json(results)
  }),

  http.get('/api/games', ({ request }) => {
    const url = new URL(request.url)
    const genre = url.searchParams.get('genre')?.toLowerCase()
    const games = genre
      ? MOCK_GAMES.filter(g => g.genres.some(gn => gn.description.toLowerCase() === genre))
      : MOCK_GAMES
    return HttpResponse.json(games)
  }),

  http.get('/api/games/:id', ({ params }) => {
    const game = MOCK_GAMES.find(g => g.id === Number(params.id))
    if (!game) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(game)
  }),
]
