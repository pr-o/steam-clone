import { http, HttpResponse } from 'msw'
import { MOCK_REVIEWS } from '../data/reviews'

export const reviewHandlers = [
  http.get('/api/games/:gameId/reviews', ({ params }) => {
    const reviews = MOCK_REVIEWS[Number(params.gameId)] ?? []
    return HttpResponse.json(reviews)
  }),
]
