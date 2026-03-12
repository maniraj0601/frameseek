// src/utils/timeline.ts

export function positionToTime(x: number, trackWidth: number, duration: number): number {
  if (duration === 0) return 0
  const ratio = Math.max(0, Math.min(1, x / trackWidth))
  return ratio * duration
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
