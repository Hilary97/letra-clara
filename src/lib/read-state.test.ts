import { describe, expect, it } from 'vitest'
import { clearRead, getReadIds, markRead, READ_KEY } from './read-state'
import type { KeyValueStore } from './preferences'

function fakeStore(initial: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}

describe('read state', () => {
  it('starts empty and survives a mark', () => {
    const store = fakeStore()
    expect(getReadIds(store)).toEqual([])
    expect(markRead('miga-en-el-techo', store)).toEqual(['miga-en-el-techo'])
    expect(getReadIds(store)).toEqual(['miga-en-el-techo'])
  })

  it('does not duplicate an id read twice', () => {
    const store = fakeStore()
    markRead('pan-de-nube', store)
    expect(markRead('pan-de-nube', store)).toEqual(['pan-de-nube'])
  })

  it('ignores corrupted or foreign values', () => {
    expect(getReadIds(fakeStore({ [READ_KEY]: 'no soy json' }))).toEqual([])
    expect(getReadIds(fakeStore({ [READ_KEY]: '{"a":1}' }))).toEqual([])
    expect(getReadIds(fakeStore({ [READ_KEY]: '["uno", 2, null]' }))).toEqual(['uno'])
    expect(getReadIds(null)).toEqual([])
  })

  it('clears the list', () => {
    const store = fakeStore({ [READ_KEY]: '["uno"]' })
    expect(clearRead(store)).toEqual([])
    expect(getReadIds(store)).toEqual([])
  })
})
