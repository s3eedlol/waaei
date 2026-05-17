"use client";

import { useState } from "react";
import { TestConfig } from "@/lib/types";
import { calculateScore, getScoreRange } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Phase = "intro" | "test" | "results";

export function TestEngine({ config }: { config: TestConfig }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const question = config.questions[currentIndex];
  const totalQuestions = config.questions.length;
  const progress = (currentIndex / totalQuestions) * 100;
  const isLast = currentIndex === totalQuestions - 1;
  const maxValue = config.answerOptions.length - 1;

  const score = calculateScore(answers, config.questions, maxValue);
  const scoreRange = phase === "results" ? getScoreRange(score, config) : null;

  function handleAnswer(value: number) {
    setSelected(value);
  }

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

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="text-center">
          <span className="text-6xl">{config.icon}</span>
          <h1 className="text-3xl font-bold mt-4 text-foreground">{config.name}</h1>
          <p className="mt-3 text-muted-foreground text-lg leading-relaxed">
            {config.longDescription}
          </p>
        </div>

        <div className="bg-muted rounded-2xl p-5 flex flex-col gap-3 text-sm text-muted-foreground">
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

        <p className="text-xs text-muted-foreground text-center border border-border rounded-xl p-4">
          {config.disclaimer}
        </p>

        <Button
          size="lg"
          className="w-full text-lg py-6 rounded-2xl bg-sage-400 hover:bg-sage-500 text-white"
          onClick={() => setPhase("test")}
        >
          ابدأ الاختبار
        </Button>
      </div>
    );
  }

  if (phase === "test") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{config.name}</span>
            <span>
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-xl font-semibold leading-relaxed text-foreground">
            {question.text}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {config.answerOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                "w-full text-right px-5 py-4 rounded-2xl border-2 transition-all duration-150 text-base font-medium",
                selected === option.value
                  ? "border-sage-400 bg-sage-50 text-sage-700"
                  : "border-border bg-card text-foreground hover:border-sage-300 hover:bg-sage-50/50"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full py-6 rounded-2xl bg-sage-400 hover:bg-sage-500 text-white text-lg disabled:opacity-40"
          disabled={selected === null}
          onClick={handleNext}
        >
          {isLast ? "عرض النتيجة" : "التالي"}
        </Button>
      </div>
    );
  }

  // Results phase
  const maxScore = totalQuestions * maxValue;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">نتيجتك</h2>
        <p className="text-muted-foreground mt-1">{config.name}</p>
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 p-6 text-center flex flex-col gap-2",
          scoreRange?.color
        )}
      >
        <span className="text-5xl font-bold text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground">
          من أصل {maxScore} نقطة
        </span>
        <span className="text-xl font-semibold mt-2">{scoreRange?.label}</span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2">ماذا تعني هذه النتيجة؟</h3>
          <p className="text-muted-foreground leading-relaxed">{scoreRange?.description}</p>
        </div>
        <div className="border-t border-border pt-4">
          <h3 className="font-semibold text-foreground mb-2">ماذا تفعل الآن؟</h3>
          <p className="text-muted-foreground leading-relaxed">{scoreRange?.recommendation}</p>
        </div>
      </div>

      {(scoreRange?.severity === "severe" || scoreRange?.severity === "moderateHigh") && (
        <a
          href="https://www.arabtherapy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-4 px-6 rounded-2xl bg-mist-400 hover:bg-mist-500 text-white font-semibold text-base transition-colors"
        >
          تحدث مع معالج نفسي عبر الإنترنت
        </a>
      )}

      <Button
        variant="outline"
        size="lg"
        className="w-full py-5 rounded-2xl text-base"
        onClick={handleRetake}
      >
        إعادة الاختبار
      </Button>

      <p className="text-xs text-center text-muted-foreground border border-border rounded-xl p-3">
        {config.disclaimer}
      </p>
    </div>
  );
}
