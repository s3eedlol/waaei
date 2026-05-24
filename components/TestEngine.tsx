"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TestConfig } from "@/lib/types";
import { calculateScore, getScoreRange } from "@/lib/scoring";
import { parseScoreParam } from "@/lib/parseScoreParam";

type Phase = "intro" | "test" | "results";

type RelatedTest = { name: string; slug: string };

export function TestEngine({ config, compact = false, relatedTests }: { config: TestConfig; compact?: boolean; relatedTests?: RelatedTest[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sharedScore, setSharedScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Scroll overlay to top on each question advance
  useEffect(() => {
    if (phase === "test") overlayRef.current?.scrollTo({ top: 0 });
  }, [phase, currentIndex]);

  useEffect(() => {
    const max = config.questions.length * (config.answerOptions.length - 1);
    const parsed = parseScoreParam(window.location.search, max);
    if (parsed !== null) {
      setSharedScore(parsed);
      setPhase("results");
    }
  }, [config]);

  const question = config.questions[currentIndex];
  const totalQuestions = config.questions.length;
  const isLast = currentIndex === totalQuestions - 1;
  const maxValue = config.answerOptions.length - 1;

  function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (isLast) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handlePrev() {
    const newAnswers = selected !== null ? { ...answers, [question.id]: selected } : answers;
    setAnswers(newAnswers);
    if (currentIndex === 0) {
      setPhase("intro");
      setSelected(null);
      return;
    }
    const prevIdx = currentIndex - 1;
    setSelected(newAnswers[config.questions[prevIdx].id] ?? null);
    setCurrentIndex(prevIdx);
  }

  function handleClose() {
    setPhase("intro");
    setSelected(null);
  }

  function handleRetake() {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
    setSelected(null);
  }

  // ── INTRO ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div
        className="max-w-2xl mx-auto px-[22px] flex flex-col gap-4"
        style={{ paddingBottom: 28 }}
      >
        {/* Non-compact: legacy icon/title/description/info-card (not used in production) */}
        {!compact && (
          <div className="text-center">
            <span className="text-6xl">{config.icon}</span>
            <h1 className="text-3xl font-bold mt-4">{config.name}</h1>
            <p className="mt-3 text-lg leading-relaxed" style={{ color: "oklch(50% 0.01 270)" }}>
              {config.longDescription}
            </p>
          </div>
        )}

        {!compact && (
          <div className="rounded-2xl p-5 flex flex-col gap-3 text-sm" style={{ background: "oklch(96% 0.005 80)", color: "oklch(50% 0.01 270)" }}>
            <div className="flex items-center gap-2">
              <span>⏱</span>
              <span>المدة التقديرية: {config.estimatedMinutes} دقائق</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>سري تماماً — لا يُحفظ أي شيء</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span>{totalQuestions} أسئلة</span>
            </div>
          </div>
        )}

        {/* CTA — full-width ink button (spec: 16px padding, radius 16, shadow-cta) */}
        <button
          type="button"
          onClick={() => setPhase("test")}
          className="w-full font-bold transition-colors"
          style={{
            padding: 16,
            borderRadius: 16,
            fontSize: 16,
            color: "var(--waaei-surface)",
            background: "var(--waaei-ink)",
            border: "none",
            boxShadow: "var(--waaei-shadow-cta)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ابدأ الاختبار
          <span aria-hidden="true">←</span>
        </button>

        {/* Disclaimer — below CTA with top rule */}
        <p
          style={{
            fontSize: 11,
            color: "var(--waaei-mute)",
            lineHeight: "var(--waaei-lh-body)",
            borderTop: "1px solid var(--waaei-rule)",
            paddingTop: 16,
            textAlign: "center",
          }}
        >
          {config.disclaimer}
        </p>
      </div>
    );
  }

  // ── TEST ─────────────────────────────────────────────────────────────
  if (phase === "test") {
    return (
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--waaei-bg)",
          zIndex: 200,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar: close + dot progress + counter */}
        <div
          style={{
            padding: "12px 18px 6px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Close → always exits to intro */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="إغلاق"
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: "var(--waaei-surface)",
              border: "1px solid var(--waaei-rule)",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 2l8 8M10 2l-8 8" stroke="var(--waaei-ink)" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Dot progress */}
          <div style={{ flex: 1, display: "flex", gap: 5, alignItems: "center" }}>
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const done = i < currentIndex;
              const here = i === currentIndex;
              return (
                <div
                  key={i}
                  style={{
                    flex: here ? "0 0 28px" : 1,
                    height: 4,
                    borderRadius: 2,
                    background: here || done ? "var(--waaei-ink)" : "var(--waaei-rule)",
                    opacity: done ? 0.55 : 1,
                    transition: "all .25s",
                  }}
                />
              );
            })}
          </div>

          {/* Step counter */}
          <div
            dir="ltr"
            style={{
              fontSize: 11,
              color: "var(--waaei-mute)",
              fontWeight: 700,
              flexShrink: 0,
              minWidth: 32,
              textAlign: "right",
            }}
          >
            {currentIndex + 1} / {totalQuestions}
          </div>
        </div>

        {/* Question */}
        <div style={{ padding: "32px 26px 0" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.4,
              letterSpacing: -0.3,
              color: "var(--waaei-ink)",
            }}
          >
            {question.text}
          </h2>
        </div>

        {/* Answer choices */}
        <div
          style={{
            padding: "36px 22px 0",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {config.answerOptions.map((option) => {
            const sel = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={sel}
                onClick={() => setSelected(option.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px",
                  background: sel ? "var(--waaei-ink)" : "var(--waaei-surface)",
                  color: sel ? "var(--waaei-bg)" : "var(--waaei-ink)",
                  border: sel ? "1px solid var(--waaei-ink)" : "1px solid var(--waaei-rule)",
                  borderRadius: 16,
                  cursor: "pointer",
                  textAlign: "right",
                  width: "100%",
                  transition: "all .15s",
                  boxShadow: sel ? "var(--waaei-shadow-cta)" : "0 1px 0 rgba(0,0,0,0.02)",
                }}
              >
                {/* Value circle */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: sel ? "rgba(255,255,255,0.15)" : "var(--waaei-bg)",
                    border: sel ? "1px solid rgba(255,255,255,0.25)" : "1px solid var(--waaei-rule)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {option.value}
                </div>
                {/* Label */}
                <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>
                  {option.label}
                </div>
                {/* Checkmark when selected */}
                {sel && (
                  <svg width="16" height="12" viewBox="0 0 16 12" style={{ flexShrink: 0 }}>
                    <path
                      d="M2 6l4 4 8-8"
                      stroke="var(--waaei-bg)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom nav: السابق + التالي */}
        <div
          style={{
            padding: "32px 22px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }} />
          {/* السابق */}
          <button
            type="button"
            onClick={handlePrev}
            style={{
              padding: "14px 18px",
              background: "var(--waaei-surface)",
              color: "var(--waaei-ink)",
              border: "1px solid var(--waaei-rule)",
              borderRadius: 999,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M4 2l4 4-4 4" stroke="var(--waaei-ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            السابق
          </button>
          {/* التالي / عرض النتيجة */}
          <button
            type="button"
            disabled={selected === null}
            onClick={handleNext}
            style={{
              padding: "14px 22px",
              background: "var(--waaei-ink)",
              color: "var(--waaei-bg)",
              border: "none",
              borderRadius: 999,
              cursor: selected === null ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: selected === null ? 0.4 : 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "opacity .15s",
            }}
          >
            {isLast ? "عرض النتيجة" : "التالي"}
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M8 2L4 6l4 4" stroke="var(--waaei-bg)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────
  const finalScore = sharedScore ?? calculateScore(answers, config.questions, maxValue);
  const scoreRange = getScoreRange(finalScore, config);
  const maxScore = totalQuestions * maxValue;
  const totalPossible = maxScore + 1; // number of possible values (0..maxScore)

  const bandColor: Record<string, string> = {
    none:         "#9ec79f",
    mild:         "#d8c879",
    moderate:     "#d8a26b",
    moderateHigh: "#cf6f4d",
    severe:       "#a8392b",
  };

  const catColor: Record<string, string> = {
    mood:        "#5e7bbf",
    anxiety:     "#d0a236",
    ocd:         "#d0a236",
    work:        "#c25940",
    stress:      "#c25940",
    personality: "#9c7bb8",
  };
  const currentBandColor = bandColor[scoreRange.severity] ?? "#9ec79f";
  const currentCatColor  = catColor[config.category] ?? "#5e7bbf";

  const shareUrl = `${window.location.origin}/${config.slug}?score=${finalScore}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function drawResultsCard(): Promise<Blob> {
    // Full implementation in Task 4
    const c = document.createElement("canvas");
    c.width = 1; c.height = 1;
    return new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
  }

  async function handleDownload() {
    const blob = await drawResultsCard();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "نتائجي-واعي.png";
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  async function handleShare() {
    const blob = await drawResultsCard();
    const file = new File([blob], "نتائجي-واعي.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        text: `نتائجي على واعي: ${scoreRange.label}`,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--waaei-bg)",
        zIndex: 200,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 560, width: "100%", paddingBottom: 40 }}>

        {/* Top bar */}
        <div style={{ padding: "12px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleRetake}
            aria-label="العودة"
            style={{
              width: 38, height: 38, borderRadius: 999,
              background: "var(--waaei-surface)", border: "1px solid var(--waaei-rule)",
              padding: 0, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M5 2l5 5-5 5" stroke="var(--waaei-ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ fontSize: 11, color: "var(--waaei-mute)", letterSpacing: 1.5, fontWeight: 700 }}>النتيجة</div>
          <div style={{ width: 38, height: 38 }} />
        </div>

        {/* Hero score */}
        <div style={{ padding: "24px 22px 8px" }}>
          {/* Category pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: 999,
            background: `${currentCatColor}1f`, color: currentCatColor,
            fontSize: 10, fontWeight: 700, letterSpacing: 1.4, marginBottom: 14,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: currentCatColor }} />
            {config.name}
          </div>

          {/* Big numeral + max */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
            <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3, color: "var(--waaei-ink)" }}>
              {finalScore}
            </div>
            <div style={{ fontSize: 18, color: "var(--waaei-mute)", fontWeight: 600 }}>/ {maxScore}</div>
          </div>

          {/* Band label */}
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3, letterSpacing: -0.3, color: "var(--waaei-ink)" }}>
            أعراض <span style={{ color: currentBandColor }}>{scoreRange.label}</span>
          </div>
        </div>

        {/* Scale visualization */}
        <div style={{ padding: "22px 22px 0" }}>
          <div style={{
            background: "var(--waaei-surface)", borderRadius: 18,
            padding: 18, border: "1px solid var(--waaei-rule)",
          }}>
            <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 700, marginBottom: 14, letterSpacing: 1 }}>
              أين تقع درجتك
            </div>

            {/* Scale strip + marker — RTL: right=0 (green), left=max (red) */}
            <div style={{ position: "relative", height: 46 }}>
              <div style={{ display: "flex", gap: 3, position: "absolute", top: 24, left: 0, right: 0 }}>
                {config.scoreRanges.map((band, i) => {
                  const w = ((band.max - band.min + 1) / totalPossible) * 100;
                  const lastIdx = config.scoreRanges.length - 1;
                  const active = band.severity === scoreRange.severity;
                  return (
                    <div key={i} style={{
                      width: `${w}%`, height: 8,
                      borderRadius: i === 0 ? "4px 1px 1px 4px" : i === lastIdx ? "1px 4px 4px 1px" : 2,
                      background: bandColor[band.severity] ?? "#9ec79f",
                      opacity: active ? 1 : 0.35,
                    }} />
                  );
                })}
              </div>
              {/* "أنت" marker — right % aligns with RTL scale */}
              <div style={{
                position: "absolute", top: 0,
                right: `${(finalScore / maxScore) * 100}%`,
                transform: "translateX(50%)",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 2,
              }}>
                <div style={{
                  background: "var(--waaei-ink)", color: "var(--waaei-bg)",
                  padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                  whiteSpace: "nowrap",
                }}>أنت</div>
                <div style={{
                  width: 0, height: 0,
                  borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
                  borderTop: "5px solid var(--waaei-ink)",
                }} />
              </div>
            </div>

            {/* Min / max labels — 0 on right (green end), max on left (red end) */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "var(--waaei-mute)", fontWeight: 600 }}>
              <span>0</span>
              <span>{maxScore}</span>
            </div>

            {/* Legend */}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--waaei-rule)", display: "flex", flexDirection: "column", gap: 6 }}>
              {config.scoreRanges.map((band, i) => {
                const active = band.severity === scoreRange.severity;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: active ? 1 : 0.5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: bandColor[band.severity] ?? "#9ec79f", flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 12, fontWeight: active ? 700 : 500 }}>{band.label}</div>
                    <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 600 }}>{band.min}–{band.max}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div style={{ margin: "22px 22px 0", padding: 18, background: "var(--waaei-surface)", borderRadius: 18, border: "1px solid var(--waaei-rule)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ماذا تعني هذه النتيجة؟</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--waaei-ink)" }}>{scoreRange.description}</p>
          </div>
          <div style={{ borderTop: "1px solid var(--waaei-rule)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ماذا تفعل الآن؟</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--waaei-ink)" }}>{scoreRange.recommendation}</p>
          </div>
        </div>

        {/* Share block */}
        <div style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 700, letterSpacing: 1 }}>
            شارك نتائجك
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                flex: 1, padding: "12px 4px",
                background: "var(--waaei-surface)", color: "var(--waaei-ink)",
                border: "1px solid var(--waaei-rule)", borderRadius: 12,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}
            >
              <span style={{ fontSize: 18 }}>⬇</span>
              حفظ كصورة
            </button>
            <button
              type="button"
              onClick={handleShare}
              style={{
                flex: 1, padding: "12px 4px",
                background: "var(--waaei-surface)", color: "var(--waaei-ink)",
                border: "1px solid var(--waaei-rule)", borderRadius: 12,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}
            >
              <span style={{ fontSize: 18 }}>↗</span>
              مشاركة
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                flex: 1, padding: "12px 4px",
                background: copied ? "var(--waaei-ink)" : "var(--waaei-surface)",
                color: copied ? "var(--waaei-bg)" : "var(--waaei-ink)",
                border: copied ? "1px solid var(--waaei-ink)" : "1px solid var(--waaei-rule)",
                borderRadius: 12,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                transition: "all .2s",
              }}
            >
              <span style={{ fontSize: 18 }}>{copied ? "✓" : "🔗"}</span>
              {copied ? "تم النسخ" : "نسخ الرابط"}
            </button>
          </div>
        </div>

        {/* Retake + Home */}
        <div style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={handleRetake}
            style={{
              width: "100%", padding: 14,
              background: "var(--waaei-surface)", color: "var(--waaei-ink)",
              border: "1px solid var(--waaei-rule)", borderRadius: 14,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M12 7a5 5 0 11-1.4-3.5L12 5M12 1.5v3.5h-3.5" stroke="var(--waaei-ink)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            أعد الاختبار
          </button>
          <Link
            href="/"
            style={{
              width: "100%", padding: 14,
              background: "var(--waaei-ink)", color: "var(--waaei-bg)",
              border: "none", borderRadius: 14,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              textDecoration: "none",
              boxShadow: "var(--waaei-shadow-cta)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M7 1L1 7l6 6M1 7h12" stroke="var(--waaei-bg)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            جميع الاختبارات
          </Link>
        </div>

        {/* Related tests */}
        {relatedTests && relatedTests.length > 0 && (
          <div style={{ padding: "18px 22px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 700, letterSpacing: 1 }}>قد يهمك أيضاً</div>
            {relatedTests.map((t) => (
              <a
                key={t.slug}
                href={`/${t.slug}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 12,
                  border: "1px solid var(--waaei-rule)",
                  background: "var(--waaei-surface)",
                  fontSize: 13, fontWeight: 600, color: "var(--waaei-ink)",
                  textDecoration: "none",
                }}
              >
                <span>{t.name}</span>
                <span style={{ color: "var(--waaei-mute)", fontSize: 16 }}>←</span>
              </a>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          margin: "22px 22px 0", padding: "14px 0",
          borderTop: "1px solid var(--waaei-rule)",
          fontSize: 11, color: "var(--waaei-mute)", lineHeight: 1.7,
        }}>
          {config.disclaimer}
        </div>

      </div>
    </div>
  );
}
