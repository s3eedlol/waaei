import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية | واعي",
  description:
    "23 اختباراً نفسياً مجانياً وسرياً بالعربية. اختبارات الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر — مبنية على مقاييس علمية مُتحقَّق منها.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية | واعي",
    description:
      "23 اختباراً نفسياً مجانياً وسرياً بالعربية. اختبارات الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر — مبنية على مقاييس علمية مُتحقَّق منها.",
    url: "/",
  },
  twitter: {
    title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية | واعي",
    description:
      "23 اختباراً نفسياً مجانياً وسرياً بالعربية. اختبارات الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر — مبنية على مقاييس علمية مُتحقَّق منها.",
  },
};

const moodTests: TestConfig[] = [phq9Config, mdqConfig, dass21Config, rsesConfig, beis10Config, staxiConfig, eat7Config, ptgiConfig, psqiConfig, auditcConfig];
const anxietyTests: TestConfig[] = [gad7Config, spinConfig, pcl5Config, ocirConfig];
const stressTests: TestConfig[] = [pssConfig, burnoutConfig, isiConfig, asrs5Config, sassvConfig];
const personalityTests: TestConfig[] = [bfi10Config, ecrsConfig, uls8Config, bpniConfig];

type Section = { title: string; tests: TestConfig[] };

const sections: Section[] = [
  { title: "الاكتئاب والمزاج", tests: moodTests },
  { title: "القلق والخوف", tests: anxietyTests },
  { title: "التوتر والإرهاق", tests: stressTests },
  { title: "الشخصية والعلاقات", tests: personalityTests },
];

const allTests = sections.flatMap((s) => s.tests);

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "واعي",
  url: "https://waaei.me",
  description: "23 اختباراً نفسياً مجانياً وسرياً بالعربية — مبنية على مقاييس علمية مُتحقَّق منها",
  inLanguage: "ar",
  publisher: { "@type": "Organization", name: "واعي", url: "https://waaei.me" },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "اختبارات الصحة النفسية بالعربية",
  numberOfItems: allTests.length,
  itemListElement: allTests.map((config, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: config.name,
    url: `https://waaei.me/${config.slug}`,
  })),
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sage-50 to-background py-16 px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              كيف صحتك النفسية
              <span className="text-sage-500"> اليوم؟</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              23 اختباراً علمياً مجانياً وسرياً تماماً — بدون تسجيل، بدون حفظ بيانات.
              فهم ما تشعر به هو الخطوة الأولى.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-sage-500">🔒</span> سري تماماً
              </span>
              <span className="flex items-center gap-1">
                <span className="text-sage-500">✓</span> مبني على مقاييس علمية
              </span>
              <span className="flex items-center gap-1">
                <span className="text-sage-500">🆓</span> مجاني بالكامل
              </span>
            </div>
          </div>
        </section>

        {/* Tests by category */}
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-14">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold mb-6 text-foreground border-r-4 pr-3" style={{ borderColor: "oklch(62% 0.12 145)" }}>
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {section.tests.map((config) => (
                  <TestCard key={config.id} config={config} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Trust section */}
        <section className="bg-muted py-12 px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
            <h2 className="text-2xl font-bold">لماذا واعي؟</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-3xl">🔬</span>
                <h3 className="font-semibold">مبني علمياً</h3>
                <p className="text-muted-foreground">
                  جميع الاختبارات مبنية على مقاييس مُتحقَّق منها ومُستخدَمة في الأبحاث العالمية
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-3xl">🔒</span>
                <h3 className="font-semibold">خصوصية تامة</h3>
                <p className="text-muted-foreground">
                  لا حساب، لا بريد إلكتروني، لا حفظ بيانات. نتائجك تبقى معك فقط
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-3xl">🌍</span>
                <h3 className="font-semibold">باللغة العربية</h3>
                <p className="text-muted-foreground">
                  مُصمَّم خصيصاً للمستخدم العربي بلغة واضحة وسهلة وبعيدة عن التعقيد الطبي
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
