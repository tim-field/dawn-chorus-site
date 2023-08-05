import Image from "next/image"
import styles from "./images.module.css"

export const Images = ({ images }: { images: { href: string }[] }) => {
  return (
    <div className={styles.wrapper}>
      {images.map((image, index) => (
        <Image
          key={index}
          className={styles.image}
          src={image.href}
          height="1500"
          width="1500"
          alt="chorus"
        />
      ))}
    </div>
  )
}
