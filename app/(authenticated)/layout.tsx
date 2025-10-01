import LogoutButton from "@/components/LogoutButton";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="p-4 border-b flex">
        <h1 className="text-2xl">Self service Grafana</h1>
        <div className="grow" /> <LogoutButton />
      </header>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </>
  );
}
