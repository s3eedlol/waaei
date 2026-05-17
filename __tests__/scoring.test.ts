import { describe, it, expect } from "vitest";
import { calculateScore, getScoreRange } from "@/lib/scoring";
import { phq9Config } from "@/lib/tests/phq9";

describe("calculateScore", () => {
  it("sums all answer values", () => {
    const answers = { 1: 3, 2: 2, 3: 1, 4: 0, 5: 2, 6: 1, 7: 3, 8: 1, 9: 0 };
    expect(calculateScore(answers)).toBe(13);
  });

  it("returns 0 for all zeros", () => {
    const answers = { 1: 0, 2: 0, 3: 0 };
    expect(calculateScore(answers)).toBe(0);
  });

  it("handles reversed items (PSS)", () => {
    // item 1 is normal (value=3 → 3), item 2 is reversed (value=2 → reversed: 4-2=2)
    const answers = { 1: 3, 2: 2 };
    const questions = [
      { id: 1, text: "q1" },
      { id: 2, text: "q2", reversed: true },
    ];
    expect(calculateScore(answers, questions, 4)).toBe(5); // 3 + (4-2)
  });
});

describe("getScoreRange", () => {
  it("returns mild range for PHQ-9 score 7", () => {
    const range = getScoreRange(7, phq9Config);
    expect(range.severity).toBe("mild");
  });

  it("returns severe range for PHQ-9 score 22", () => {
    const range = getScoreRange(22, phq9Config);
    expect(range.severity).toBe("severe");
  });

  it("returns none range for PHQ-9 score 0", () => {
    const range = getScoreRange(0, phq9Config);
    expect(range.severity).toBe("none");
  });
});
