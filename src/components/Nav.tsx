export function Nav() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px',
        background: 'white', borderRadius: '40px', padding: '10px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e8e8e8',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px' }}>
          <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '10px', marginLeft: '2px' }}>▶</span>
          </div>
          FrameSeek
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#555' }}>
          <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How it works</a>
          <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>About</a>
        </div>
        <a href="HOW_IT_WORKS.md" target="_blank" rel="noreferrer" style={{ background: '#111', color: 'white', borderRadius: '20px', padding: '7px 16px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
          Read Docs
        </a>
      </div>
    </nav>
  )
}
