export function Nav() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px',
        background: 'white', borderRadius: '40px', padding: '10px 20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e8e8e8',
      }}>
        <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '10px', marginLeft: '2px' }}>▶</span>
        </div>
        FrameSeek
      </div>
    </nav>
  )
}
