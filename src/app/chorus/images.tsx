import Image from "next/image"
import styles from "./images.module.css"
import { getImages } from "./get-images"
import { ImageAudio } from "./image-audio"

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
              src={image.href}
              height="1500"
              width="1500"
              alt="chorus"
              data-offset={image.offset}
              data-audio={image.audio}
            />
          </div>
        ))}
      </div>
    </>
  )
}
