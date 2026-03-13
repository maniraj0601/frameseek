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

  const { playing, currentTime, duration, volume, bufferedEnd, play, pause, seek, setVolume } = useVideoPlayer(videoRef)

  const handleSkip = (delta: number) => seek(Math.max(0, Math.min(duration, currentTime + delta)))
  const handleVolumeToggle = () => setVolume(volume === 0 ? 1 : 0)

  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', background: '#111', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
      <div
        style={{ position: 'relative', aspectRatio: '16/9', background: '#1a1a1a', cursor: 'pointer' }}
        onClick={playing ? pause : play}
      >
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
