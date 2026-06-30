export interface Question {
  id: number;
  text: string;
  reversed?: boolean; // for PSS items that score inversely
  options?: AnswerOption[]; // per-question options (e.g. EPDS — each item has its own response phrases); falls back to TestConfig.answerOptions
}

export interface AnswerOption {
  label: string;
  value: number;
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  severity: "none" | "mild" | "moderate" | "moderateHigh" | "severe";
  description: string;
  recommendation: string;
  color: string; // Tailwind bg+border classes for result card accent
}

export interface TestConfig {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  estimatedMinutes: number;
  questions: Question[];
  answerOptions: AnswerOption[];
  scoreRanges: ScoreRange[];
  disclaimer: string;
  category: "mood" | "anxiety" | "work" | "stress" | "ocd" | "personality";
  icon: string; // emoji used on cards
  conditionName?: string;
  conditionDescription?: string;
  affiliateUrl?: string;
  affiliateCta?: string;
  // Per-test answer-first Q&A appended to the FAQ section. String answers only
  // (so they flow into both the crawlable <details> DOM and the FAQPage JSON-LD).
  // Used to target winnable long-tail/variant queries + AIO citation. See app/[test]/page.tsx.
  extraFaqs?: { q: string; a: string }[];
}
