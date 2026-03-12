import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSpritePreview } from '../useSpritePreview'

const SAMPLE_VTT = `WEBVTT

00:00:00.000 --> 00:00:10.000
sprites.jpg#xywh=0,0,160,90

00:00:10.000 --> 00:00:20.000
sprites.jpg#xywh=160,0,160,90

00:00:20.000 --> 00:00:30.000
sprites.jpg#xywh=320,0,160,90
`

beforeEach(() => {
  vi.restoreAllMocks()
})

function mockFetch(text: string) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(text),
  } as unknown as Response)
}

describe('useSpritePreview', () => {
  it('starts with ready=false', () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    expect(result.current.ready).toBe(false)
  })

  it('becomes ready after fetching and parsing VTT', async () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(result.current.ready).toBe(true))
  })

  it('getFrame returns correct rect for time 0', async () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.getFrame(0)).toEqual({ x: 0, y: 0, w: 160, h: 90 })
  })

  it('getFrame returns correct rect for time 10', async () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.getFrame(10)).toEqual({ x: 160, y: 0, w: 160, h: 90 })
  })

  it('getFrame returns correct rect for time in middle of a cue', async () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.getFrame(14.5)).toEqual({ x: 160, y: 0, w: 160, h: 90 })
  })

  it('getFrame clamps to last frame when time exceeds all cues', async () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.getFrame(9999)).toEqual({ x: 320, y: 0, w: 160, h: 90 })
  })

  it('getFrame returns null when not ready', () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    expect(result.current.getFrame(5)).toBeNull()
  })

  it('getFrame returns null when vttUrl is null', async () => {
    const { result } = renderHook(() => useSpritePreview(null))
    expect(result.current.getFrame(5)).toBeNull()
  })

  it('derives correct gridWidth and gridHeight', async () => {
    mockFetch(SAMPLE_VTT)
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    // gridWidth = max(x + w) = 320 + 160 = 480
    // gridHeight = max(y + h) = 0 + 90 = 90
    expect(result.current.gridWidth).toBe(480)
    expect(result.current.gridHeight).toBe(90)
  })

  it('handles malformed VTT gracefully — ready stays false', async () => {
    mockFetch('this is not valid vtt')
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    // Wait for the fetch + parse to complete, then assert ready is still false
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    await new Promise(r => setTimeout(r, 10)) // let microtasks settle
    expect(result.current.ready).toBe(false)
    expect(result.current.getFrame(0)).toBeNull()
  })

  it('handles empty VTT gracefully', async () => {
    mockFetch('WEBVTT\n\n')
    const { result } = renderHook(() => useSpritePreview('http://example.com/sprites.vtt'))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    await new Promise(r => setTimeout(r, 10))
    expect(result.current.getFrame(0)).toBeNull()
  })
})
