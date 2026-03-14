// src/components/player/Controls.tsx
import type React from 'react'
import { formatTime } from '../../utils/timeline'

type Props = {
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  onPlay: () => void
  onPause: () => void
  onSkip: (delta: number) => void
  onVolumeToggle: () => void
}

export function Controls({ playing, currentTime, duration, volume, onPlay, onPause, onSkip, onVolumeToggle }: Props) {
  const btn: React.CSSProperties = { background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '4px 0 2px' }}>
      {/* Left: mute */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={onVolumeToggle} style={{ ...btn, fontSize: '16px', opacity: 0.85 }} aria-label={volume === 0 ? 'Unmute' : 'Mute'}>
          {volume === 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity={0.75}>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity={0.75}>
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Center: rewind · play · forward */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => onSkip(-10)} style={{ ...btn, fontSize: '12px', fontWeight: 600, opacity: 0.75, letterSpacing: '-0.3px', fontFamily: 'monospace' }} aria-label="Skip back 10 seconds">
          -10s
        </button>
        <button
          onClick={playing ? onPause : onPlay}
          style={{
            ...btn,
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
            fontSize: '18px',
            color: '#111',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)'
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => onSkip(10)} style={{ ...btn, fontSize: '12px', fontWeight: 600, opacity: 0.75, letterSpacing: '-0.3px', fontFamily: 'monospace' }} aria-label="Skip forward 10 seconds">
          +10s
        </button>
      </div>

      {/* Right: time */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'monospace' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}
