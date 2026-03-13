// src/components/player/SpritePreview.tsx
import type { SpriteRect } from '../../types'
import { formatTime } from '../../utils/timeline'

type Props = {
  spriteUrl: string
  rect: SpriteRect
  gridWidth: number
  gridHeight: number
  time: number
  x: number
}

export function SpritePreview({ spriteUrl, rect, gridWidth, gridHeight, time, x }: Props) {
  const TILE_W = rect.w
  const TILE_H = rect.h

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: `${x}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: `${TILE_W}px`,
          height: `${TILE_H}px`,
          backgroundImage: `url(${spriteUrl})`,
          backgroundPosition: `-${rect.x}px -${rect.y}px`,
          backgroundSize: `${gridWidth}px ${gridHeight}px`,
          backgroundRepeat: 'no-repeat',
          borderRadius: '4px',
          border: '1.5px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}
      />
      <div
        style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#ddd',
          marginTop: '4px',
          fontFamily: 'monospace',
        }}
      >
        {formatTime(time)}
      </div>
    </div>
  )
}
