import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Story } from '../data/stories'
import { FONT_SIZE, nextTheme, type Preferences } from '../lib/preferences'
import { useSpeech } from '../hooks/useSpeech'
import { AidsPanel } from './AidsPanel'
import { PauseOverlay } from './PauseOverlay'
import { Questions } from './Questions'
import { StoryText } from './StoryText'

interface Props {
  story: Story
  preferences: Preferences
  onChange: (patch: Partial<Preferences>) => void
  onReset: () => void
  onBack: () => void
  onFinish: (id: string) => void
}

function clock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function Reader({ story, preferences, onChange, onReset, onBack, onFinish }: Props) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [resting, setResting] = useState(false)
  const [restDismissed, setRestDismissed] = useState(false)

  const articleRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const rulerRef = useRef<HTMLDivElement | null>(null)
  const finishedRef = useRef(false)

  const speech = useSpeech(story.paragraphs, preferences.speechRate)

  const breakSeconds = preferences.breakEvery * 60
  const restDue = breakSeconds > 0 && seconds >= breakSeconds && !resting && !restDismissed

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [story.id])

  useEffect(() => {
    const update = () => {
      const element = articleRef.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = Math.max(rect.height - viewport * 0.4, 1)
      const read = Math.min(Math.max(-rect.top + viewport * 0.2, 0), total)
      setProgress(Math.round((read / total) * 100))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [story.id, preferences.fontSize, preferences.lineHeight, preferences.letterSpacing])

  useEffect(() => {
    if (progress < 90 || finishedRef.current) return
    finishedRef.current = true
    onFinish(story.id)
  }, [progress, onFinish, story.id])

  useEffect(() => {
    if (!timerRunning || resting) return
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [timerRunning, resting])

  useEffect(() => {
    if (!preferences.ruler) return
    const move = (event: PointerEvent) => {
      rulerRef.current?.style.setProperty('--y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [preferences.ruler])

  useEffect(() => {
    if (!preferences.focusMode) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onChange({ focusMode: false })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preferences.focusMode, onChange])

  const textStyle: CSSProperties = {
    fontFamily: preferences.font === 'clara' ? 'var(--font-read)' : 'var(--font-wide)',
    fontSize: `${preferences.fontSize}px`,
    lineHeight: preferences.lineHeight,
    letterSpacing: `${preferences.letterSpacing}em`,
  }

  const rulerHeight = Math.round(preferences.fontSize * preferences.lineHeight) + 10

  const stepFont = (delta: number) => {
    const value = Math.min(FONT_SIZE.max, Math.max(FONT_SIZE.min, preferences.fontSize + delta))
    onChange({ fontSize: value })
  }

  const leave = () => {
    speech.pause()
    onBack()
  }

  return (
    <div className={`reader${preferences.focusMode ? ' is-focus' : ''}`}>
      <header className="reader-bar">
        <button type="button" className="btn btn-quiet btn-small reader-back" onClick={leave} aria-label="Volver a la biblioteca">
          <span aria-hidden="true">←</span> <span className="hide-sm">Biblioteca</span>
        </button>
        <p className="reader-title">
          <span aria-hidden="true">{story.emoji}</span>{' '}
          <span className="reader-title-text">{story.title}</span>
        </p>
        <div className="reader-bar-actions">
          <span className="chip" aria-live="off" title="Tiempo de esta lectura">
            ⏱ {clock(seconds)}
          </span>
          <button
            type="button"
            className="btn btn-quiet btn-small hide-sm"
            aria-pressed={!timerRunning}
            onClick={() => setTimerRunning((running) => !running)}
          >
            {timerRunning ? 'Pausar reloj' : 'Seguir reloj'}
          </button>
          <button
            type="button"
            className={preferences.focusMode ? 'btn btn-primary btn-small' : 'btn btn-quiet btn-small'}
            aria-pressed={preferences.focusMode}
            onClick={() => onChange({ focusMode: !preferences.focusMode })}
          >
            {preferences.focusMode ? 'Salir de enfoque' : 'Enfoque'}
          </button>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Progreso de lectura"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="reader-toolbar">
        {speech.supported ? (
          <>
            <button
              type="button"
              className={speech.speaking ? 'btn btn-primary btn-small' : 'btn btn-small'}
              aria-pressed={speech.speaking}
              onClick={speech.toggle}
            >
              {speech.speaking ? '⏸ Pausar la voz' : '🔊 Escuchar'}
            </button>
            <button type="button" className="btn btn-quiet btn-small" onClick={speech.restart}>
              ⟲ Reiniciar
            </button>
          </>
        ) : (
          <span className="toolbar-note">Este navegador no puede leer en voz alta.</span>
        )}

        <span className="toolbar-sep" aria-hidden="true" />

        <div className="font-step" role="group" aria-label="Tamaño de letra">
          <button
            type="button"
            className="btn btn-quiet btn-small"
            onClick={() => stepFont(-1)}
            disabled={preferences.fontSize <= FONT_SIZE.min}
            aria-label="Letra más chica"
          >
            A−
          </button>
          <span className="font-step-value" aria-hidden="true">
            {preferences.fontSize}
          </span>
          <button
            type="button"
            className="btn btn-quiet btn-small"
            onClick={() => stepFont(1)}
            disabled={preferences.fontSize >= FONT_SIZE.max}
            aria-label="Letra más grande"
          >
            A+
          </button>
        </div>

        <button
          type="button"
          className={preferences.ruler ? 'btn btn-primary btn-small' : 'btn btn-quiet btn-small'}
          aria-pressed={preferences.ruler}
          onClick={() => onChange({ ruler: !preferences.ruler })}
        >
          Regla
        </button>
        <button
          type="button"
          className={preferences.bionic ? 'btn btn-primary btn-small' : 'btn btn-quiet btn-small'}
          aria-pressed={preferences.bionic}
          onClick={() => onChange({ bionic: !preferences.bionic })}
        >
          Negrita
        </button>
        <button
          type="button"
          className="btn btn-quiet btn-small"
          onClick={() => onChange({ theme: nextTheme(preferences.theme) })}
        >
          Color
        </button>
        <button
          type="button"
          className={panelOpen ? 'btn btn-primary btn-small' : 'btn btn-quiet btn-small'}
          aria-expanded={panelOpen}
          aria-controls="ajustes-lector"
          onClick={() => setPanelOpen((open) => !open)}
        >
          Ajustes
        </button>
      </div>

      {panelOpen ? (
        <div className="reader-panel" id="ajustes-lector">
          <AidsPanel
            preferences={preferences}
            onChange={onChange}
            onReset={onReset}
            heading="Ajustes de lectura"
          />
        </div>
      ) : null}

      <main className="reading" id="contenido">
        <a className="skip-link" href="#cuento-titulo">
          Ir al cuento
        </a>
        <article className="story-paper" ref={articleRef}>
          <header className="story-head">
            <p className="eyebrow">
              {story.level === 'inicial' ? 'Para empezar' : 'Un poco más'} · {story.minutes} min
              · {story.ages}
            </p>
            <h1 id="cuento-titulo" ref={headingRef} tabIndex={-1}>
              {story.title}
            </h1>
            <p className="story-summary">{story.summary}</p>
          </header>

          <div className="story-body" style={textStyle}>
            {story.paragraphs.map((paragraph, index) => (
              <StoryText
                key={`${story.id}-${index}`}
                text={paragraph}
                bionic={preferences.bionic}
                active={speech.paragraph === index}
                charIndex={speech.charIndex}
              />
            ))}
          </div>

          <p className="story-hint">
            Llegaste al final. Podés volver a leer cualquier parte: el texto queda acá.
          </p>
        </article>

        <Questions questions={story.questions} />

        <div className="story-actions">
          <button type="button" className="btn btn-primary" onClick={leave}>
            Volver a la biblioteca
          </button>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Subir al principio
          </button>
        </div>
      </main>

      {preferences.ruler ? (
        <div
          className="ruler"
          ref={rulerRef}
          style={{ height: `${rulerHeight}px` }}
          aria-hidden="true"
        />
      ) : null}

      {restDue ? (
        <div className="rest-banner" role="status">
          <p>
            <strong>{preferences.breakEvery} minutos</strong> de lectura. ¿Hacemos una pausa
            corta para descansar los ojos?
          </p>
          <div className="rest-actions">
            <button type="button" className="btn btn-primary btn-small" onClick={() => setResting(true)}>
              Sí, pausa
            </button>
            <button
              type="button"
              className="btn btn-quiet btn-small"
              onClick={() => {
                setSeconds(0)
                setRestDismissed(true)
              }}
            >
              Sigo leyendo
            </button>
          </div>
        </div>
      ) : null}

      {resting ? (
        <PauseOverlay
          minutes={Math.max(1, Math.round(preferences.breakEvery / 2))}
          onDone={() => {
            setResting(false)
            setRestDismissed(false)
            setSeconds(0)
            setTimerRunning(true)
          }}
          onExit={leave}
        />
      ) : null}
    </div>
  )
}
