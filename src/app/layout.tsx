import { RSS_URL } from "@/lib/constants"
import "./globals.css"
import styles from "./layout.module.css"

export const metadata = {
  title: "Mohiohio",
  description: "Tim Field's personal website",
  alternates: {
    types: {
      "application/rss+xml": RSS_URL,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="mohiohio.com"
          src="https://plausible.mohiohio.com/js/script.js"
        ></script>
      </head>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}
