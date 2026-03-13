// api/blob-config.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const { VIDEO_URL, SPRITE_URL, VTT_URL } = process.env

  if (!VIDEO_URL || !SPRITE_URL || !VTT_URL) {
    res.status(500).json({ error: 'Blob URLs not configured. Set VIDEO_URL, SPRITE_URL, VTT_URL in environment.' })
    return
  }

  res.setHeader('Cache-Control', 's-maxage=86400')
  res.json({ videoUrl: VIDEO_URL, spriteUrl: SPRITE_URL, vttUrl: VTT_URL })
}
