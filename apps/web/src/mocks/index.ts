export async function initMocks() {
  if (typeof window === 'undefined') return // SSR guard
  if (process.env.NODE_ENV !== 'development') return

  const { worker } = await import('./browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}
