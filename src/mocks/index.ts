// src/mocks/index.ts
export async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./browser.ts')
    return worker.start()
  }
}