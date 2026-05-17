import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { phq9Config } from "@/lib/tests/phq9";
import { gad7Config } from "@/lib/tests/gad7";
import { burnoutConfig } from "@/lib/tests/burnout";
import { pssConfig } from "@/lib/tests/pss";
import { ocirConfig } from "@/lib/tests/ocir";
import { TestConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

const testsBySlug: Record<string, TestConfig> = {
  "اختبار-الاكتئاب": phq9Config,
  "اختبار-القلق": gad7Config,
  "اختبار-الإرهاق-الوظيفي": burnoutConfig,
  "اختبار-التوتر": pssConfig,
  "اختبار-الوسواس-القهري": ocirConfig,
};

const metaBySlug: Record<string, { title: string; description: string; keywords: string[] }> = {
  "اختبار-الاكتئاب": {
    title: "اختبار الاكتئاب — PHQ-9 بالعربي",
    description: "اختبر نفسك بمقياس PHQ-9 المُتحقَّق منه طبياً. هل أنا مصاب بالاكتئاب؟ اكتشف بشكل سري ومجاني.",
    keywords: ["اختبار الاكتئاب", "هل أنا مصاب بالاكتئاب", "PHQ-9 عربي", "أعراض الاكتئاب اختبار"],
  },
  "اختبار-القلق": {
    title: "اختبار القلق النفسي — GAD-7 بالعربي",
    description: "اختبر مستوى قلقك بمقياس GAD-7 العلمي. هل لدي قلق مزمن؟ اكتشف بشكل سري ومجاني.",
    keywords: ["اختبار القلق النفسي", "هل لدي قلق مزمن", "GAD-7 عربي", "اضطراب القلق العام"],
  },
  "اختبار-الإرهاق-الوظيفي": {
    title: "اختبار الإرهاق الوظيفي — هل أنا محترق وظيفياً؟",
    description: "اختبر نفسك للكشف عن الاحتراق الوظيفي. أعراض الاحتراق النفسي في العمل — اكتشف مستواك بسرية تامة.",
    keywords: ["اختبار الإرهاق الوظيفي", "هل أنا محترق وظيفياً", "أعراض الاحتراق النفسي"],
  },
  "اختبار-التوتر": {
    title: "اختبار التوتر النفسي — كيف مستوى ضغطك؟",
    description: "اختبر مستوى التوتر النفسي بمقياس PSS-10 العلمي. كيف أعرف مستوى ضغطي النفسي؟",
    keywords: ["اختبار مستوى التوتر", "كيف أعرف مستوى ضغطي النفسي", "PSS عربي"],
  },
  "اختبار-الوسواس-القهري": {
    title: "اختبار الوسواس القهري — OCI-R بالعربي",
    description: "هل لدي وسواس قهري؟ اختبر نفسك بمقياس OCI-R العلمي المُتحقَّق منه. نتائج سرية ومجانية.",
    keywords: ["اختبار الوسواس القهري", "هل لدي وسواس قهري", "OCD اختبار بالعربي"],
  },
};

type Props = { params: Promise<{ test: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { test } = await params;
  const slug = decodeURIComponent(test);
  const meta = metaBySlug[slug];
  if (!meta) return {};
  return { title: meta.title, description: meta.description, keywords: meta.keywords };
}

export default async function TestPage({ params }: Props) {
  const { test } = await params;
  const slug = decodeURIComponent(test);
  const config = testsBySlug[slug];

  if (!config) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={config} />
      </main>
      <Footer />
    </div>
  );
}
