import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-sage-500">
          واعي
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
