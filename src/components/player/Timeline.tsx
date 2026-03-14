// src/components/player/Timeline.tsx
import { useRef, useState } from 'react'
import { useSpritePreview } from '../../hooks/useSpritePreview'
import { SpritePreview } from './SpritePreview'
import { positionToTime } from '../../utils/timeline'

type Props = {
  currentTime: number
  duration: number
  bufferedEnd: number
  spriteUrl: string
  vttUrl: string
  onSeek: (seconds: number) => void
}

export function Timeline({ currentTime, duration, bufferedEnd, spriteUrl, vttUrl, onSeek }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [hovered, setHovered] = useState(false)
  const { getFrame, gridWidth, gridHeight, ready } = useSpritePreview(vttUrl)

  const getRelativeX = (e: React.MouseEvent): number => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const width = rect.width
    setTrackWidth(width)
    return Math.max(0, Math.min(e.clientX - rect.left, width))
  }

  const playedPct = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPct = duration > 0 ? (bufferedEnd / duration) * 100 : 0

  const hoverTime = hoverX !== null ? positionToTime(hoverX, trackWidth, duration) : null
  const hoverRect = hoverTime !== null ? getFrame(hoverTime) : null

  return (
    <div
      style={{ position: 'relative', padding: '12px 0 8px', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={e => setHoverX(getRelativeX(e))}
      onMouseLeave={() => { setHoverX(null); setHovered(false) }}
      onClick={e => {
        const rect = trackRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        onSeek(positionToTime(x, rect.width, duration))
      }}
    >
      {ready && hoverRect && hoverX !== null && hoverTime !== null && (
        <SpritePreview
          spriteUrl={spriteUrl}
          rect={hoverRect}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          time={hoverTime}
          x={hoverX}
        />
      )}

      <div
        ref={trackRef}
        style={{
          height: hovered ? '5px' : '3px',
          background: '#444',
          borderRadius: '2px',
          position: 'relative',
          transition: 'height 0.15s ease',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${bufferedPct}%`, background: '#666', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${playedPct}%`, background: '#e50914', borderRadius: '2px' }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${playedPct}%`,
          transform: 'translate(-50%, -50%)',
          width: '12px', height: '12px',
          background: '#e50914', borderRadius: '50%',
          boxShadow: '0 0 0 3px rgba(229,9,20,0.25)',
        }} />
      </div>
    </div>
  )
}
