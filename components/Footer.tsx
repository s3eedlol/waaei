import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--waaei-rule)" }}>
      <div className="mx-auto px-[22px] py-8 lg:px-[56px] lg:py-10" style={{ maxWidth: 1280 }}>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
          }}
        >
          {/* Logo — same as header */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: "var(--waaei-ink)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--waaei-bg)",
                fontSize: 18, fontWeight: 700, lineHeight: 1, flexShrink: 0,
              }}
            >
              و
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, color: "var(--waaei-ink)" }}>
              واعي
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--waaei-mute)", maxWidth: 480, lineHeight: "var(--waaei-lh-body)" }}>
            جميع الاختبارات على هذا الموقع أدوات للتوعية الذاتية فقط ولا تعدّ تشخيصاً طبياً.
            لا تحفظ أي بيانات شخصية. إذا كنت تمر بأزمة، يرجى التواصل مع متخصص.
          </p>

          <p style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
            © {new Date().getFullYear()}{" "}
            <a href="https://emdash.ae" target="_blank" rel="noopener noreferrer" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
              Emdash
            </a>
            {" · "}
            <a href="https://emdash.ae" target="_blank" rel="noopener noreferrer" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
              emdash.ae
            </a>
            {" · "}
            <Link href="/سياسة-الخصوصية" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
              سياسة الخصوصية
            </Link>
            {" · "}
            <Link href="/عن-الموقع" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
              عن الموقع
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
}
