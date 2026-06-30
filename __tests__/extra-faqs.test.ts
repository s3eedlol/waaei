import { describe, it, expect } from "vitest";
import type { TestConfig } from "@/lib/types";
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
import { epdsConfig } from "@/lib/tests/epds";

const allConfigs: TestConfig[] = [
  phq9Config, gad7Config, burnoutConfig, pssConfig, ocirConfig, asrs5Config,
  pcl5Config, isiConfig, rsesConfig, spinConfig, bfi10Config, ecrsConfig,
  sassvConfig, beis10Config, uls8Config, staxiConfig, eat7Config, mdqConfig,
  dass21Config, bpniConfig, psqiConfig, ptgiConfig, auditcConfig, epdsConfig,
];

describe("extraFaqs content integrity", () => {
  for (const config of allConfigs) {
    const faqs = config.extraFaqs;
    if (!faqs) continue;

    describe(`${config.slug}`, () => {
      it("is a non-empty array", () => {
        expect(Array.isArray(faqs)).toBe(true);
        expect(faqs.length).toBeGreaterThan(0);
      });

      it("every question is a real question ending in ؟", () => {
        for (const f of faqs) {
          expect(typeof f.q).toBe("string");
          expect(f.q.trim().length).toBeGreaterThan(8);
          expect(f.q.trim().endsWith("؟")).toBe(true);
        }
      });

      it("every answer is a substantive string (answer-first depth)", () => {
        for (const f of faqs) {
          expect(typeof f.a).toBe("string");
          // answer-first content should carry real depth, not a one-liner
          expect(f.a.trim().length).toBeGreaterThanOrEqual(60);
        }
      });

      it("has no leftover HTML entities or placeholder artifacts", () => {
        for (const f of faqs) {
          const blob = f.q + " " + f.a;
          expect(blob).not.toMatch(/&quot;|&amp;|&#39;|&lt;|&gt;/);
          expect(blob).not.toMatch(/undefined|null|TODO|\bNaN\b/);
        }
      });

      it("has unique questions", () => {
        const qs = faqs.map((f) => f.q.trim());
        expect(new Set(qs).size).toBe(qs.length);
      });
    });
  }
});

describe("priority pages are enriched with extraFaqs", () => {
  // These are the buried-below-difficulty pages targeted for impression growth.
  // The depression page is the single biggest waaei opportunity (head buried at
  // p90 with real latent demand) — its winnable variants live in extraFaqs.
  const enriched: [string, TestConfig][] = [
    ["depression (PHQ-9)", phq9Config],
    ["emotional intelligence (BEIS-10)", beis10Config],
    ["OCD (OCI-R)", ocirConfig],
    ["self-esteem (RSES)", rsesConfig],
    ["loneliness (ULS-8)", uls8Config],
    ["burnout", burnoutConfig],
  ];
  for (const [label, config] of enriched) {
    it(`${label} page has at least 3 extraFaqs`, () => {
      expect(config.extraFaqs?.length ?? 0).toBeGreaterThanOrEqual(3);
    });
  }
});
