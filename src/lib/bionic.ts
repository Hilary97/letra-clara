export type BionicToken =
  | { kind: 'word'; start: number; end: number; bold: string; rest: string }
  | { kind: 'text'; start: number; end: number; text: string }

const WORD_PATTERN = /[\p{L}\p{N}]+/gu

/** How many leading characters of a word get bolded. Always at least one. */
export function boldPrefixLength(word: string): number {
  const length = Array.from(word).length
  if (length <= 3) return 1
  if (length <= 6) return 2
  return Math.ceil(length * 0.4)
}

/**
 * Splits a text into word and gap tokens so the reader can bold the first
 * letters of every word without changing the text itself (spaces, punctuation
 * and line breaks stay byte-identical).
 */
export function toBionicTokens(text: string): BionicToken[] {
  const tokens: BionicToken[] = []
  let lastIndex = 0

  for (const match of text.matchAll(WORD_PATTERN)) {
    const start = match.index ?? 0
    const word = match[0]

    if (start > lastIndex) {
      tokens.push({
        kind: 'text',
        start: lastIndex,
        end: start,
        text: text.slice(lastIndex, start),
      })
    }

    const characters = Array.from(word)
    const boldCount = Math.min(characters.length, Math.max(1, boldPrefixLength(word)))

    tokens.push({
      kind: 'word',
      start,
      end: start + word.length,
      bold: characters.slice(0, boldCount).join(''),
      rest: characters.slice(boldCount).join(''),
    })

    lastIndex = start + word.length
  }

  if (lastIndex < text.length) {
    tokens.push({
      kind: 'text',
      start: lastIndex,
      end: text.length,
      text: text.slice(lastIndex),
    })
  }

  return tokens
}

/** Index of the word token that contains a character offset, or -1. */
export function tokenIndexAt(tokens: BionicToken[], charIndex: number): number {
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token.kind === 'word' && charIndex >= token.start && charIndex < token.end) {
      return index
    }
  }
  return -1
}
