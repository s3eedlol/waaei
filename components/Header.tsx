import Link from "next/link";

function LogoMark() {
  return (
    <span style={{
      fontFamily: "var(--font-cairo-var)",
      fontWeight: 700,
      fontSize: "1.4rem",
      color: "oklch(25% 0.06 145)",
      border: "2px solid oklch(25% 0.06 145)",
      padding: "0.3rem 1rem 0.4rem",
      borderRadius: "0.5rem",
      lineHeight: 1.4,
      display: "inline-block",
    }}>
      <span style={{ color: "oklch(55% 0.12 145)" }}>و</span>اعي
    </span>
  );
}

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" aria-label="واعي — الرئيسية">
          <LogoMark />
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            الاختبارات
          </Link>
          <Link href="/عن-الموقع" className="hover:text-foreground transition-colors">
            عن الموقع
          </Link>
        </nav>
      </div>
    </header>
  );
}
