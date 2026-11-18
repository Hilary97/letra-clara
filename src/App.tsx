import { useCallback, useEffect, useState } from 'react'
import { Library } from './components/Library'
import { Reader } from './components/Reader'
import { stories } from './data/stories'
import {
  clampPreferences,
  loadPreferences,
  savePreferences,
  resetPreferences,
  type Preferences,
} from './lib/preferences'
import { getReadIds, markRead } from './lib/read-state'

export default function App() {
  const [preferences, setPreferences] = useState<Preferences>(() => loadPreferences())
  const [readIds, setReadIds] = useState<string[]>(() => getReadIds())
  const [readingId, setReadingId] = useState<string | null>(null)

  useEffect(() => {
    savePreferences(preferences)
  }, [preferences])

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme
  }, [preferences.theme])

  const changePreferences = useCallback((patch: Partial<Preferences>) => {
    setPreferences((current) => clampPreferences({ ...current, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setPreferences(resetPreferences())
  }, [])

  const open = useCallback((id: string) => {
    setReadingId(id)
    window.scrollTo(0, 0)
  }, [])

  const back = useCallback(() => {
    setReadingId(null)
    window.scrollTo(0, 0)
  }, [])

  const finish = useCallback((id: string) => {
    setReadIds(markRead(id))
  }, [])

  const story = readingId ? stories.find((item) => item.id === readingId) : undefined

  if (story) {
    return (
      <Reader
        story={story}
        preferences={preferences}
        onChange={changePreferences}
        onReset={reset}
        onBack={back}
        onFinish={finish}
      />
    )
  }

  return (
    <Library
      stories={stories}
      readIds={readIds}
      preferences={preferences}
      onChange={changePreferences}
      onReset={reset}
      onOpen={open}
    />
  )
}
