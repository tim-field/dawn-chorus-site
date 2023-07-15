import { Suspense } from "react";
import { ImageList } from "./image-list";

export default function Page() {
  return (
    <>
      <h1>Images</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageList />
      </Suspense>
    </>
  );
}
