import { useState } from 'react'
import type { Level, Story } from '../data/stories'
import type { Preferences } from '../lib/preferences'
import { AidsPanel } from './AidsPanel'

interface Props {
  stories: Story[]
  readIds: string[]
  preferences: Preferences
  onChange: (patch: Partial<Preferences>) => void
  onReset: () => void
  onOpen: (id: string) => void
}

const filters: { id: 'todos' | Level; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'inicial', label: 'Para empezar' },
  { id: 'intermedio', label: 'Un poco más' },
]

const aids = [
  ['🔎', 'Regla de lectura', 'Una franja sigue el renglón que estás leyendo.'],
  ['🔊', 'Escuchar el cuento', 'La voz del sistema lee en voz alta y la palabra se ilumina.'],
  ['🫧', 'Modo enfoque', 'Se esconde todo y queda solo el texto.'],
  ['⏳', 'Pausas cortas', 'Cada 5, 10 o 15 minutos te propone descansar.'],
]

export function Library({ stories, readIds, preferences, onChange, onReset, onOpen }: Props) {
  const [level, setLevel] = useState<'todos' | Level>('todos')
  const [panelOpen, setPanelOpen] = useState(false)

  const visible = level === 'todos' ? stories : stories.filter((story) => story.level === level)

  return (
    <div className="library">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            Aa
          </span>
          <span className="brand-name">Letra Clara</span>
        </div>
        <button
          type="button"
          className="btn btn-quiet"
          aria-expanded={panelOpen}
          aria-controls="ajustes-biblioteca"
          onClick={() => setPanelOpen((open) => !open)}
        >
          {panelOpen ? 'Cerrar ajustes' : 'Ajustes'}
        </button>
      </header>

      <main id="contenido">
        <section className="hero">
          <p className="eyebrow">Cuentos cortos · sin apuro · sin puntaje</p>
          <h1>
            Leer a tu ritmo, <em>sin ruido</em> y sin apuro.
          </h1>
          <p className="hero-text">
            Letra grande, más espacio entre palabras, lectura en voz alta y una regla que te
            acompaña. Pensado para chicos con TDAH y dislexia.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#cuentos">
              Elegir un cuento
            </a>
            <button
              type="button"
              className="btn btn-quiet"
              aria-expanded={panelOpen}
              aria-controls="ajustes-biblioteca"
              onClick={() => setPanelOpen((open) => !open)}
            >
              Preparar la lectura
            </button>
          </div>
          <ul className="hero-chips">
            <li>Sin límite de tiempo</li>
            <li>Sin rojo de error</li>
            <li>Voz en español</li>
          </ul>
        </section>

        {panelOpen ? (
          <div id="ajustes-biblioteca" className="library-panel">
            <AidsPanel
              preferences={preferences}
              onChange={onChange}
              onReset={onReset}
              heading="Prepará la lectura antes de empezar"
            />
          </div>
        ) : null}

        <section className="catalog" id="cuentos">
          <div className="catalog-head">
            <h2>Elegí un cuento</h2>
            <div className="filters" role="group" aria-label="Filtrar por nivel">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={level === filter.id ? 'filter is-on' : 'filter'}
                  aria-pressed={level === filter.id}
                  onClick={() => setLevel(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="cards">
            {visible.map((story) => {
              const isRead = readIds.includes(story.id)
              return (
                <li key={story.id}>
                  <article className="card">
                    <div className="card-top" style={{ background: story.tint }}>
                      <span className="card-emoji" aria-hidden="true">
                        {story.emoji}
                      </span>
                      {isRead ? <span className="card-read">Leído</span> : null}
                    </div>
                    <div className="card-body">
                      <p className="card-meta">
                        {story.level === 'inicial' ? 'Para empezar' : 'Un poco más'} ·{' '}
                        {story.minutes} min
                      </p>
                      <h3>{story.title}</h3>
                      <p className="card-summary">{story.summary}</p>
                      <div className="card-foot">
                        <span className="card-ages">{story.ages}</span>
                        <button
                          type="button"
                          className="btn btn-primary btn-small"
                          onClick={() => onOpen(story.id)}
                        >
                          Leer
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="how">
          <h2>¿Cómo te ayuda esta página?</h2>
          <ul className="how-grid">
            {aids.map(([emoji, title, text]) => (
              <li key={title} className="how-item">
                <span aria-hidden="true">{emoji}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="note">
          <h2>Una idea para acompañar</h2>
          <p>
            No hace falta terminar el cuento de una vez. Podés leer un párrafo, descansar y
            volver. Las preguntas del final no tienen nota: son para charlar sobre lo que
            leíste.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>Letra Clara · cuentos cortos para leer tranquilos.</p>
        <p className="footer-note">
          Las preferencias se guardan solo en este dispositivo. No hay cuentas ni datos
          personales.
        </p>
      </footer>
    </div>
  )
}
