// src/hooks/useSpritePreview.ts
import { useState, useEffect, useCallback } from 'react'
import type { SpriteRect } from '../types'

type Cue = {
  startSeconds: number
  endSeconds: number
  rect: SpriteRect
}

type UseSpritePreviewResult = {
  getFrame: (seconds: number) => SpriteRect | null
  gridWidth: number
  gridHeight: number
  ready: boolean
}

function parseTimeToSeconds(time: string): number {
  const parts = time.split(':').map(Number)
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return parts[0] * 60 + parts[1]
}

function parseXywh(cueBody: string): SpriteRect | null {
  const match = cueBody.match(/#xywh=(\d+),(\d+),(\d+),(\d+)/)
  if (!match) return null
  return {
    x: parseInt(match[1], 10),
    y: parseInt(match[2], 10),
    w: parseInt(match[3], 10),
    h: parseInt(match[4], 10),
  }
}

function parseVtt(text: string): Cue[] {
  if (!text.startsWith('WEBVTT')) return []
  const blocks = text.trim().split(/\n\n+/)
  const cues: Cue[] = []

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    const timingLine = lines.find(l => l.includes('-->'))
    if (!timingLine) continue
    const [startStr, endStr] = timingLine.split('-->').map(s => s.trim())
    const bodyLine = lines[lines.indexOf(timingLine) + 1]
    if (!bodyLine) continue
    const rect = parseXywh(bodyLine)
    if (!rect) continue
    cues.push({
      startSeconds: parseTimeToSeconds(startStr),
      endSeconds: parseTimeToSeconds(endStr),
      rect,
    })
  }

  return cues.sort((a, b) => a.startSeconds - b.startSeconds)
}

export function useSpritePreview(vttUrl: string | null): UseSpritePreviewResult {
  const [cues, setCues] = useState<Cue[]>([])
  const [ready, setReady] = useState(false)
  const [gridWidth, setGridWidth] = useState(0)
  const [gridHeight, setGridHeight] = useState(0)

  useEffect(() => {
    if (!vttUrl) return
    let cancelled = false

    fetch(vttUrl)
      .then(r => r.text())
      .then(text => {
        if (cancelled) return
        const parsed = parseVtt(text)
        if (parsed.length === 0) return
        const gw = Math.max(...parsed.map(c => c.rect.x + c.rect.w))
        const gh = Math.max(...parsed.map(c => c.rect.y + c.rect.h))
        setCues(parsed)
        setGridWidth(gw)
        setGridHeight(gh)
        setReady(true)
      })
      .catch(() => {
        // VTT fetch failed — graceful degradation, ready stays false
      })

    return () => { cancelled = true }
  }, [vttUrl])

  const getFrame = useCallback((seconds: number): SpriteRect | null => {
    if (!ready || cues.length === 0) return null
    const cue = cues.find(c => seconds >= c.startSeconds && seconds < c.endSeconds)
    if (cue) return cue.rect
    // Clamp to last cue if beyond end
    if (seconds >= cues[cues.length - 1].endSeconds) return cues[cues.length - 1].rect
    return null
  }, [ready, cues])

  return { getFrame, gridWidth, gridHeight, ready }
}
