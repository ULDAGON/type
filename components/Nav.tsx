"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/lessons", label: "lessons" },
  { href: "/practice", label: "practice" },
  { href: "/test", label: "speed test" },
  { href: "/stats", label: "stats" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={pathname.startsWith(l.href) ? "active" : ""}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
