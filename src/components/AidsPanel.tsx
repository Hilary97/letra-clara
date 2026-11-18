import {
  BREAK_OPTIONS,
  FONT_SIZE,
  LETTER_SPACING,
  LINE_HEIGHT,
  SPEECH_RATE,
  THEMES,
  type FontChoice,
  type Preferences,
  type Theme,
} from '../lib/preferences'

interface Props {
  preferences: Preferences
  onChange: (patch: Partial<Preferences>) => void
  onReset?: () => void
  heading?: string
}

const themeLabels: Record<Theme, string> = {
  crema: 'Crema',
  claro: 'Claro',
  suave: 'Verde',
  oscuro: 'Noche',
}

const fontLabels: Record<FontChoice, string> = {
  clara: 'Letra clara',
  sistema: 'Letra ancha',
}

export function AidsPanel({ preferences, onChange, onReset, heading = 'Ajustes de lectura' }: Props) {
  const previewStyle = {
    fontFamily:
      preferences.font === 'clara'
        ? 'var(--font-read)'
        : 'Verdana, "Trebuchet MS", system-ui, sans-serif',
    fontSize: `${preferences.fontSize}px`,
    lineHeight: preferences.lineHeight,
    letterSpacing: `${preferences.letterSpacing}em`,
  }

  return (
    <section className="aids" aria-label={heading}>
      <div className="aids-head">
        <h2>{heading}</h2>
        {onReset ? (
          <button type="button" className="btn btn-quiet btn-small" onClick={onReset}>
            Volver al inicio
          </button>
        ) : null}
      </div>

      <p className="aids-preview" style={previewStyle} aria-hidden="true">
        Leer despacio también es leer.
      </p>

      <fieldset className="aids-group">
        <legend>Color de fondo</legend>
        <div className="swatches">
          {THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              className={preferences.theme === theme ? 'swatch is-on' : 'swatch'}
              data-swatch={theme}
              aria-pressed={preferences.theme === theme}
              onClick={() => onChange({ theme })}
            >
              <span className="swatch-dot" aria-hidden="true" />
              {themeLabels[theme]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="aids-group">
        <legend>Letra</legend>
        <div className="segmented">
          {(['clara', 'sistema'] as FontChoice[]).map((font) => (
            <button
              key={font}
              type="button"
              className={preferences.font === font ? 'segment is-on' : 'segment'}
              aria-pressed={preferences.font === font}
              onClick={() => onChange({ font })}
            >
              {fontLabels[font]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="aids-group">
        <label className="slider" htmlFor="aids-size">
          <span className="slider-label">
            Tamaño <output htmlFor="aids-size">{preferences.fontSize} px</output>
          </span>
          <input
            id="aids-size"
            type="range"
            min={FONT_SIZE.min}
            max={FONT_SIZE.max}
            step={1}
            value={preferences.fontSize}
            onChange={(event) => onChange({ fontSize: Number(event.target.value) })}
          />
        </label>

        <label className="slider" htmlFor="aids-leading">
          <span className="slider-label">
            Espacio entre renglones <output htmlFor="aids-leading">{preferences.lineHeight.toFixed(2)}</output>
          </span>
          <input
            id="aids-leading"
            type="range"
            min={LINE_HEIGHT.min}
            max={LINE_HEIGHT.max}
            step={0.05}
            value={preferences.lineHeight}
            onChange={(event) => onChange({ lineHeight: Number(event.target.value) })}
          />
        </label>

        <label className="slider" htmlFor="aids-tracking">
          <span className="slider-label">
            Espacio entre letras{' '}
            <output htmlFor="aids-tracking">{preferences.letterSpacing.toFixed(2)} em</output>
          </span>
          <input
            id="aids-tracking"
            type="range"
            min={LETTER_SPACING.min}
            max={LETTER_SPACING.max}
            step={0.01}
            value={preferences.letterSpacing}
            onChange={(event) => onChange({ letterSpacing: Number(event.target.value) })}
          />
        </label>
      </div>

      <fieldset className="aids-group">
        <legend>Ayudas para concentrarte</legend>
        <div className="toggles">
          <button
            type="button"
            role="switch"
            aria-checked={preferences.ruler}
            className={preferences.ruler ? 'switch is-on' : 'switch'}
            onClick={() => onChange({ ruler: !preferences.ruler })}
          >
            Regla de lectura
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={preferences.bionic}
            className={preferences.bionic ? 'switch is-on' : 'switch'}
            onClick={() => onChange({ bionic: !preferences.bionic })}
          >
            Negrita al empezar la palabra
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={preferences.focusMode}
            className={preferences.focusMode ? 'switch is-on' : 'switch'}
            onClick={() => onChange({ focusMode: !preferences.focusMode })}
          >
            Modo enfoque
          </button>
        </div>
      </fieldset>

      <div className="aids-group">
        <label className="slider" htmlFor="aids-rate">
          <span className="slider-label">
            Velocidad de la voz{' '}
            <output htmlFor="aids-rate">{preferences.speechRate.toFixed(2)}×</output>
          </span>
          <input
            id="aids-rate"
            type="range"
            min={SPEECH_RATE.min}
            max={SPEECH_RATE.max}
            step={0.05}
            value={preferences.speechRate}
            onChange={(event) => onChange({ speechRate: Number(event.target.value) })}
          />
        </label>

        <fieldset className="aids-subgroup">
          <legend>Pausa activa cada…</legend>
          <div className="segmented segmented-wrap">
            {BREAK_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                className={preferences.breakEvery === minutes ? 'segment is-on' : 'segment'}
                aria-pressed={preferences.breakEvery === minutes}
                onClick={() => onChange({ breakEvery: minutes })}
              >
                {minutes === 0 ? 'Sin pausa' : `${minutes} min`}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  )
}
