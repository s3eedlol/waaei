import Link from "next/link";

export function Header() {
  return (
    <header
      style={{
        background: "var(--waaei-bg)",
        borderBottom: "1px solid var(--waaei-rule)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px 22px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo: ink square tile + wordmark — verbatim from design reference */}
        <Link
          href="/"
          aria-label="واعي — الرئيسية"
          style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "var(--waaei-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--waaei-bg)",
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            و
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.3,
              color: "var(--waaei-ink)",
            }}
          >
            واعي
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex gap-2 lg:gap-4 text-[11px] lg:text-[12px] font-semibold">
          <Link
            href="/اختبارات"
            style={{ color: "var(--waaei-ink)", textDecoration: "none" }}
          >
            الاختبارات
          </Link>
          <Link
            href="/مقالات"
            style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
          >
            المقالات
          </Link>
          <Link
            href="/عن-الموقع"
            style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
          >
            عن الموقع
          </Link>
          <Link
            href="/سياسة-الخصوصية"
            style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
          >
            الخصوصية
          </Link>
        </nav>
      </div>
    </header>
  );
}
