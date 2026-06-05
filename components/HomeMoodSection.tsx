"use client";

import { useState } from "react";
import { MoodSelector } from "./MoodSelector";
import { RecommendationCard, RecommendedTestItem } from "./RecommendationCard";
import { TrustBadges } from "./TrustBadges";

// Strings pulled verbatim from existing app/page.tsx trust badge section
const TRUST_BADGES = [
  { emoji: "🔒", label: "سري تماماً" },
  { emoji: "✓",  label: "مبني على مقاييس علمية" },
  { emoji: "🆓", label: "مجاني بالكامل" },
];

export function HomeMoodSection({
  moodRecommendations,
}: {
  moodRecommendations: RecommendedTestItem[][];
}) {
  const [mood, setMood] = useState(0);
  const currentTests = moodRecommendations[mood] ?? moodRecommendations[0];

  return (
    <section
      className="px-[22px] pt-[14px] pb-[24px] lg:px-[56px] lg:pt-[64px] lg:pb-[56px]"
      style={{ background: "var(--waaei-bg)" }}
    >
      <div
        className="mx-auto lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-[56px]"
        style={{ maxWidth: 1280 }}
      >
        {/* Left column: hero copy + mood selector */}
        <div>
          {/* H1 — text pulled from existing page.tsx; accent on النفسية per spec */}
          <h1
            className="text-[30px] lg:text-[60px] font-black leading-[1.25] lg:leading-[1.1] tracking-[-0.5px] lg:tracking-[-1.4px]"
            style={{ color: "var(--waaei-ink)" }}
          >
            كيف صحتك{" "}
            <span style={{ color: "var(--waaei-accent)" }}>النفسية</span>{" "}
            اليوم؟
          </h1>

          {/* Subtitle — verbatim from existing app/page.tsx */}
          <p
            className="mt-3 text-[13px] lg:text-[17px] lg:max-w-[520px]"
            style={{ color: "var(--waaei-mute)", lineHeight: "var(--waaei-lh-body)" }}
          >
            24 اختباراً علمياً مجانياً وسرياً تماماً — بدون تسجيل، بدون حفظ بيانات.
            فهم ما تشعر به هو الخطوة الأولى.
          </p>

          {/* Trust badges — responsive size via wrapper show/hide */}
          <div className="mt-[18px] lg:mt-[26px]">
            <div className="lg:hidden">
              <TrustBadges items={TRUST_BADGES} size="sm" />
            </div>
            <div className="hidden lg:block">
              <TrustBadges items={TRUST_BADGES} size="md" />
            </div>
          </div>

          {/* Mood selector section */}
          <div className="mt-[22px] lg:mt-[36px]">
            {/* Mobile: simple label */}
            <p
              className="lg:hidden mb-3"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--waaei-mute)",
              }}
            >
              كيف تشعر الآن؟
            </p>
            {/* Desktop: top rule + label */}
            <div
              className="hidden lg:block"
              style={{
                borderTop: "1px solid var(--waaei-rule)",
                paddingTop: 24,
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--waaei-mute)",
                  marginBottom: 10,
                }}
              >
                كيف تشعر الآن؟
              </p>
            </div>
            <MoodSelector value={mood} onChange={setMood} />
          </div>
        </div>

        {/* Right column: recommendation card (desktop only) */}
        <div className="hidden lg:block">
          <RecommendationCard tests={currentTests} />
        </div>
      </div>

      {/* Mobile recommendation card — below the hero block */}
      <div className="lg:hidden mt-4">
        <RecommendationCard tests={currentTests} />
      </div>
    </section>
  );
}
