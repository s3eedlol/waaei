import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Emdash",
  legalName: "Emdash",
  url: "https://emdash.ae",
  email: "contact@emdash.ae",
  sameAs: ["https://waaei.me"],
  subOrganization: {
    "@type": "Organization",
    name: "واعي",
    url: "https://waaei.me",
    description: "اختبارات نفسية مجانية باللغة العربية.",
  },
};

const sections = [
  {
    emoji: "🎯",
    title: "لماذا واعي؟",
    body: "الصحة النفسية موضوع يمسّ الجميع، لكن الأدوات المتاحة بالعربية شحيحة أو مترجمة ترجمة حرفية لا تعكس الواقع العربي. واعي وُجد لسدّ هذه الفجوة — منصة مبنية من الصفر للمستخدم العربي، بلغة واضحة وبعيدة عن التعقيد الطبي.",
  },
  {
    emoji: "🔬",
    title: "مقاييس علمية موثّقة",
    body: "كل اختبار على واعي مبني على مقياس بحثي مُتحقَّق منه ومُستخدَم في الدراسات الأكاديمية العالمية — مثل PHQ-9 للاكتئاب، وGAD-7 للقلق، وPSS للتوتر. نفس الأدوات التي يعتمد عليها الباحثون والأطباء النفسيون حول العالم.",
  },
  {
    emoji: "🧭",
    title: "للفهم، لا للتشخيص",
    body: "واعي ليس بديلاً عن الطبيب أو المعالج النفسي. هو نقطة بداية — يساعدك على فهم ما تشعر به وتسمية ما تمر به. الفهم الذاتي هو الخطوة الأولى نحو طلب المساعدة المناسبة.",
  },
  {
    emoji: "🌍",
    title: "لمن واعي؟",
    body: "لكل شخص عربي يريد أن يفهم صحته النفسية بشكل أعمق — سواء كنت في السعودية أو الإمارات أو مصر أو أي مكان آخر. المحتوى مكتوب بعربية فصيحة مبسّطة تناسب الجميع.",
  },
];

export function AboutPage() {
  return (
    <div style={{ minHeight: "100svh", background: "var(--waaei-bg)", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      <main
        style={{
          flex: 1,
          maxWidth: 600,
          width: "100%",
          margin: "0 auto",
          padding: "40px 22px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Hero */}
        <div style={{ marginBottom: 10 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: -0.5,
              color: "var(--waaei-ink)",
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            عن واعي
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "var(--waaei-mute)",
              lineHeight: "var(--waaei-lh-body)",
            }}
          >
            24 اختباراً نفسياً مجانياً وسرياً بالعربية — مبنية على مقاييس علمية مُتحقَّق منها.
          </p>
        </div>

        {/* Sections */}
        {sections.map((s) => (
          <div
            key={s.title}
            style={{
              background: "var(--waaei-surface)",
              border: "1px solid var(--waaei-rule)",
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{s.emoji}</span>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--waaei-ink)" }}>{s.title}</div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--waaei-mute)", lineHeight: 1.75 }}>{s.body}</p>
          </div>
        ))}

        {/* Contact */}
        <div
          style={{
            background: "var(--waaei-surface)",
            border: "1px solid var(--waaei-rule)",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>✉️</span>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--waaei-ink)" }}>تواصل معنا</div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--waaei-mute)", lineHeight: 1.75 }}>
            واعي تابع لشركة{" "}
            <a
              href="https://emdash.ae"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--waaei-accent)", textDecoration: "none" }}
            >
              Emdash
            </a>
            ، شركة محتوى رقمي مرخّصة في أبوظبي، الإمارات العربية المتحدة.
            لأي استفسار راسلنا على{" "}
            <a
              href="mailto:contact@emdash.ae"
              style={{ color: "var(--waaei-accent)", textDecoration: "none" }}
            >
              contact@emdash.ae
            </a>
          </p>
        </div>

        {/* Footer bar */}
        <div
          style={{
            borderTop: "1px solid var(--waaei-rule)",
            paddingTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
            color: "var(--waaei-mute)",
          }}
        >
          <span style={{ fontWeight: 700 }}>© Emdash</span>
          <Link
            href="/سياسة-الخصوصية"
            style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
          >
            سياسة الخصوصية
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
