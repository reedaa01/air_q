import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold">
          Morocco AQ
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-muted">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      {/* TODO: Connect navigation to authenticated areas, city search state, and deployment docs. */}
    </header>
  );
}
