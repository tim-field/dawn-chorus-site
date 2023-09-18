"use client"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useObserveImages } from "./use-observe-images"
import css from "./image-audio.module.css"

function getContainedSize(img: HTMLImageElement) {
  const ratio = img.naturalWidth / img.naturalHeight
  let width = img.height * ratio
  let height = img.height
  if (width > img.width) {
    width = img.width
    height = img.width / ratio
  }
  return [width, height]
}

export const ImageAudio = ({ targetSelector }: { targetSelector: string }) => {
  const [img] = useObserveImages({ targetSelector })
  const [duration, setDuration] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement>()
  const elementRef = useRef(null)
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

      if (nextImage) {
        offsetRef.current = Number(nextImage.dataset?.offset ?? 0)
        nextImage.loading = "eager"
      }

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

  const [style, setStyle] = useState<React.CSSProperties>()

  useLayoutEffect(() => {
    if (img) {
      const [renderedWidth, renderedHeight] = getContainedSize(img)
      setStyle({
        width: renderedWidth,
        bottom: (document.body.clientHeight - renderedHeight) / 2,
      })
    }
  }, [img])

  return (
    <div ref={elementRef} style={style} className={css.progress}>
      <div
        className={css.progressInner}
        style={{
          width: time && duration ? `${(time / duration) * 100}%` : undefined,
        }}
      ></div>
    </div>
  )
}
