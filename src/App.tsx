// src/App.tsx
import { useEffect, useRef, useState } from 'react'
import type { BlobConfig, ConfigState } from './types'
import { Nav } from './components/Nav'
import { HeroCard } from './components/HeroCard'
import { HeroText } from './components/HeroText'
import { VideoPlayer } from './components/player/VideoPlayer'

export default function App() {
  const [state, setState] = useState<ConfigState>({ status: 'loading' })
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/blob-config')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<BlobConfig>
      })
      .then(config => setState({ status: 'ready', config }))
      .catch(e => setState({ status: 'error', message: e.message }))
  }, [])

  const scrollToPlayer = () => playerRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
      <Nav />

      <HeroCard>
        {state.status === 'loading' && <Skeleton />}

        {state.status === 'error' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#e50914', marginBottom: '12px' }}>Failed to load: {state.message}</p>
            <button
              onClick={() => { setState({ status: 'loading' }); window.location.reload() }}
              style={{ background: '#111', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <HeroText onWatchDemo={scrollToPlayer} />
            <div ref={playerRef}>
              <VideoPlayer
                videoUrl={state.config.videoUrl}
                spriteUrl={state.config.spriteUrl}
                vttUrl={state.config.vttUrl}
              />
            </div>
          </>
        )}
      </HeroCard>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: '28px', background: '#f0f0ed', borderRadius: '8px', maxWidth: '300px', margin: '0 auto 12px' }} />
      <div style={{ height: '52px', background: '#f0f0ed', borderRadius: '8px', maxWidth: '500px', margin: '0 auto 12px' }} />
      <div style={{ aspectRatio: '16/9', background: '#f0f0ed', borderRadius: '14px' }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
