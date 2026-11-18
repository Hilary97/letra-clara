import { browserStore, type KeyValueStore } from './preferences'

export const READ_KEY = 'letra-clara:leidos:v1'

export function getReadIds(store: KeyValueStore | null = browserStore()): string[] {
  if (!store) return []
  try {
    const saved = store.getItem(READ_KEY)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return Array.from(new Set(parsed.filter((item): item is string => typeof item === 'string')))
  } catch {
    return []
  }
}

export function markRead(
  id: string,
  store: KeyValueStore | null = browserStore(),
): string[] {
  const next = Array.from(new Set([...getReadIds(store), id]))
  try {
    store?.setItem(READ_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  return next
}

export function clearRead(store: KeyValueStore | null = browserStore()): string[] {
  try {
    store?.removeItem(READ_KEY)
  } catch {
    /* ignore */
  }
  return []
}
