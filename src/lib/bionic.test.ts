import { describe, expect, it } from 'vitest'
import { boldPrefixLength, toBionicTokens, tokenIndexAt } from './bionic'

function plain(tokens: ReturnType<typeof toBionicTokens>): string {
  return tokens
    .map((token) => (token.kind === 'word' ? token.bold + token.rest : token.text))
    .join('')
}

describe('boldPrefixLength', () => {
  it('bolds a single letter for short words', () => {
    expect(boldPrefixLength('y')).toBe(1)
    expect(boldPrefixLength('sol')).toBe(1)
  })

  it('bolds two letters for medium words and forty percent for long ones', () => {
    expect(boldPrefixLength('cuento')).toBe(2)
    expect(boldPrefixLength('mariposa')).toBe(4)
    expect(boldPrefixLength('mandarinas')).toBe(4)
  })
})

describe('toBionicTokens', () => {
  it('never changes the original text', () => {
    const text = 'Tomi tiene un gato que se llama Miga. ¡Y duerme en el techo!'
    expect(plain(toBionicTokens(text))).toBe(text)
  })

  it('keeps punctuation and spacing in text tokens', () => {
    const tokens = toBionicTokens('Hola, mundo.')
    expect(tokens.map((token) => token.kind)).toEqual([
      'word',
      'text',
      'word',
      'text',
    ])
    expect(tokens[1]).toMatchObject({ kind: 'text', text: ', ' })
    expect(tokens[3]).toMatchObject({ kind: 'text', text: '.' })
  })

  it('counts accented letters as part of the word', () => {
    const tokens = toBionicTokens('árbol')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).toMatchObject({ bold: 'ár', rest: 'bol' })
  })

  it('splits leading quotes and dashes as text so words keep their offsets', () => {
    const tokens = toBionicTokens('—Podés pasar.')
    const word = tokens.find((token) => token.kind === 'word')
    expect(word).toMatchObject({ kind: 'word', start: 1, bold: 'Po', rest: 'dés' })
    expect(plain(tokens)).toBe('—Podés pasar.')
  })

  it('returns a single text token when there are no words', () => {
    expect(toBionicTokens('— ¡ !')).toEqual([
      { kind: 'text', start: 0, end: 5, text: '— ¡ !' },
    ])
  })
})

describe('tokenIndexAt', () => {
  it('finds the word token that contains the spoken character offset', () => {
    const tokens = toBionicTokens('Miga duerme arriba')
    const m = tokenIndexAt(tokens, 1)
    const arriba = tokenIndexAt(tokens, 13)
    expect(tokens[m]).toMatchObject({ kind: 'word', bold: 'Mi', rest: 'ga' })
    expect(tokens[arriba]).toMatchObject({ kind: 'word', bold: 'ar', rest: 'riba' })
    expect(tokenIndexAt(tokens, 4)).toBe(-1)
    expect(tokenIndexAt(tokens, 999)).toBe(-1)
  })
})
