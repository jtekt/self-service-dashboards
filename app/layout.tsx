import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle-mode";
import { HelpLink } from "@/components/help-link";
import { LogoutButton } from "@/components/logout-button";
import { PublicEnvScript } from "next-runtime-env";
import { getUserFromSession } from "@/lib/session";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Self-Service Grafana",
  description: "Self-service dashboards",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={cn(
          "flex min-h-screen flex-col font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <Link href="/" className="mr-auto text-base font-semibold">
              Self-Service Grafana
            </Link>
            <ModeToggle />
            <HelpLink />
            {user && <LogoutButton />}
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 p-4">{children}</main>
          <footer className="border-t p-4 text-center text-sm">
            Self-Service Grafana | JTEKT Corporation
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
