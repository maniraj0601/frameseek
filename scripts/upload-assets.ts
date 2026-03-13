// scripts/upload-assets.ts
// Run with: npx tsx scripts/upload-assets.ts
// Requires BLOB_READ_WRITE_TOKEN in .env.local
// Place files at: scripts/assets/video.mp4, scripts/assets/sprites.jpg, scripts/assets/sprites.vtt

import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: '.env.local' })

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Error: BLOB_READ_WRITE_TOKEN not set in .env.local')
  process.exit(1)
}

async function upload(localPath: string, blobName: string, contentType: string) {
  const buffer = readFileSync(resolve(localPath))
  const blob = await put(blobName, buffer, { access: 'public', token, contentType })
  return blob.url
}

async function main() {
  console.log('Uploading assets to Vercel Blob...\n')

  const videoUrl = await upload('scripts/assets/video.mp4', 'frameseek/video.mp4', 'video/mp4')
  console.log(`VIDEO_URL=${videoUrl}`)

  const spriteUrl = await upload('scripts/assets/sprites.jpg', 'frameseek/sprites.jpg', 'image/jpeg')
  console.log(`SPRITE_URL=${spriteUrl}`)

  const vttUrl = await upload('scripts/assets/sprites.vtt', 'frameseek/sprites.vtt', 'text/vtt')
  console.log(`VTT_URL=${vttUrl}`)

  console.log('\nDone. Copy the above lines into your .env.local file.')
}

main().catch(e => { console.error(e); process.exit(1) })
