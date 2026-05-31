import { describe, it, expect } from "vitest";
import { calculateScore, getScoreRange } from "@/lib/scoring";
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

describe("conditionDescription", () => {
  const allConfigs = [
    phq9Config, gad7Config, burnoutConfig, pssConfig, ocirConfig,
    asrs5Config, pcl5Config, isiConfig, rsesConfig, spinConfig,
    bfi10Config, ecrsConfig, sassvConfig, beis10Config, uls8Config,
    staxiConfig, eat7Config, mdqConfig, dass21Config, bpniConfig,
    psqiConfig, ptgiConfig, auditcConfig,
  ];

  it("every test config has a non-empty conditionDescription", () => {
    for (const config of allConfigs) {
      expect(
        config.conditionDescription,
        `${config.id} is missing conditionDescription`
      ).toBeTruthy();
      expect(config.conditionDescription!.length).toBeGreaterThan(50);
    }
  });
});
