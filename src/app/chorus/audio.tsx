"use client"
import styles from "./audio.module.css"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useObserveImages } from "./use-observe-images"
import Play from "./play.svg"
import Pause from "./pause.svg"
import Mute from "./mute.svg"
import Volume from "./volume-loud.svg"

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedHours = hours ? `${hours.toString().padStart(2, "0")}:` : ""
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0")

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`
}

export const ImageAudio = ({ targetSelector }: { targetSelector: string }) => {
  const [img] = useObserveImages({ targetSelector })
  const [playing, setPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(1)
  const [volumeRestore, setVolumeRestore] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement>()
  const imageRef = useRef<HTMLImageElement | undefined>(img)
  const [ready, setReady] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string>()
  // const [seek, setSeek] = useState<number>(0)

  imageRef.current = img

  const seekTo = useCallback((seek: number) => {
    if (audioRef.current) {
      console.log("seeking", seek)
      if ("fastSeek" in audioRef.current) {
        audioRef.current.fastSeek(seek)
      } else {
        //@ts-ignore
        audioRef.current.currentTime = seek
      }
      setTime(audioRef.current.currentTime)
    }
  }, [])

  useEffect(() => {
    if (img) {
      const audioUrl = img.dataset?.audio ?? ""
      const seek = parseInt(img?.dataset?.offset ?? "0")

      setAudioUrl(audioUrl)
      seekTo(seek) // this will only do something if the audio is unchanged, and thus already ready
    }
  }, [img, seekTo])

  useEffect(() => {
    const nextImage = imageRef.current?.parentElement?.nextSibling
      ?.firstChild as HTMLImageElement | undefined

    console.log(imageRef.current, nextImage)

    const nextOffset = Number(nextImage?.dataset?.offset ?? 0)
    const offset = Number(imageRef.current?.dataset?.offset ?? 0)

    const timeupdate = () => {
      setTime(audioRef.current?.currentTime ?? 0)
      // if (
      //   nextOffset &&
      //   nextImage &&
      //   audioRef.current &&
      //   imageRef.current &&
      //   audioRef.current?.currentTime >= nextOffset
      // ) {
      //   console.log("scrolling", imageRef.current?.nextSibling)
      //   //@ts-ignore
      //   nextImage?.parentElement?.scrollIntoView("smooth")
      // }
    }
    const durationChange = () => {
      setDuration(audioRef.current?.duration ?? 0)
    }
    const canPlay = () => {
      setVolume(audioRef.current?.volume ?? 1)
      console.log("can play")
      setReady(true)
    }
    const play = () => {
      setPlaying(true)
    }
    const pause = () => {
      setPlaying(false)
    }
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl)
      const audio = audioRef.current

      if (audio.paused) {
        setReady(true)
      } else {
        // not ready yet - wait for canplay event
        audio.addEventListener("canplay", canPlay)
      }

      // try seek to here for initial load
      if (offset) {
        seekTo(offset)
      }

      try {
        audio.play()
        console.log("playing", audioUrl)
      } catch (e) {
        console.log("error playing", audioUrl, e)
      }
      audio.addEventListener("timeupdate", timeupdate)
      audio.addEventListener("durationchange", durationChange)
      audio.addEventListener("play", play)
      audio.addEventListener("pause", pause)
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", timeupdate)
        audioRef.current.removeEventListener("durationChange", durationChange)
        audioRef.current.removeEventListener("play", play)
        audioRef.current.removeEventListener("pause", pause)
        audioRef.current.removeEventListener("canPlay", canPlay)
        audioRef.current = undefined
      }
    }
  }, [audioUrl, seekTo])

  // useEffect(() => {
  //   seekTo(seek)
  // }, [seek, seekTo])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      console.log("set volume", volume)
    }
  }, [volume])

  const durationFormatted = useMemo(() => formatTime(duration), [duration])

  return (
    <div className={styles.footer}>
      <div
        id="audio-player"
        style={ready ? {} : { display: "none" }}
        className={styles.audio}
      >
        <button
          className={styles.button}
          onClick={() =>
            playing ? audioRef.current?.pause() : audioRef.current?.play()
          }
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <input
          type="range"
          className={styles.progress}
          value={time}
          onChange={(e) => seekTo(parseFloat(e.target.value ?? "0"))}
          max={duration}
        />
        <span className={styles.time}>
          <span className={styles.currentTime}>{formatTime(time)}</span>
          <span className={styles.totalTime}>{durationFormatted}</span>
        </span>
        <button
          className={styles.button}
          onClick={() => {
            if (volume) {
              setVolumeRestore(volume)
              setVolume(0)
            } else {
              setVolume(volumeRestore)
            }
          }}
        >
          {volume === 0 ? <Mute /> : <Volume />}
        </button>
        <input
          type="range"
          className={styles.volume}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value ?? "0"))}
          min={0}
          step={0.1}
          max={1}
        />
      </div>
      {/* <audio src={audioUrl} controls /> */}
    </div>
  )
}
