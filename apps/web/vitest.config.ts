import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@steam-clone/types': resolve(__dirname, '../../packages/types/src'),
      '@steam-clone/ui': resolve(__dirname, '../../packages/ui/src'),
      '@steam-clone/api': resolve(__dirname, '../../packages/api/src'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
  },
})
