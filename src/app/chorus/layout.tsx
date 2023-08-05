import styles from "./layout.module.css"

export default function ChorusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className={styles.main}>{children}</main>
}
