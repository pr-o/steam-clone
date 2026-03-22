import { http, HttpResponse } from 'msw'
import { MOCK_USER } from '../data/users'

export const userHandlers = [
  http.get('/api/users/me', () => {
    return HttpResponse.json(MOCK_USER)
  }),

  http.post('/api/users/me/wishlist', () => {
    return HttpResponse.json({ ok: true })
  }),
]
