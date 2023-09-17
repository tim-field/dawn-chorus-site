import xpath from "xpath"
import { DOMParser as dom } from "@xmldom/xmldom"

const parseXML = (xml: string): Document =>
  new dom().parseFromString(xml, "text/xml")

// const select = xpath.useNamespaces({ mohiohio: "https://mohiohio.com/rss" })
// @ts-ignore
const itemsPath = xpath.parse("//item")
// @ts-ignore
const audioPath = xpath.parse("enclosure/@url")
// @ts-ignore
const imagesPath = xpath.parse("mohiohio:images//*")

export const parseRSSImages = (
  xml: string | Document
): {
  href: string
  date: string
  audio: string
  offset: string
  alt: string
}[] => {
  const doc: Document = typeof xml === "string" ? parseXML(xml) : xml
  const items = itemsPath.select({ node: doc })
  if (Array.isArray(items)) {
    return items.flatMap((node) => {
      // @ts-ignore
      const audio = audioPath.select1({ node })?.value ?? ""
      const images = imagesPath.select({ node })
      const description = node
        .getElementsByTagName("description")
        .item(0).textContent
      // @ts-ignore
      return Array.isArray(images)
        ? (images as Element[]).map((element) => ({
            audio,
            href: element.getAttribute("href") ?? "",
            date: element.getAttribute("date") ?? "",
            offset: element.getAttribute("offset") ?? "",
            alt: description,
          }))
        : []
    })
  }
  return []
}
