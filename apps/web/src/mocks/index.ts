export async function initMocks() {
  if (typeof window === 'undefined') return // SSR guard
const { worker } = await import('./browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}
