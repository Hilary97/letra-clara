export type Theme = 'crema' | 'claro' | 'suave' | 'oscuro'
export type FontChoice = 'clara' | 'sistema'

export interface Preferences {
  theme: Theme
  font: FontChoice
  fontSize: number
  lineHeight: number
  letterSpacing: number
  ruler: boolean
  bionic: boolean
  focusMode: boolean
  speechRate: number
  breakEvery: number
}

export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const PREFS_KEY = 'letra-clara:prefs:v1'

export const FONT_SIZE = { min: 18, max: 32 } as const
export const LINE_HEIGHT = { min: 1.5, max: 2.4 } as const
export const LETTER_SPACING = { min: 0, max: 0.14 } as const
export const SPEECH_RATE = { min: 0.6, max: 1.4 } as const
export const THEMES: Theme[] = ['crema', 'claro', 'suave', 'oscuro']
export const BREAK_OPTIONS = [0, 5, 10, 15] as const

export const defaultPreferences: Preferences = {
  theme: 'crema',
  font: 'clara',
  fontSize: 23,
  lineHeight: 1.9,
  letterSpacing: 0.04,
  ruler: false,
  bionic: false,
  focusMode: false,
  speechRate: 0.95,
  breakEvery: 10,
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return round(Math.min(max, Math.max(min, parsed)))
}

function pickBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function pickEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

/** Accepts anything (saved state, hand edits, old versions) and returns valid preferences. */
export function clampPreferences(input: unknown): Preferences {
  const raw: Record<string, unknown> =
    typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {}
  const base = defaultPreferences

  return {
    theme: pickEnum(raw.theme, THEMES, base.theme),
    font: pickEnum(raw.font, ['clara', 'sistema'] as const, base.font),
    fontSize: clampNumber(raw.fontSize, FONT_SIZE.min, FONT_SIZE.max, base.fontSize),
    lineHeight: clampNumber(raw.lineHeight, LINE_HEIGHT.min, LINE_HEIGHT.max, base.lineHeight),
    letterSpacing: clampNumber(
      raw.letterSpacing,
      LETTER_SPACING.min,
      LETTER_SPACING.max,
      base.letterSpacing,
    ),
    ruler: pickBoolean(raw.ruler, base.ruler),
    bionic: pickBoolean(raw.bionic, base.bionic),
    focusMode: pickBoolean(raw.focusMode, base.focusMode),
    speechRate: clampNumber(raw.speechRate, SPEECH_RATE.min, SPEECH_RATE.max, base.speechRate),
    breakEvery: BREAK_OPTIONS.includes(raw.breakEvery as (typeof BREAK_OPTIONS)[number])
      ? (raw.breakEvery as number)
      : base.breakEvery,
  }
}

export function browserStore(): KeyValueStore | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

export function loadPreferences(store: KeyValueStore | null = browserStore()): Preferences {
  if (!store) return { ...defaultPreferences }
  try {
    const saved = store.getItem(PREFS_KEY)
    if (!saved) return { ...defaultPreferences }
    return clampPreferences(JSON.parse(saved))
  } catch {
    return { ...defaultPreferences }
  }
}

export function savePreferences(
  preferences: Preferences,
  store: KeyValueStore | null = browserStore(),
): void {
  try {
    store?.setItem(PREFS_KEY, JSON.stringify(preferences))
  } catch {
    /* storage full or blocked: preferences stay in memory for this session */
  }
}

export function resetPreferences(
  store: KeyValueStore | null = browserStore(),
): Preferences {
  try {
    store?.removeItem(PREFS_KEY)
  } catch {
    /* ignore */
  }
  return { ...defaultPreferences }
}

export function nextTheme(theme: Theme): Theme {
  const index = THEMES.indexOf(theme)
  return THEMES[(index + 1) % THEMES.length]
}
