import { parseRSSImages } from "./rss"
let xml: string

beforeAll(async () => {
  xml = await fetch("https://chorus.mohiohio.com/feed.xml").then((resp) =>
    resp.text()
  )
})

describe("parses rss", () => {
  test("images are parsed", () => {
    expect(xml).toBeDefined()
    const rss = parseRSSImages(xml)
    expect(rss).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: expect.any(String),
          date: expect.any(String),
        }),
      ])
    )
  })
})
