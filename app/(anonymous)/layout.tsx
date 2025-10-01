export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-4 text-2xl border-b">Self service Grafana</header>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </>
  );
}
