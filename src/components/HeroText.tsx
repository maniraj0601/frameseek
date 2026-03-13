type Props = { onWatchDemo: () => void }

export function HeroText({ onWatchDemo }: Props) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555', marginBottom: '16px' }}>
        <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
        Instant timeline previews
      </div>
      <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#111', lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1px' }}>
        Seek Before<br />You Stream
      </h1>
      <p style={{ fontSize: '16px', color: '#666', maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.6 }}>
        Hover the timeline to see exactly where you're jumping — even before the video loads.
        Powered by pre-generated sprite sheets and Vercel Blob Storage.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={onWatchDemo} style={{ background: '#111', color: 'white', border: 'none', borderRadius: '24px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Watch Demo
        </button>
        <a href="HOW_IT_WORKS.md" target="_blank" rel="noreferrer" style={{ background: 'transparent', color: '#111', border: '1.5px solid #ddd', borderRadius: '24px', padding: '12px 24px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          Read the Explainer
        </a>
      </div>
    </div>
  )
}
