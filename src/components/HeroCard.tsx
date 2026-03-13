import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export function HeroCard({ children }: Props) {
  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '60px 40px 40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  )
}
