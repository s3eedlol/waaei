import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestCard } from "@/components/TestCard";
import { phq9Config } from "@/lib/tests/phq9";
import { gad7Config } from "@/lib/tests/gad7";
import { burnoutConfig } from "@/lib/tests/burnout";
import { pssConfig } from "@/lib/tests/pss";
import { ocirConfig } from "@/lib/tests/ocir";

export const metadata: Metadata = {
  title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية",
  description:
    "اختبر صحتك النفسية بشكل مجاني وسري. اختبارات الاكتئاب والقلق والإرهاق الوظيفي والتوتر — مبنية على مقاييس علمية مُتحقَّق منها.",
};

const allTests = [phq9Config, gad7Config, pssConfig, burnoutConfig, ocirConfig];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
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
              اختبارات علمية مجانية وسرية تماماً — بدون تسجيل، بدون حفظ بيانات.
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

        {/* Tests grid */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground">اختر الاختبار</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allTests.map((config) => (
              <TestCard key={config.id} config={config} />
            ))}
          </div>
        </section>

        {/* Trust section */}
        <section className="bg-muted py-12 px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
            <h2 className="text-2xl font-bold">لماذا نفسي؟</h2>
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
