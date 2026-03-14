// src/hooks/useVideoPlayer.ts
import { useState, useEffect, useCallback } from 'react'

type UseVideoPlayerResult = {
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  bufferedEnd: number
  buffering: boolean
  play: () => void
  pause: () => void
  seek: (seconds: number) => void
  setVolume: (v: number) => void
}

export function useVideoPlayer(videoRef: React.RefObject<HTMLVideoElement | null>): UseVideoPlayerResult {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [bufferedEnd, setBufferedEnd] = useState(0)
  const [buffering, setBuffering] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoadedMetadata = () => setDuration(video.duration)
    const onPlay = () => { setPlaying(true); setBuffering(false) }
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    const onWaiting = () => setBuffering(true)
    const onPlaying = () => setBuffering(false)
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBufferedEnd(video.buffered.end(video.buffered.length - 1))
      }
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onEnded)
    video.addEventListener('progress', onProgress)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('progress', onProgress)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
    }
  }, [videoRef])

  const play = useCallback(() => videoRef.current?.play(), [videoRef])
  const pause = useCallback(() => videoRef.current?.pause(), [videoRef])
  const seek = useCallback((seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime = seconds
  }, [videoRef])
  const setVolume = useCallback((v: number) => {
    if (videoRef.current) videoRef.current.volume = v
    setVolumeState(v)
  }, [videoRef])

  return { playing, currentTime, duration, volume, bufferedEnd, buffering, play, pause, seek, setVolume }
}
