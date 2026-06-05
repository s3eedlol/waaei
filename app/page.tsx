import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestCard } from "@/components/TestCard";
import { HomeMoodSection } from "@/components/HomeMoodSection";
import { RecommendedTestItem } from "@/components/RecommendationCard";
import { phq9Config } from "@/lib/tests/phq9";
import { gad7Config } from "@/lib/tests/gad7";
import { burnoutConfig } from "@/lib/tests/burnout";
import { pssConfig } from "@/lib/tests/pss";
import { ocirConfig } from "@/lib/tests/ocir";
import { asrs5Config } from "@/lib/tests/asrs5";
import { pcl5Config } from "@/lib/tests/pcl5";
import { isiConfig } from "@/lib/tests/isi";
import { rsesConfig } from "@/lib/tests/rses";
import { spinConfig } from "@/lib/tests/spin";
import { bfi10Config } from "@/lib/tests/bfi10";
import { ecrsConfig } from "@/lib/tests/ecrs";
import { sassvConfig } from "@/lib/tests/sassv";
import { beis10Config } from "@/lib/tests/beis10";
import { uls8Config } from "@/lib/tests/uls8";
import { staxiConfig } from "@/lib/tests/staxi";
import { eat7Config } from "@/lib/tests/eat7";
import { mdqConfig } from "@/lib/tests/mdq";
import { dass21Config } from "@/lib/tests/dass21";
import { bpniConfig } from "@/lib/tests/bpni";
import { psqiConfig } from "@/lib/tests/psqi";
import { ptgiConfig } from "@/lib/tests/ptgi";
import { auditcConfig } from "@/lib/tests/auditc";
import { epdsConfig } from "@/lib/tests/epds";
import { TestConfig } from "@/lib/types";

// ── Metadata (unchanged) ──────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية | واعي",
  description:
    "24 اختباراً نفسياً مجانياً وسرياً بالعربية. اختبارات الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر — مبنية على مقاييس علمية مُتحقَّق منها.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية | واعي",
    description:
      "24 اختباراً نفسياً مجانياً وسرياً بالعربية. اختبارات الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر — مبنية على مقاييس علمية مُتحقَّق منها.",
    url: "/",
  },
  twitter: {
    title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية | واعي",
    description:
      "24 اختباراً نفسياً مجانياً وسرياً بالعربية. اختبارات الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر — مبنية على مقاييس علمية مُتحقَّق منها.",
  },
};

// ── Test groupings (unchanged) ────────────────────────────────────────────────
const moodTests: TestConfig[]        = [phq9Config, epdsConfig, mdqConfig, dass21Config, rsesConfig, beis10Config, staxiConfig, eat7Config, ptgiConfig, psqiConfig, auditcConfig];
const anxietyTests: TestConfig[]     = [gad7Config, spinConfig, pcl5Config, ocirConfig];
const stressTests: TestConfig[]      = [pssConfig, burnoutConfig, isiConfig, asrs5Config, sassvConfig];
const personalityTests: TestConfig[] = [bfi10Config, ecrsConfig, uls8Config, bpniConfig];

type Section = { title: string; tests: TestConfig[]; color: string; emoji: string };

const sections: Section[] = [
  { title: "الاكتئاب والمزاج",    tests: moodTests,        color: "var(--waaei-cat-depression)",  emoji: "🌿" },
  { title: "القلق والخوف",         tests: anxietyTests,     color: "var(--waaei-cat-anxiety)",     emoji: "🌊" },
  { title: "التوتر والإرهاق",      tests: stressTests,      color: "var(--waaei-cat-stress)",      emoji: "🍃" },
  { title: "الشخصية والعلاقات",   tests: personalityTests, color: "var(--waaei-cat-personality)", emoji: "🎭" },
];

const allTests = sections.flatMap((s) => s.tests);

// ── Mood → recommendation mapping (from README.md — confirmed all slugs exist) ──
// Indexed 0=بخير 1=قَلِق 2=حزين 3=مرهَق 4=متوتر 5=متبلّد
const MOOD_SLUGS: string[][] = [
  ["اختبار-الذكاء-العاطفي",          "اختبار-تقدير-الذات",            "اختبار-النمو-بعد-الصدمة"],
  ["اختبار-القلق",                    "اختبار-الرهاب-الاجتماعي",       "اختبار-الوسواس-القهري"],
  ["اختبار-الاكتئاب",                 "اختبار-الاكتئاب-والقلق-والتوتر", "اختبار-تقدير-الذات"],
  ["اختبار-الإحتراق-الوظيفي",          "اختبار-التوتر",                 "اختبار-الأرق"],
  ["اختبار-التوتر",                   "اختبار-الإحتراق-الوظيفي",        "اختبار-الأرق"],
  ["اختبار-الاكتئاب",                 "اختبار-إدمان-الهاتف",           "اختبار-جودة-النوم"],
];

const allTestsBySlug = Object.fromEntries(allTests.map((c) => [c.slug, c]));

// Fail loudly if any mood-mapping slug is missing from the test roster
MOOD_SLUGS.flat().forEach((slug) => {
  if (!allTestsBySlug[slug]) {
    throw new Error(
      `❌ MOOD_SLUGS contains "${slug}" which does not exist in the test roster. ` +
      `Update MOOD_SLUGS or add the missing test.`
    );
  }
});

const moodRecommendations: RecommendedTestItem[][] = MOOD_SLUGS.map((slugs) =>
  slugs.map((slug) => {
    const cfg = allTestsBySlug[slug];
    return {
      slug:             cfg.slug,
      name:             cfg.name,
      icon:             cfg.icon,
      category:         cfg.category,
      estimatedMinutes: cfg.estimatedMinutes,
      questionsCount:   cfg.questions.length,
    };
  })
);

// ── "لماذا واعي؟" pillars ─────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    emoji: "🔬",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M6 1v6l-4 8h14L12 7V1M6 1h6" stroke="var(--waaei-ink)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "مبني علمياً",
    body:  "جميع الاختبارات مبنية على مقاييس مُتحقَّق منها ومُستخدَمة في الأبحاث العالمية",
  },
  {
    emoji: "🔒",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M9 1L2 4v5c0 4 3 7 7 8 4-1 7-4 7-8V4L9 1z" stroke="var(--waaei-ink)" strokeWidth="1.4" fill="none"/>
      </svg>
    ),
    title: "خصوصية تامة",
    body:  "لا حساب، لا بريد إلكتروني، لا حفظ بيانات. نتائجك تبقى معك فقط",
  },
  {
    emoji: "🌍",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="7.5" stroke="var(--waaei-ink)" strokeWidth="1.4" fill="none"/>
        <path d="M1.5 9h15M9 1.5c2 2 3 4.5 3 7.5s-1 5.5-3 7.5c-2-2-3-4.5-3-7.5s1-5.5 3-7.5z" stroke="var(--waaei-ink)" strokeWidth="1.4" fill="none"/>
      </svg>
    ),
    title: "باللغة العربية",
    body:  "مُصمَّم خصيصاً للمستخدم العربي بلغة واضحة وسهلة وبعيدة عن التعقيد الطبي",
  },
];

// ── JSON-LD schemas (unchanged) ───────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "واعي",
  url: "https://waaei.me",
  description: "24 اختباراً نفسياً مجانياً وسرياً بالعربية — مبنية على مقاييس علمية مُتحقَّق منها",
  inLanguage: "ar",
  publisher: { "@type": "Organization", name: "واعي", url: "https://waaei.me" },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "اختبارات الصحة النفسية بالعربية",
  numberOfItems: allTests.length,
  itemListElement: allTests.map((config, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: config.name,
    url: `https://waaei.me/${config.slug}`,
  })),
};

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero: H1 + trust badges + mood selector + recommendation card */}
        <HomeMoodSection moodRecommendations={moodRecommendations} />

        {/* Mobile: 2×2 category cards linking to /اختبارات#<section> */}
        <div className="lg:hidden mx-auto px-[22px] pt-[8px] pb-[32px]" style={{ maxWidth: 1280 }}>
          <h2 className="text-[16px] font-black mb-4" style={{ color: "var(--waaei-ink)" }}>
            الفئات
          </h2>
          <div className="grid grid-cols-2 gap-[10px]">
            {sections.map((section) => (
              <a
                key={section.title}
                href={`/اختبارات#${section.title.replace(/\s+/g, "-")}`}
                style={{ textDecoration: "none", display: "block", height: "100%" }}
              >
                <div
                  style={{
                    background: "var(--waaei-surface)",
                    borderRadius: "var(--waaei-radius-md)",
                    border: "1px solid var(--waaei-rule)",
                    padding: 14,
                    height: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{section.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--waaei-ink)", lineHeight: 1.25, marginBottom: 3 }}>
                      {section.title}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--waaei-mute)" }}>
                      {section.tests.length} اختبارات
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop: full test sections with individual cards */}
        <div
          className="hidden lg:flex mx-auto px-[56px] py-[64px] flex-col gap-[56px]"
          style={{ maxWidth: 1280 }}
        >
          {sections.map((section) => (
            <section key={section.title}>
              {/* Category header: dot + title + hairline + count */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: section.color,
                    flexShrink: 0,
                  }}
                />
                <h2
                  className="text-[26px] font-black shrink-0"
                  style={{ color: "var(--waaei-ink)" }}
                >
                  {section.title}
                </h2>
                <div style={{ flex: 1, height: 1, background: "var(--waaei-rule)" }} />
                <span className="shrink-0" style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
                  {section.tests.length} اختبار
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {section.tests.map((config) => (
                  <TestCard key={config.id} config={config} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* "لماذا واعي؟" — Mobile: page-bg section, white bordered cards, SVG icon tiles */}
        <div className="lg:hidden" style={{ background: "var(--waaei-bg)" }}>
          <div className="mx-auto px-[22px] pt-[32px] pb-[8px]" style={{ maxWidth: 1280 }}>
            <h2
              className="text-[16px] font-black"
              style={{ color: "var(--waaei-ink)", marginBottom: 14 }}
            >
              لماذا واعي؟
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WHY_ITEMS.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "var(--waaei-surface)",
                    borderRadius: "var(--waaei-radius-md)",
                    border: "1px solid var(--waaei-rule)",
                    padding: 14,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
                    {item.emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--waaei-ink)", marginBottom: 4 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 11, color: "var(--waaei-mute)", lineHeight: "var(--waaei-lh-body)" }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* "لماذا واعي؟" — Desktop: white strip with borders, large emoji, open cards */}
        <section
          className="hidden lg:block"
          style={{
            background: "var(--waaei-surface)",
            borderTop: "1px solid var(--waaei-rule)",
            borderBottom: "1px solid var(--waaei-rule)",
          }}
        >
          <div
            className="mx-auto px-[56px] py-[64px]"
            style={{ maxWidth: 1280 }}
          >
            <h2
              className="text-[32px] font-black mb-8"
              style={{ color: "var(--waaei-ink)" }}
            >
              لماذا واعي؟
            </h2>
            <div className="grid grid-cols-3 gap-[28px]">
              {WHY_ITEMS.map((item) => (
                <div key={item.title}>
                  <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--waaei-ink)", marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--waaei-mute)", lineHeight: "var(--waaei-lh-body)" }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
