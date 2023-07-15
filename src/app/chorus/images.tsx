import Image from "next/image";

const PUBLIC_URL = "/samples/images";

export const Images = ({ images }: { images: string[] }) => {
  return (
    <div>
      {images.map((image, index) => (
        <div key={index}>
          <Image
            src={`${PUBLIC_URL}/${image}`}
            height="1500"
            width="1500"
            alt="chorus"
          />
        </div>
      ))}
    </div>
  );
};
