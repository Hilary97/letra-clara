interface Props {
  minutes: number
  onDone: () => void
  onExit: () => void
}

export function PauseOverlay({ minutes, onDone, onExit }: Props) {
  return (
    <div className="pause" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="pause-card">
        <span className="breath" aria-hidden="true" />
        <h2 id="pause-title">Pausa de {minutes} minuto{minutes === 1 ? '' : 's'}</h2>
        <p>
          Mirá el círculo: cuando se agranda, tomás aire por la nariz. Cuando se achica,
          soltás el aire despacio. Tres veces alcanza.
        </p>
        <div className="pause-actions">
          <button type="button" className="btn btn-primary" onClick={onDone}>
            Ya descansé, seguir leyendo
          </button>
          <button type="button" className="btn btn-quiet" onClick={onExit}>
            Volver a la biblioteca
          </button>
        </div>
      </div>
    </div>
  )
}
