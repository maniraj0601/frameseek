// src/types.ts

export type SpriteRect = {
  x: number
  y: number
  w: number
  h: number
}

export type BlobConfig = {
  videoUrl: string
  spriteUrl: string
  vttUrl: string
}

export type ConfigState =
  | { status: 'loading' }
  | { status: 'ready'; config: BlobConfig }
  | { status: 'error'; message: string }
