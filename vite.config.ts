// vite.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import { config } from 'dotenv'

config({ path: '.env.local' })

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/blob-config', (_req, res) => {
        const { VIDEO_URL, SPRITE_URL, VTT_URL } = process.env
        if (!VIDEO_URL || !SPRITE_URL || !VTT_URL) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Blob URLs not configured in .env.local' }))
          return
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ videoUrl: VIDEO_URL, spriteUrl: SPRITE_URL, vttUrl: VTT_URL }))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
})
