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
            <img
              className={styles.image}
              src={image.href}
              loading="lazy"
              alt={image.alt}
              data-offset={image.offset}
              data-audio={image.audio}
            />
          </div>
        ))}
      </div>
    </>
  )
}
