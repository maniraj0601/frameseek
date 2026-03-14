import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export function HeroCard({ children }: Props) {
  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, minHeight: 0, aspectRatio: '16/9', maxWidth: '100%' }}>
      {children}
    </div>
  )
}
