export default function ChorusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <h1>Chorus</h1>
      {children}
    </main>
  );
}
