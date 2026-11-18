import { useCallback, useEffect, useRef, useState } from 'react'

export interface SpeechState {
  speaking: boolean
  paragraph: number | null
  charIndex: number
}

const IDLE: SpeechState = { speaking: false, paragraph: null, charIndex: 0 }

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickSpanishVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  const spanish = voices.filter((voice) => voice.lang.toLowerCase().startsWith('es'))
  if (spanish.length === 0) return null
  const preferred = ['es-ar', 'es-419', 'es-es', 'es-mx', 'es-us']
  for (const lang of preferred) {
    const match = spanish.find((voice) =>
      voice.lang.toLowerCase().replace('_', '-').startsWith(lang),
    )
    if (match) return match
  }
  return spanish[0]
}

/**
 * Reads the paragraphs in order with the system voice. "Pause" cancels the
 * current utterance and remembers the paragraph so the next press resumes
 * there instead of restarting the whole story.
 */
export function useSpeech(paragraphs: string[], rate: number) {
  const supported = speechSupported()
  const [state, setState] = useState<SpeechState>(IDLE)
  const stopped = useRef(true)
  const cursor = useRef(0)
  const rateRef = useRef(rate)

  useEffect(() => {
    rateRef.current = rate
  }, [rate])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    stopped.current = true
    setState(IDLE)
  }, [supported])

  const speakFrom = useCallback(
    (from: number) => {
      if (!supported) return
      window.speechSynthesis.cancel()
      stopped.current = false
      const start = Math.min(Math.max(from, 0), paragraphs.length - 1)

      const step = (index: number) => {
        if (stopped.current) return
        if (index >= paragraphs.length) {
          stopped.current = true
          setState(IDLE)
          return
        }

        const utterance = new SpeechSynthesisUtterance(paragraphs[index])
        utterance.lang = 'es-AR'
        utterance.rate = rateRef.current
        utterance.pitch = 1
        const voice = pickSpanishVoice()
        if (voice) utterance.voice = voice

        utterance.onboundary = (event) => {
          if (stopped.current) return
          setState({ speaking: true, paragraph: index, charIndex: event.charIndex })
        }
        utterance.onend = () => {
          if (!stopped.current) step(index + 1)
        }
        utterance.onerror = () => {
          if (stopped.current) return
          stopped.current = true
          setState(IDLE)
        }

        cursor.current = index
        setState({ speaking: true, paragraph: index, charIndex: 0 })
        window.speechSynthesis.speak(utterance)
      }

      step(start)
    },
    [paragraphs, supported],
  )

  const toggle = useCallback(() => {
    if (state.speaking) pause()
    else speakFrom(cursor.current)
  }, [state.speaking, pause, speakFrom])

  const restart = useCallback(() => {
    cursor.current = 0
    speakFrom(0)
  }, [speakFrom])

  useEffect(() => pause, [pause])

  return { supported, ...state, speakFrom, toggle, pause, restart }
}
