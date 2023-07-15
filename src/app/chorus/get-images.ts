import { readdir } from "fs/promises";

const PATH_SAMPLES =
  "/Users/timfield/atomic/code/dawn-chorus-site/public/samples";

export const getImages = async () => {
  const files = readdir(`${PATH_SAMPLES}/images`);
  return files;
};
