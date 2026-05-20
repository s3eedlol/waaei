import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { AboutPage } from "@/components/AboutPage";
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

export const dynamic = "force-dynamic";

const testsBySlug: Record<string, TestConfig> = {
  "اختبار-الاكتئاب": phq9Config,
  "اختبار-القلق": gad7Config,
  "اختبار-الإرهاق-الوظيفي": burnoutConfig,
  "اختبار-التوتر": pssConfig,
  "اختبار-الوسواس-القهري": ocirConfig,
  "اختبار-ADHD-للبالغين": asrs5Config,
  "اختبار-الصدمة-النفسية": pcl5Config,
  "اختبار-الأرق": isiConfig,
  "اختبار-تقدير-الذات": rsesConfig,
  "اختبار-الرهاب-الاجتماعي": spinConfig,
  "اختبار-الشخصية-الخمسة": bfi10Config,
  "اختبار-نمط-التعلق-العاطفي": ecrsConfig,
  "اختبار-إدمان-الهاتف": sassvConfig,
  "اختبار-الذكاء-العاطفي": beis10Config,
  "اختبار-الوحدة-النفسية": uls8Config,
  "اختبار-الغضب": staxiConfig,
  "اختبار-اضطراب-الأكل": eat7Config,
  "اختبار-ثنائي-القطب": mdqConfig,
  "اختبار-الاكتئاب-والقلق-والتوتر": dass21Config,
  "اختبار-الشخصية-النرجسية": bpniConfig,
  "اختبار-جودة-النوم": psqiConfig,
  "اختبار-النمو-بعد-الصدمة": ptgiConfig,
  "اختبار-أنماط-الاستهلاك": auditcConfig,
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
  "اختبار-ADHD-للبالغين": {
    title: "اختبار ADHD للبالغين بالعربي — ASRS-5",
    description: "هل لدي ADHD؟ اختبر تركيزك ونشاطك بمقياس ASRS-5 منظمة الصحة العالمية. مجاني وسري.",
    keywords: ["اختبار ADHD بالعربي", "هل لدي ADHD", "اضطراب التركيز للبالغين", "ASRS عربي"],
  },
  "اختبار-الصدمة-النفسية": {
    title: "اختبار الصدمة النفسية — PCL-5 بالعربي",
    description: "هل تعاني من اضطراب ما بعد الصدمة؟ اختبر نفسك بمقياس PCL-5 العلمي. نتائج سرية ومجانية.",
    keywords: ["اختبار الصدمة النفسية", "PTSD اختبار بالعربي", "هل لدي صدمة نفسية", "PCL-5 عربي"],
  },
  "اختبار-الأرق": {
    title: "اختبار الأرق واضطرابات النوم — ISI بالعربي",
    description: "هل تعاني من الأرق؟ اختبر شدة اضطراب نومك بمقياس ISI العلمي. مجاني وسري تماماً.",
    keywords: ["اختبار الأرق", "هل أنا مصاب بالأرق", "علاج الأرق", "ISI عربي"],
  },
  "اختبار-تقدير-الذات": {
    title: "اختبار تقدير الذات — مقياس روزنبرغ بالعربي",
    description: "كيف تقدّر نفسك؟ اكتشف مستوى تقديرك لذاتك بمقياس روزنبرغ المُعتمَد. مجاني وسري.",
    keywords: ["اختبار تقدير الذات", "مقياس روزنبرغ عربي", "احترام الذات", "كيف أحسن ثقتي بنفسي"],
  },
  "اختبار-الرهاب-الاجتماعي": {
    title: "اختبار الرهاب الاجتماعي — SPIN بالعربي",
    description: "هل تعاني من القلق الاجتماعي؟ اختبر نفسك بمقياس SPIN العلمي. مجاني وسري تماماً.",
    keywords: ["اختبار الرهاب الاجتماعي", "هل لدي خجل مرضي", "القلق الاجتماعي اختبار", "SPIN عربي"],
  },
  "اختبار-الشخصية-الخمسة": {
    title: "اختبار الشخصية الخمسة — Big Five بالعربي",
    description: "اكتشف شخصيتك بنموذج العوامل الخمسة الكبرى. ما هي سمات شخصيتك الحقيقية؟",
    keywords: ["اختبار الشخصية الخمسة", "Big Five عربي", "نموذج العوامل الخمسة", "أنواع الشخصية"],
  },
  "اختبار-نمط-التعلق-العاطفي": {
    title: "اختبار نمط التعلق العاطفي — ECR-S بالعربي",
    description: "كيف تتعلق بالآخرين عاطفياً؟ اكتشف نمط تعلقك بمقياس ECR-S. مجاني وسري تماماً.",
    keywords: ["اختبار نمط التعلق العاطفي", "القلق العاطفي في العلاقات", "التعلق الآمن", "ECR عربي"],
  },
  "اختبار-إدمان-الهاتف": {
    title: "اختبار إدمان الهاتف والسوشيال ميديا — SAS-SV بالعربي",
    description: "هل أنا مدمن على هاتفي؟ اختبر علاقتك بالهاتف الذكي بمقياس SAS-SV. مجاني وسري.",
    keywords: ["اختبار إدمان الهاتف", "هل أنا مدمن على السوشيال ميديا", "إدمان الإنترنت"],
  },
  "اختبار-الذكاء-العاطفي": {
    title: "اختبار الذكاء العاطفي — BEIS-10 بالعربي",
    description: "كيف مستوى ذكائك العاطفي؟ اختبر قدرتك على فهم وإدارة المشاعر. مجاني وسري.",
    keywords: ["اختبار الذكاء العاطفي", "كيف أطور ذكائي العاطفي", "EQ عربي"],
  },
  "اختبار-الوحدة-النفسية": {
    title: "اختبار الوحدة النفسية — ULS-8 بالعربي",
    description: "هل تشعر بالوحدة؟ قيّم مستوى الوحدة النفسية بمقياس ULS-8 العلمي. مجاني وسري.",
    keywords: ["اختبار الوحدة النفسية", "هل أنا وحيد", "الشعور بالعزلة", "ULS عربي"],
  },
  "اختبار-الغضب": {
    title: "اختبار الغضب ومشاعر العدوانية — STAXI بالعربي",
    description: "كيف تتعامل مع غضبك؟ اكتشف أنماط الغضب لديك بمقياس STAXI. مجاني وسري تماماً.",
    keywords: ["اختبار الغضب", "كيف أتحكم في غضبي", "إدارة الغضب", "STAXI عربي"],
  },
  "اختبار-اضطراب-الأكل": {
    title: "اختبار اضطراب الأكل — EAT-7 بالعربي",
    description: "هل لديك علاقة صحية مع الطعام؟ اكتشف مؤشرات اضطرابات الأكل بمقياس EAT-7. سري ومجاني.",
    keywords: ["اختبار اضطراب الأكل", "هل لدي اضطراب أكل", "فقدان الشهية", "شره مرضي"],
  },
  "اختبار-ثنائي-القطب": {
    title: "اختبار اضطراب ثنائي القطب — MDQ بالعربي",
    description: "هل لدي اضطراب ثنائي القطب؟ اختبر نفسك بمقياس MDQ العلمي. نتائج سرية ومجانية.",
    keywords: ["اختبار ثنائي القطب", "هل لدي اضطراب ثنائي القطب", "MDQ عربي", "تقلبات المزاج"],
  },
  "اختبار-الاكتئاب-والقلق-والتوتر": {
    title: "اختبار الاكتئاب والقلق والتوتر الشامل — DASS-21 بالعربي",
    description: "اختبر الاكتئاب والقلق والتوتر معاً بمقياس DASS-21 الشامل. مجاني وسري تماماً.",
    keywords: ["DASS-21 عربي", "اختبار شامل للصحة النفسية", "اكتئاب قلق توتر"],
  },
  "اختبار-الشخصية-النرجسية": {
    title: "اختبار السمات النرجسية — PNI بالعربي",
    description: "هل تميل إلى النرجسية؟ اكتشف سماتك الشخصية بمقياس PNI. مجاني وسري تماماً.",
    keywords: ["اختبار النرجسية", "هل أنا نرجسي", "اضطراب الشخصية النرجسية", "PNI عربي"],
  },
  "اختبار-جودة-النوم": {
    title: "اختبار جودة النوم — PSQI بالعربي",
    description: "كيف جودة نومك؟ اختبر نومك بمقياس PSQI من جامعة بيتسبرغ. مجاني وسري تماماً.",
    keywords: ["اختبار جودة النوم", "PSQI عربي", "هل نومي صحي", "اضطرابات النوم"],
  },
  "اختبار-النمو-بعد-الصدمة": {
    title: "اختبار النمو بعد الصدمة — PTGI-SF بالعربي",
    description: "ماذا اكتسبت من تجاربك الصعبة؟ اكتشف نموك الشخصي بعد المحن بمقياس PTGI-SF.",
    keywords: ["اختبار النمو بعد الصدمة", "PTGI عربي", "التعافي من الصدمة", "قوة بعد الألم"],
  },
  "اختبار-أنماط-الاستهلاك": {
    title: "اختبار الاستخدام الضار للمواد — AUDIT بالعربي",
    description: "هل يؤثر استخدامك للمواد المسكّرة على حياتك؟ اختبر نفسك بمقياس AUDIT. سري تماماً.",
    keywords: ["اختبار إدمان المواد", "AUDIT عربي", "أنماط الشرب", "الكشف المبكر عن الإدمان"],
  },
};

type Props = { params: Promise<{ test: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { test } = await params;
  const slug = decodeURIComponent(test);
  if (slug === "عن-الموقع") {
    return {
      title: "واعي | عن الموقع",
      description: "تعرّف على واعي، منصة الصحة النفسية العربية، وشركة Emdash المشغّلة لها.",
    };
  }
  const meta = metaBySlug[slug];
  if (!meta) return {};
  return { title: meta.title, description: meta.description, keywords: meta.keywords };
}

export default async function TestPage({ params }: Props) {
  const { test } = await params;
  const slug = decodeURIComponent(test);

  if (slug === "عن-الموقع") {
    return <AboutPage />;
  }

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
