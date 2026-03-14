import { useRef, useState } from 'react'
import type { ConfigState } from './types'
import { Nav } from './components/Nav'
import { HeroCard } from './components/HeroCard'
import { VideoPlayer } from './components/player/VideoPlayer'

const { VITE_VIDEO_URL, VITE_SPRITE_URL, VITE_VTT_URL } = import.meta.env

export default function App() {
  const [state] = useState<ConfigState>(() => {
    if (VITE_VIDEO_URL && VITE_SPRITE_URL && VITE_VTT_URL) {
      return { status: 'ready', config: { videoUrl: VITE_VIDEO_URL, spriteUrl: VITE_SPRITE_URL, vttUrl: VITE_VTT_URL } }
    }
    return { status: 'error', message: 'Video URLs not configured.' }
  })
  const playerRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '16px', boxSizing: 'border-box' }}>
      <Nav />

      <HeroCard>
        {state.status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <p style={{ color: '#e50914', margin: 0 }}>Failed to load: {state.message}</p>
          </div>
        )}

        {state.status === 'ready' && (
          <div ref={playerRef} style={{ height: '100%' }}>
            <VideoPlayer
              videoUrl={state.config.videoUrl}
              spriteUrl={state.config.spriteUrl}
              vttUrl={state.config.vttUrl}
            />
          </div>
        )}
      </HeroCard>
    </div>
  )
}
