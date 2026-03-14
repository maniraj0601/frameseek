import { useEffect, useRef, useState } from 'react'
import type { BlobConfig, ConfigState } from './types'
import { Nav } from './components/Nav'
import { HeroCard } from './components/HeroCard'
import { VideoPlayer } from './components/player/VideoPlayer'

export default function App() {
  const [state, setState] = useState<ConfigState>({ status: 'loading' })
  const [retryCount, setRetryCount] = useState(0)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setState({ status: 'loading' })
    fetch('/api/blob-config')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<BlobConfig>
      })
      .then(config => setState({ status: 'ready', config }))
      .catch(e => setState({ status: 'error', message: e.message }))
  }, [retryCount])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '16px', boxSizing: 'border-box' }}>
      <Nav />

      <HeroCard>
        {state.status === 'loading' && <Skeleton />}

        {state.status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <p style={{ color: '#e50914', margin: 0 }}>Failed to load: {state.message}</p>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              style={{ background: '#111', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Retry
            </button>
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

function Skeleton() {
  return (
    <div style={{ height: '100%', background: '#f0f0ed', borderRadius: '14px', animation: 'pulse 1.5s ease-in-out infinite' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
