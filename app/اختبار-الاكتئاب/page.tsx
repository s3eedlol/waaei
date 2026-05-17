import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { phq9Config } from "@/lib/tests/phq9";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اختبار الاكتئاب — PHQ-9 بالعربي",
  description:
    "اختبر نفسك بمقياس PHQ-9 المُتحقَّق منه طبياً. هل أنا مصاب بالاكتئاب؟ اكتشف بشكل سري ومجاني.",
  keywords: ["اختبار الاكتئاب", "هل أنا مصاب بالاكتئاب", "PHQ-9 عربي", "أعراض الاكتئاب اختبار"],
};

export default function DepressionTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={phq9Config} />
      </main>
      <Footer />
    </div>
  );
}
