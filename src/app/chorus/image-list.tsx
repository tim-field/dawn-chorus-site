import { getImages } from "./get-images";
import { Images } from "./images";

export const ImageList = async () => {
  const images = await getImages();

  return (
    <div>
      <Images images={images} />
    </div>
  );
};
