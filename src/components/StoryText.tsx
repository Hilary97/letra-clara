import { useMemo } from 'react'
import { toBionicTokens, tokenIndexAt } from '../lib/bionic'

interface Props {
  text: string
  bionic: boolean
  active: boolean
  charIndex: number
}

export function StoryText({ text, bionic, active, charIndex }: Props) {
  const tokens = useMemo(() => toBionicTokens(text), [text])

  if (!bionic && !active) {
    return <p className="story-text">{text}</p>
  }

  const highlight = active ? tokenIndexAt(tokens, charIndex) : -1

  return (
    <p className={active ? 'story-text is-speaking' : 'story-text'}>
      {tokens.map((token, index) =>
        token.kind === 'text' ? (
          <span key={index}>{token.text}</span>
        ) : (
          <span key={index} className={index === highlight ? 'word is-current' : 'word'}>
            {bionic ? <b>{token.bold}</b> : token.bold}
            {token.rest}
          </span>
        ),
      )}
    </p>
  )
}
