import { beforeEach } from 'vitest'

// Reset localStorage before every test so atomWithStorage starts clean.
beforeEach(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear()
  }
})
