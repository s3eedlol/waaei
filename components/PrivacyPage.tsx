import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const LAST_UPDATED = "مايو 2026";

const sections = [
  {
    emoji: "🪪",
    title: "لا نجمع أي بيانات شخصية",
    body: "واعي لا يطلب أي معلومات شخصية — لا اسم، لا بريد إلكتروني، ولا تسجيل. يمكنك استخدام جميع الاختبارات بشكل مجهول تام.",
  },
  {
    emoji: "🔒",
    title: "نتائج الاختبارات تبقى في متصفحك",
    body: "جميع إجاباتك ونتائجك تُعالَج محلياً في متصفحك فقط ولا تُرسل إلى خوادمنا أبداً. عند إغلاق الصفحة تُحذف تلقائياً — لا توجد قاعدة بيانات تحتفظ بأي شيء.",
  },
  {
    emoji: "📊",
    title: "التحليلات",
    body: "نستخدم Vercel Analytics لقياس عدد الزيارات بشكل مجمّع وإجمالي فقط — دون تتبع أفراد، ودون ملفات تعريف الارتباط (Cookies)، ودون ربط أي بيانات بهويتك. لا نستخدم أي شبكات إعلانية أو أدوات تتبع من أطراف ثالثة.",
  },
  {
    emoji: "🍪",
    title: "ملفات تعريف الارتباط",
    body: "لا يضع الموقع أي ملفات تعريف ارتباط (Cookies) على جهازك لأغراض التتبع أو التسويق.",
  },
];

export function PrivacyPage() {
  return (
    <div style={{ minHeight: "100svh", background: "var(--waaei-bg)", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 560, width: "100%", margin: "0 auto", padding: "28px 22px 40px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `${("var(--waaei-accent)")}14`,
            backgroundColor: "oklch(47% 0.11 145 / 0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
              <path d="M13 1L2 6v8c0 7 5 13 11 15 6-2 11-8 11-15V6L13 1Z" stroke="var(--waaei-accent)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 15l3 3 5-5" stroke="var(--waaei-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: "var(--waaei-ink)", lineHeight: 1.2 }}>
            سياسة الخصوصية
          </h1>
        </div>

        {/* Sections */}
        {sections.map((s) => (
          <div
            key={s.title}
            style={{
              background: "var(--waaei-surface)",
              border: "1px solid var(--waaei-rule)",
              borderRadius: 16,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{s.emoji}</span>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--waaei-ink)" }}>{s.title}</div>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--waaei-mute)", lineHeight: 1.75 }}>{s.body}</p>
          </div>
        ))}

        {/* Operator section — kept separate for the links */}
        <div style={{
          background: "var(--waaei-surface)",
          border: "1px solid var(--waaei-rule)",
          borderRadius: 16,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>🏢</span>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--waaei-ink)" }}>الجهة المشغّلة</div>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--waaei-mute)", lineHeight: 1.75 }}>
            واعي تابع لشركة{" "}
            <a href="https://emdash.ae" target="_blank" rel="noopener noreferrer" style={{ color: "var(--waaei-accent)", textDecoration: "none" }}>
              Emdash
            </a>
            ، شركة محتوى رقمي مرخّصة في أبوظبي، الإمارات العربية المتحدة.
            لأي استفسار يتعلق بالخصوصية، تواصل معنا على{" "}
            <a href="mailto:contact@emdash.ae" style={{ color: "var(--waaei-accent)", textDecoration: "none" }}>
              contact@emdash.ae
            </a>
          </p>
        </div>

        {/* Footer bar */}
        <div style={{
          borderTop: "1px solid var(--waaei-rule)",
          paddingTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          color: "var(--waaei-mute)",
        }}>
          <span style={{ fontWeight: 700 }}>© Emdash</span>
          <span>آخر تحديث: {LAST_UPDATED}</span>
        </div>

      </main>

      <Footer />
    </div>
  );
}
