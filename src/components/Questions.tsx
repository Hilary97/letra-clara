import { useState } from 'react'
import type { Question } from '../data/stories'
import { speechSupported } from '../hooks/useSpeech'

interface Props {
  questions: Question[]
}

interface Answer {
  choice: number | null
  solved: boolean
}

function readAloud(text: string) {
  if (!speechSupported()) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-AR'
  utterance.rate = 0.95
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function Questions({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const solvedCount = Object.values(answers).filter((answer) => answer.solved).length

  const choose = (question: Question, choice: number) => {
    setAnswers((current) => {
      const previous = current[question.id]
      if (previous?.solved) return current
      return {
        ...current,
        [question.id]: { choice, solved: choice === question.correctIndex },
      }
    })
  }

  return (
    <section className="questions" aria-labelledby="preguntas-title">
      <h2 id="preguntas-title">Charlamos un poco del cuento</h2>
      <p className="questions-note">
        No hay nota ni apuro. Podés intentar las veces que quieras y volver al texto cuando
        lo necesites.
      </p>

      <ol className="questions-list">
        {questions.map((question, index) => {
          const answer = answers[question.id]
          return (
            <li key={question.id} className="question">
              <div className="question-head">
                <h3>
                  {index + 1}. {question.prompt}
                </h3>
                {speechSupported() ? (
                  <button
                    type="button"
                    className="btn btn-quiet btn-small"
                    onClick={() =>
                      readAloud(`${question.prompt} ${question.options.join('. ')}`)
                    }
                  >
                    Escuchar
                  </button>
                ) : null}
              </div>

              <div className="options">
                {question.options.map((option, optionIndex) => {
                  const isChosen = answer?.choice === optionIndex
                  const isSolved = answer?.solved && isChosen
                  const isRetry = answer !== undefined && !answer.solved && isChosen
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`option${isSolved ? ' is-correct' : ''}${isRetry ? ' is-retry' : ''}`}
                      aria-pressed={isChosen}
                      onClick={() => choose(question, optionIndex)}
                    >
                      <span className="option-letter" aria-hidden="true">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                      {isSolved ? <span className="option-mark">✓</span> : null}
                    </button>
                  )
                })}
              </div>

              {answer ? (
                <p
                  className={answer.solved ? 'feedback is-good' : 'feedback is-soft'}
                  role="status"
                >
                  {answer.solved ? question.praise : question.retry}
                </p>
              ) : null}
            </li>
          )
        })}
      </ol>

      <p className="questions-progress" role="status">
        {solvedCount === questions.length
          ? '¡Terminaste todas las preguntas! Podés leer otro cuento cuando quieras.'
          : `${solvedCount} de ${questions.length} preguntas resueltas.`}
      </p>
    </section>
  )
}
