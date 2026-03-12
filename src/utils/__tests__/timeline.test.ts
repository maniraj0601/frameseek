import { describe, it, expect } from 'vitest'
import { positionToTime, formatTime } from '../timeline'

describe('positionToTime', () => {
  it('returns 0 when x is 0', () => {
    expect(positionToTime(0, 800, 120)).toBe(0)
  })

  it('returns duration when x equals trackWidth', () => {
    expect(positionToTime(800, 800, 120)).toBe(120)
  })

  it('calculates midpoint correctly', () => {
    expect(positionToTime(400, 800, 120)).toBe(60)
  })

  it('clamps to 0 for negative x', () => {
    expect(positionToTime(-10, 800, 120)).toBe(0)
  })

  it('clamps to duration for x > trackWidth', () => {
    expect(positionToTime(900, 800, 120)).toBe(120)
  })

  it('returns 0 when duration is 0', () => {
    expect(positionToTime(400, 800, 0)).toBe(0)
  })
})

describe('formatTime', () => {
  it('formats zero as 0:00', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  it('formats 65 seconds as 1:05', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  it('formats 3661 seconds as 1:01:01', () => {
    expect(formatTime(3661)).toBe('1:01:01')
  })
})
