import { RSS_URL } from "@/lib/constants"
import { parseRSSImages } from "@/lib/rss"

export const getImages = async () => {
  const rss = fetch(RSS_URL, { next: { revalidate: 3600 } })
    .then((resp) => resp.text())
    .then((xml) => parseRSSImages(xml))
  return rss
}
