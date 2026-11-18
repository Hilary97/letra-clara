import { describe, expect, it } from 'vitest'
import { findStory, stories } from './stories'

describe('stories', () => {
  it('has at least five readable stories with unique ids', () => {
    expect(stories.length).toBeGreaterThanOrEqual(5)
    expect(new Set(stories.map((story) => story.id)).size).toBe(stories.length)
  })

  it('every story has short paragraphs and at least two questions', () => {
    for (const story of stories) {
      expect(story.title.length).toBeGreaterThan(0)
      expect(story.paragraphs.length).toBeGreaterThanOrEqual(4)
      expect(story.questions.length).toBeGreaterThanOrEqual(2)
      expect(story.minutes).toBeGreaterThan(0)
      for (const paragraph of story.paragraphs) {
        expect(paragraph.trim()).toBe(paragraph)
        expect(paragraph.length).toBeGreaterThan(0)
        // short lines of at most three sentences keep the reading load low
        expect(paragraph.length).toBeLessThanOrEqual(160)
        const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(Boolean)
        expect(sentences.length).toBeLessThanOrEqual(3)
        for (const sentence of sentences) {
          const words = sentence.split(/\s+/).filter(Boolean).length
          expect(words).toBeLessThanOrEqual(20)
        }
      }
    }
  })

  it('every question has a valid answer and honest retry text', () => {
    for (const story of stories) {
      for (const question of story.questions) {
        expect(question.options.length).toBeGreaterThanOrEqual(2)
        expect(question.correctIndex).toBeGreaterThanOrEqual(0)
        expect(question.correctIndex).toBeLessThan(question.options.length)
        expect(question.praise.length).toBeGreaterThan(0)
        expect(question.retry.length).toBeGreaterThan(0)
      }
    }
  })

  it('does not repeat options inside a question', () => {
    for (const story of stories) {
      for (const question of story.questions) {
        expect(new Set(question.options).size).toBe(question.options.length)
      }
    }
  })

  it('findStory returns a story or undefined', () => {
    expect(findStory(stories[0].id)?.title).toBe(stories[0].title)
    expect(findStory('no-existe')).toBeUndefined()
  })
})
