import { parseRSSImages } from "@/lib/rss"

const RSS_URL = "https://chorus.mohiohio.com/feed.xml"

export const getImages = async () => {
  const rss = fetch(RSS_URL)
    .then((resp) => resp.text())
    .then((xml) => parseRSSImages(xml))
  return rss
}
