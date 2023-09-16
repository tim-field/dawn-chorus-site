"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useObserveImages } from "./use-observe-images"
import styles from "./image-audio.module.css"

function getContainedSize(img: HTMLImageElement) {
  var ratio = img.naturalWidth / img.naturalHeight
  var width = img.height * ratio
  var height = img.height
  if (width > img.width) {
    width = img.width
    height = img.width / ratio
  }
  return [width, height]
}

export const ImageAudio = ({ targetSelector }: { targetSelector: string }) => {
  // const [playing, setPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement>()
  // const imageRef = useRef<HTMLImageElement | undefined>(img)
  // const [ready, setReady] = useState<boolean>(false)
  // const [audioUrl, setAudioUrl] = useState<string>()
  const [duration, setDuration] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const elementRef = useRef(null)
  const [img] = useObserveImages({ targetSelector })
  const offsetRef = useRef<number>(0)

  const listeners = useMemo(
    () => ({
      timeupdate() {
        const currentTime = audioRef.current?.currentTime
        setTime(currentTime ?? 0)
        if (currentTime && currentTime >= offsetRef.current) {
          console.log("next image")
        }
      },
      durationchange() {
        setDuration(audioRef.current?.duration ?? 0)
      },
      // canPlay() {
      //   setReady(true)
      // },
      // play() {
      //   setPlaying(true)
      // },
      // pause() {
      //   setPlaying(false)
      // },
    }),
    []
  )

  const cleanUp = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      Object.entries(listeners).forEach(([key, value]) => {
        audioRef.current?.removeEventListener(key, value)
      })
      audioRef.current = undefined
    }
  }, [listeners])

  const playAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    try {
      audio.play()
    } catch (e) {
      console.log("error playing audio")
    }
  }, [])

  const initAudio = useCallback(
    (url: string) => {
      const audio = audioRef.current
      if (audio?.src === url) {
        // already loaded
        console.log("initAudio: already loaded")
        return
      }
      if (audio) {
        console.log("initAudio: removing old audio")
        cleanUp()
      }

      console.log("initAudio: initiating new audio")
      audioRef.current = new Audio(url)
      Object.entries(listeners).forEach(([key, value]) => {
        audioRef.current?.addEventListener(key, value)
      })
      // if (audioRef.current.paused) {
      //   setReady(true)
      // }
      playAudio()
    },
    [listeners, cleanUp, playAudio]
  )

  const seekTo = useCallback((seek: number) => {
    if (audioRef.current) {
      console.log("seeking", seek)
      if ("fastSeek" in audioRef.current) {
        audioRef.current.fastSeek(seek)
      } else {
        //@ts-ignore
        audioRef.current.currentTime = seek
      }
    }
  }, [])

  useEffect(() => {
    if (img) {
      const audioUrl = img.dataset?.audio ?? ""
      const seek = parseInt(img?.dataset?.offset ?? "0")

      initAudio(audioUrl)
      seekTo(seek) // this will only do something if the audio is unchanged, and thus already ready
      img.onclick = playAudio

      const nextImage = img?.parentElement?.nextSibling?.firstChild as
        | HTMLImageElement
        | undefined

      offsetRef.current = Number(nextImage?.dataset?.offset ?? 0)

      //nextImage?.parentElement?.scrollIntoView("smooth")
      // const offset = Number(img?.dataset?.offset ?? 0)
    }
  }, [img, seekTo, initAudio, playAudio])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " ") {
        if (!audioRef.current) {
          return
        }
        if (audioRef.current.paused) {
          playAudio()
        } else {
          audioRef.current.pause()
        }
      }
    }
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      cleanUp()
    }
  }, [cleanUp, playAudio])

  const [renderedWidth, renderedHeight] = useMemo(
    () => (img ? getContainedSize(img) : [0, 0]),
    [img?.width]
  )

  const clientHeight =
    typeof window !== "undefined" ? document.body.clientHeight : undefined

  const progressPosition = useMemo(
    () =>
      clientHeight
        ? {
            width: renderedWidth,
            bottom: (clientHeight - renderedHeight) / 2,
          }
        : {},
    [renderedWidth, renderedHeight, clientHeight]
  )

  return (
    <div ref={elementRef} style={progressPosition} className={styles.progress}>
      <div
        className={styles.progressInner}
        style={{
          width: time && duration ? `${(time / duration) * 100}%` : undefined,
        }}
      ></div>
    </div>
  )
}
