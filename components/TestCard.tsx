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

export function TestCard({ config }: { config: TestConfig }) {
  const catColor = categoryColorMap[config.category];
  const catLabel = categoryLabel[config.category];

  return (
    <Link href={`/${config.slug}`} className="group block h-full">
      <div
        className="h-full flex flex-col cursor-pointer transition-all duration-[180ms] hover:-translate-y-0.5"
        style={{
          background: "var(--waaei-surface)",
          borderRadius: "var(--waaei-radius-md)",
          border: "1px solid var(--waaei-rule)",
          padding: 14,
          gap: 12,
          minHeight: 130,
          boxShadow: "var(--waaei-shadow-card)",
        }}
      >
        {/* Top: emoji + category label */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{config.icon}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: catColor,
              background: catColor + "20",
              padding: "2px 8px",
              borderRadius: "var(--waaei-radius-pill)",
              whiteSpace: "nowrap",
            }}
          >
            {catLabel}
          </span>
        </div>

        {/* Name */}
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "var(--waaei-text-lg)",
              fontWeight: 700,
              color: "var(--waaei-ink)",
              lineHeight: "var(--waaei-lh-snug)",
            }}
          >
            {config.name}
          </h2>
        </div>

        {/* Bottom: meta + chevron */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            borderTop: "1px solid var(--waaei-rule)",
          }}
        >
          <span style={{ fontSize: 11, color: "var(--waaei-mute)" }}>
            {config.estimatedMinutes} دقائق · {config.questions.length} أسئلة
          </span>
          <span style={{ color: "var(--waaei-mute)", fontSize: 14 }}>‹</span>
        </div>
      </div>
    </Link>
  );
}
