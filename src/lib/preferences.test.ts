import { describe, expect, it } from 'vitest'
import {
  clampPreferences,
  defaultPreferences,
  loadPreferences,
  nextTheme,
  PREFS_KEY,
  resetPreferences,
  savePreferences,
  type KeyValueStore,
} from './preferences'

function fakeStore(initial: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}

describe('clampPreferences', () => {
  it('keeps user values that are already valid', () => {
    const preferences = clampPreferences({
      theme: 'oscuro',
      font: 'sistema',
      fontSize: 28,
      lineHeight: 2.1,
      letterSpacing: 0.1,
      ruler: true,
      bionic: true,
      focusMode: true,
      speechRate: 1.2,
      breakEvery: 5,
    })
    expect(preferences).toEqual({
      theme: 'oscuro',
      font: 'sistema',
      fontSize: 28,
      lineHeight: 2.1,
      letterSpacing: 0.1,
      ruler: true,
      bionic: true,
      focusMode: true,
      speechRate: 1.2,
      breakEvery: 5,
    })
  })

  it('clamps out-of-range numbers instead of rejecting them', () => {
    const preferences = clampPreferences({
      fontSize: 90,
      lineHeight: 0.2,
      letterSpacing: 5,
      speechRate: -1,
    })
    expect(preferences.fontSize).toBe(32)
    expect(preferences.lineHeight).toBe(1.5)
    expect(preferences.letterSpacing).toBe(0.14)
    expect(preferences.speechRate).toBe(0.6)
  })

  it('falls back to defaults for unknown values', () => {
    const preferences = clampPreferences({
      theme: 'neon',
      font: 'comic',
      ruler: 'sí',
      fontSize: Number.NaN,
      breakEvery: 7,
    })
    expect(preferences.theme).toBe(defaultPreferences.theme)
    expect(preferences.font).toBe(defaultPreferences.font)
    expect(preferences.ruler).toBe(defaultPreferences.ruler)
    expect(preferences.fontSize).toBe(defaultPreferences.fontSize)
    expect(preferences.breakEvery).toBe(defaultPreferences.breakEvery)
  })

  it('accepts garbage without throwing', () => {
    expect(clampPreferences(null)).toEqual(defaultPreferences)
    expect(clampPreferences('nada')).toEqual(defaultPreferences)
    expect(clampPreferences([])).toEqual(defaultPreferences)
  })

  it('rounds slider values to two decimals', () => {
    expect(clampPreferences({ lineHeight: 1.87654321 }).lineHeight).toBe(1.88)
  })
})

describe('load and save', () => {
  it('round-trips preferences through the store', () => {
    const store = fakeStore()
    const custom = { ...defaultPreferences, fontSize: 27, theme: 'suave' as const }
    savePreferences(custom, store)
    expect(store.data.has(PREFS_KEY)).toBe(true)
    expect(loadPreferences(store)).toEqual(custom)
  })

  it('returns defaults when nothing was saved or the JSON is broken', () => {
    expect(loadPreferences(fakeStore())).toEqual(defaultPreferences)
    expect(loadPreferences(fakeStore({ [PREFS_KEY]: '{no es json' }))).toEqual(defaultPreferences)
  })

  it('returns defaults when storage is unavailable', () => {
    expect(loadPreferences(null)).toEqual(defaultPreferences)
    expect(() => savePreferences(defaultPreferences, null)).not.toThrow()
  })

  it('reset removes the saved value', () => {
    const store = fakeStore({ [PREFS_KEY]: JSON.stringify(defaultPreferences) })
    expect(resetPreferences(store)).toEqual(defaultPreferences)
    expect(store.data.has(PREFS_KEY)).toBe(false)
  })
})

describe('nextTheme', () => {
  it('cycles through every theme and comes back', () => {
    expect(nextTheme('crema')).toBe('claro')
    expect(nextTheme('claro')).toBe('suave')
    expect(nextTheme('suave')).toBe('oscuro')
    expect(nextTheme('oscuro')).toBe('crema')
  })
})
