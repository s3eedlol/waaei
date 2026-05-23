import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestCard } from "@/components/TestCard";
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
import { TestConfig } from "@/lib/types";

type Section = { title: string; tests: TestConfig[]; color: string };

const sections: Section[] = [
  {
    title: "الاكتئاب والمزاج",
    color: "var(--waaei-cat-depression)",
    tests: [phq9Config, mdqConfig, dass21Config, rsesConfig, beis10Config, staxiConfig, eat7Config, ptgiConfig, psqiConfig, auditcConfig],
  },
  {
    title: "القلق والخوف",
    color: "var(--waaei-cat-anxiety)",
    tests: [gad7Config, spinConfig, pcl5Config, ocirConfig],
  },
  {
    title: "التوتر والإرهاق",
    color: "var(--waaei-cat-stress)",
    tests: [pssConfig, burnoutConfig, isiConfig, asrs5Config, sassvConfig],
  },
  {
    title: "الشخصية والعلاقات",
    color: "var(--waaei-cat-personality)",
    tests: [bfi10Config, ecrsConfig, uls8Config, bpniConfig],
  },
];

const totalTests = sections.reduce((n, s) => n + s.tests.length, 0);

export function AllTestsPage() {
  return (
    <div style={{ minHeight: "100svh", background: "var(--waaei-bg)", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="flex-1 mx-auto w-full px-[22px] py-[32px] pb-[64px] lg:px-[56px] lg:py-[48px] lg:pb-[80px]" style={{ maxWidth: 1280 }}>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="text-[22px] lg:text-[32px] font-black" style={{ margin: 0, color: "var(--waaei-ink)", letterSpacing: -0.5 }}>
            جميع الاختبارات
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--waaei-mute)" }}>
            {totalTests} اختباراً نفسياً مجانياً وسرياً — مبنياً على مقاييس علمية
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-[40px] lg:gap-[56px]">
          {sections.map((section) => (
            <section key={section.title} id={section.title.replace(/\s+/g, "-")}>
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: section.color, flexShrink: 0 }} />
                <h2 className="text-[15px] lg:text-[22px] font-black shrink-0" style={{ color: "var(--waaei-ink)" }}>
                  {section.title}
                </h2>
                <div style={{ flex: 1, height: 1, background: "var(--waaei-rule)" }} />
                <span className="shrink-0" style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
                  {section.tests.length} اختبار
                </span>
              </div>

              {/* Test grid: 2-col mobile → 3-col tablet → 4-col desktop */}
              <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {section.tests.map((test) => (
                  <TestCard key={test.slug} config={test} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
