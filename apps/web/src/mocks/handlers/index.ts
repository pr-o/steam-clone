import { gameHandlers } from './games'
import { userHandlers } from './users'
import { reviewHandlers } from './reviews'

export const handlers = [...gameHandlers, ...userHandlers, ...reviewHandlers]
