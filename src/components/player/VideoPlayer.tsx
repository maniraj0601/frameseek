// src/components/player/VideoPlayer.tsx
import { useEffect, useRef, useState } from 'react'
import { useVideoPlayer } from '../../hooks/useVideoPlayer'
import { Timeline } from './Timeline'
import { Controls } from './Controls'
import type { BlobConfig } from '../../types'

type Props = Pick<BlobConfig, 'videoUrl' | 'spriteUrl' | 'vttUrl'>

type VideoState = 'loading' | 'ready' | 'error'

export function VideoPlayer({ videoUrl, spriteUrl, vttUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoState, setVideoState] = useState<VideoState>('loading')

  useEffect(() => {
    setVideoState('loading')
  }, [videoUrl])

  const { playing, currentTime, duration, volume, bufferedEnd, buffering, play, pause, seek, setVolume } = useVideoPlayer(videoRef)
  const [skipLabel, setSkipLabel] = useState<string | null>(null)
  const accumulatedSkip = useRef(0)
  const skipLabelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSkip = (delta: number) => {
    accumulatedSkip.current += delta
    const total = accumulatedSkip.current
    setSkipLabel(total > 0 ? `+${total}s` : `${total}s`)
    if (skipLabelTimer.current) clearTimeout(skipLabelTimer.current)
    skipLabelTimer.current = setTimeout(() => {
      seek(Math.max(0, Math.min(duration, currentTime + accumulatedSkip.current)))
      accumulatedSkip.current = 0
      setTimeout(() => setSkipLabel(null), 600)
    }, 600)
  }
  const handleVolumeToggle = () => setVolume(volume === 0 ? 1 : 0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        playing ? pause() : play()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [playing, play, pause])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '14px', overflow: 'hidden', background: '#111', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
      <div
        style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', cursor: 'pointer' }}
        onClick={playing ? pause : play}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9', height: '100%', maxWidth: '100%' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ width: '100%', height: '100%', display: videoState === 'ready' ? 'block' : 'none' }}
          onCanPlay={() => setVideoState('ready')}
          onError={() => setVideoState('error')}
          playsInline
        />

        {videoState === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: 'white', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        {videoState === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>Could not load video</span>
          </div>
        )}

        {buffering && videoState === 'ready' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: 'white', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        {skipLabel && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.55)', color: 'white',
            fontSize: '26px', fontWeight: 700, fontFamily: 'monospace',
            padding: '12px 24px', borderRadius: '12px',
            pointerEvents: 'none',
            animation: 'fadeSkip 1.4s ease forwards',
          }}>
            {skipLabel}
          </div>
        )}

        {videoState === 'ready' && !playing && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <div style={{
              width: '56px', height: '56px', border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ width: 0, height: 0, borderLeft: '18px solid white', borderTop: '11px solid transparent', borderBottom: '11px solid transparent', marginLeft: '4px' }} />
            </div>
          </div>
        )}
        </div>
      </div>

      <div style={{ background: '#161616', padding: '0 16px 14px' }}>
        <Timeline
          currentTime={currentTime}
          duration={duration}
          bufferedEnd={bufferedEnd}
          spriteUrl={spriteUrl}
          vttUrl={vttUrl}
          onSeek={seek}
        />
        <Controls
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onPlay={play}
          onPause={pause}
          onSkip={handleSkip}
          onVolumeToggle={handleVolumeToggle}
        />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSkip { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); } 60% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -62%) scale(0.95); } }
      `}</style>
    </div>
  )
}
