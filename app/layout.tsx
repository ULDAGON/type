import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ULDAGON_type — touch typing trainer",
  description: "Learn 10-finger touch typing: lessons, practice, speed tests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <div className="shell">
          <header className="header">
            <Link href="/" className="wordmark">
              ULDAGON<span>_</span>type
            </Link>
            <Nav />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
