import Image from "next/image"
import { getImages } from "./get-images"
import { ImageAudio } from "./image-audio"
import styles from "./images.module.css"

export const Images = ({
  images,
}: {
  images: Awaited<ReturnType<typeof getImages>>
}) => {
  return (
    <>
      <ImageAudio targetSelector={`.${styles.image}`} />
      <div id="scrollWrapper" className={styles.wrapper}>
        {images.map((image, index) => (
          <div key={image.href} className={styles.imageWrapper}>
            <Image
              className={styles.image}
              priority={index < 4}
              src={image.href}
              fill={true}
              alt={
                "A photo captured from the webcam at the time the audio was recorded"
              }
              title={image.alt}
              data-offset={image.offset}
              data-audio={image.audio}
            />
          </div>
        ))}
      </div>
    </>
  )
}
