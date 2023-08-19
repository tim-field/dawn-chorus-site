import { useEffect, useState } from "react"

export const useObserveImages = ({
  targetSelector,
}: {
  targetSelector: string
}) => {
  // const [audioUrl, setAudioUrl] = useState<string>()
  // const [seek, setSeek] = useState<number>(0)
  const [img, setImage] = useState<HTMLImageElement>()
  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry?.target instanceof HTMLImageElement
          ) {
            setImage(entry.target)
          }
        })
      },
      {
        threshold: 1,
      }
    )
    let targets = document.querySelectorAll(targetSelector)
    if (targets) {
      targets.forEach((el) => {
        observer.observe(el)
      })
    }
    return () => {
      observer.disconnect()
    }
  }, [targetSelector])

  return [img]
}
