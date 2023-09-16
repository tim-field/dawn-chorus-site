import "./globals.css"
import { Inter } from "next/font/google"
import styles from "./layout.module.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mohiohio",
  description: "Tim Field's personal website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}
