import xpath from "xpath"
import { DOMParser as dom } from "@xmldom/xmldom"

const parseXML = (xml: string): Document =>
  new dom().parseFromString(xml, "text/xml")

export const parseRSSImages = (
  xml: string | Document
): { href: string; date: string }[] => {
  const doc: Document = typeof xml === "string" ? parseXML(xml) : xml
  const select = xpath.useNamespaces({ mohiohio: "https://mohiohio.com/rss" })
  const elements = select("//mohiohio:image", doc)
  if (Array.isArray(elements)) {
    return (elements as Element[]).map((element) => ({
      href: element.getAttribute("href") ?? "",
      date: element.getAttribute("date") ?? "",
    }))
  }
  return []
}
