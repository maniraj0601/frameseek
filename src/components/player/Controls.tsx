// src/components/player/Controls.tsx
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={playing ? onPause : onPlay}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: 0 }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => onSkip(-10)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', padding: 0, opacity: 0.85 }}
          aria-label="Skip back 10 seconds"
        >
          ⏪10
        </button>
        <button
          onClick={() => onSkip(10)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', padding: 0, opacity: 0.85 }}
          aria-label="Skip forward 10 seconds"
        >
          10⏩
        </button>
        <button
          onClick={onVolumeToggle}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', padding: 0, opacity: 0.85 }}
          aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        >
          {volume === 0 ? '🔇' : '🔊'}
        </button>
        <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'monospace' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
        FrameSeek Demo
      </span>
    </div>
  )
}
