"use client";

import { useState } from "react";
import { TestConfig } from "@/lib/types";
import { calculateScore, getScoreRange } from "@/lib/scoring";
import { cn } from "@/lib/utils";

type Phase = "intro" | "test" | "results";

export function TestEngine({ config }: { config: TestConfig }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const question = config.questions[currentIndex];
  const totalQuestions = config.questions.length;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);
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

  function handleRetake() {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
    setSelected(null);
  }

  // ── INTRO ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="text-center">
          <span className="text-6xl">{config.icon}</span>
          <h1 className="text-3xl font-bold mt-4">{config.name}</h1>
          <p className="mt-3 text-lg leading-relaxed" style={{ color: "oklch(50% 0.01 270)" }}>
            {config.longDescription}
          </p>
        </div>

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

        <p className="text-xs text-center rounded-xl p-4 border" style={{ color: "oklch(50% 0.01 270)", borderColor: "oklch(91% 0.005 80)" }}>
          {config.disclaimer}
        </p>

        <button
          type="button"
          onClick={() => setPhase("test")}
          className="w-full text-lg py-4 rounded-2xl font-semibold text-white transition-colors"
          style={{ background: "oklch(62% 0.12 145)" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "oklch(55% 0.12 145)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "oklch(62% 0.12 145)")}
        >
          ابدأ الاختبار
        </button>
      </div>
    );
  }

  // ── TEST ─────────────────────────────────────────────────────────────
  if (phase === "test") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm" style={{ color: "oklch(50% 0.01 270)" }}>
            <span>{config.name}</span>
            <span>{currentIndex + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "oklch(91% 0.005 80)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, background: "oklch(62% 0.12 145)" }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl p-6 border shadow-sm" style={{ background: "oklch(100% 0 0)", borderColor: "oklch(91% 0.005 80)" }}>
          <p className="text-xl font-semibold leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-3">
          {config.answerOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected === option.value}
              onClick={() => setSelected(option.value)}
              className={cn(
                "w-full text-right px-5 py-4 rounded-2xl border-2 transition-all duration-150 text-base font-medium",
                selected === option.value
                  ? "border-sage-400 bg-sage-50 text-sage-700"
                  : "border-border bg-card text-foreground hover:border-sage-300 hover:bg-sage-50/50"
              )}
              style={
                selected === option.value
                  ? { borderColor: "oklch(62% 0.12 145)", background: "oklch(97% 0.02 145)", color: "oklch(39% 0.09 145)" }
                  : {}
              }
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          type="button"
          disabled={selected === null}
          onClick={handleNext}
          className="w-full py-4 rounded-2xl text-white font-semibold text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: selected === null ? "oklch(62% 0.12 145)" : "oklch(62% 0.12 145)" }}
          onMouseOver={(e) => { if (selected !== null) e.currentTarget.style.background = "oklch(55% 0.12 145)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "oklch(62% 0.12 145)"; }}
        >
          {isLast ? "عرض النتيجة" : "التالي"}
        </button>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────
  const finalScore = calculateScore(answers, config.questions, maxValue);
  const scoreRange = getScoreRange(finalScore, config);
  const maxScore = totalQuestions * maxValue;

  const severityStyles: Record<string, { bg: string; border: string }> = {
    none:         { bg: "oklch(97% 0.02 145)",  border: "oklch(78% 0.10 145)" },
    mild:         { bg: "oklch(98% 0.02 95)",   border: "oklch(85% 0.08 95)" },
    moderate:     { bg: "oklch(97% 0.03 55)",   border: "oklch(85% 0.08 55)" },
    moderateHigh: { bg: "oklch(98% 0.02 25)",   border: "oklch(87% 0.05 25)" },
    severe:       { bg: "oklch(97% 0.02 25)",   border: "oklch(82% 0.07 25)" },
  };
  const sStyle = severityStyles[scoreRange.severity] ?? severityStyles.none;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">نتيجتك</h2>
        <p className="mt-1" style={{ color: "oklch(50% 0.01 270)" }}>{config.name}</p>
      </div>

      {/* Score card */}
      <div
        className="rounded-2xl border-2 p-6 text-center flex flex-col gap-2"
        style={{ background: sStyle.bg, borderColor: sStyle.border }}
      >
        <span className="text-5xl font-bold">{finalScore}</span>
        <span className="text-sm" style={{ color: "oklch(50% 0.01 270)" }}>
          من أصل {maxScore} نقطة
        </span>
        <span className="text-xl font-semibold mt-2">{scoreRange.label}</span>
      </div>

      {/* Interpretation */}
      <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ background: "oklch(100% 0 0)", borderColor: "oklch(91% 0.005 80)" }}>
        <div>
          <h3 className="font-semibold mb-2">ماذا تعني هذه النتيجة؟</h3>
          <p className="leading-relaxed" style={{ color: "oklch(50% 0.01 270)" }}>{scoreRange.description}</p>
        </div>
        <div className="border-t pt-4" style={{ borderColor: "oklch(91% 0.005 80)" }}>
          <h3 className="font-semibold mb-2">ماذا تفعل الآن؟</h3>
          <p className="leading-relaxed" style={{ color: "oklch(50% 0.01 270)" }}>{scoreRange.recommendation}</p>
        </div>
      </div>

      {/* Affiliate link for higher severity */}
      {(scoreRange.severity === "severe" || scoreRange.severity === "moderateHigh") && (
        <a
          href="https://www.arabtherapy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-4 px-6 rounded-2xl text-white font-semibold text-base transition-colors"
          style={{ background: "oklch(62% 0.10 210)" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "oklch(55% 0.10 210)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "oklch(62% 0.10 210)")}
        >
          تحدث مع معالج نفسي عبر الإنترنت
        </a>
      )}

      {/* Retake */}
      <button
        type="button"
        onClick={handleRetake}
        className="w-full py-4 rounded-2xl font-medium text-base border-2 transition-colors"
        style={{ borderColor: "oklch(62% 0.12 145)", color: "oklch(55% 0.12 145)", background: "transparent" }}
        onMouseOver={(e) => (e.currentTarget.style.background = "oklch(97% 0.02 145)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
      >
        إعادة الاختبار
      </button>

      <p className="text-xs text-center rounded-xl p-3 border" style={{ color: "oklch(50% 0.01 270)", borderColor: "oklch(91% 0.005 80)" }}>
        {config.disclaimer}
      </p>
    </div>
  );
}
