import { Suspense } from "react";
import { ImageList } from "./image-list";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageList />
      </Suspense>
    </>
  );
}
