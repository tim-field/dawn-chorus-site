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
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}
