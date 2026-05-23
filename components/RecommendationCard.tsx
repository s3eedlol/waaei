import Link from "next/link";
import { TestConfig } from "@/lib/types";

const categoryColorMap: Record<TestConfig["category"], string> = {
  mood:        "var(--waaei-cat-depression)",
  anxiety:     "var(--waaei-cat-anxiety)",
  ocd:         "var(--waaei-cat-anxiety)",
  work:        "var(--waaei-cat-stress)",
  stress:      "var(--waaei-cat-stress)",
  personality: "var(--waaei-cat-personality)",
};

const categoryLabel: Record<TestConfig["category"], string> = {
  mood:        "المزاج",
  anxiety:     "القلق",
  work:        "العمل",
  stress:      "التوتر",
  ocd:         "الوسواس",
  personality: "الشخصية",
};

export interface RecommendedTestItem {
  slug: string;
  name: string;
  icon: string;
  category: TestConfig["category"];
  estimatedMinutes: number;
  questionsCount: number;
}

export function RecommendationCard({ tests }: { tests: RecommendedTestItem[] }) {
  const [featured, ...alts] = tests;
  if (!featured) return null;

  const featCatColor = categoryColorMap[featured.category];
  const featCatLabel = categoryLabel[featured.category];

  return (
    <div
      style={{
        background: "var(--waaei-surface)",
        borderRadius: "var(--waaei-radius-xl)",
        boxShadow: "var(--waaei-shadow-card)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Card label — TODO(copy): spec uses "اختبارات قد تهمّك"; closest existing string used */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--waaei-mute)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        قد يهمك أيضاً
      </span>

      {/* Featured test */}
      <Link href={`/${featured.slug}`} style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            borderRadius: "var(--waaei-radius-md)",
            cursor: "pointer",
          }}
        >
          {/* Mobile: 32px emoji / Desktop: 44px in 56px cell */}
          <span className="text-[32px] lg:text-[44px] lg:w-14 shrink-0 leading-none self-start">
            {featured.icon}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: featCatColor,
              }}
            >
              {featCatLabel}
            </span>
            <span
              className="text-[17px] lg:text-[22px] lg:font-black"
              style={{
                fontWeight: 700,
                color: "var(--waaei-ink)",
                lineHeight: "var(--waaei-lh-snug)",
              }}
            >
              {featured.name}
            </span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
              {featured.estimatedMinutes} دقائق · {featured.questionsCount} أسئلة
            </span>
          </div>
        </div>
        {/* Desktop start button — TODO(copy): abbreviated "ابدأ" per spec; using canonical TestEngine string */}
        <div className="hidden lg:block mt-3">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 20px",
              background: "var(--waaei-accent)",
              color: "#fff",
              borderRadius: "var(--waaei-radius-pill)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ابدأ الاختبار
          </span>
        </div>
      </Link>

      {/* Alternate tests */}
      {alts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {alts.map((test) => (
            <Link key={test.slug} href={`/${test.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderTop: "1px solid var(--waaei-rule)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 28,
                    textAlign: "center",
                    fontSize: 22,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {test.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--waaei-ink)" }}>
                    {test.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--waaei-mute)" }}>
                    {test.estimatedMinutes} دقائق · {test.questionsCount} أسئلة
                  </div>
                </div>
                <span style={{ color: "var(--waaei-mute)", fontSize: 16, flexShrink: 0 }}>‹</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
