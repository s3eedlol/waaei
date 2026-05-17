export interface Question {
  id: number;
  text: string;
  reversed?: boolean; // for PSS items that score inversely
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
  category: "mood" | "anxiety" | "work" | "stress" | "ocd";
  icon: string; // emoji used on cards
}
