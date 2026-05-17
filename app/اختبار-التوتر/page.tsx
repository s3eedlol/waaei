import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { pssConfig } from "@/lib/tests/pss";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اختبار التوتر النفسي — كيف مستوى ضغطك؟",
  description:
    "اختبر مستوى التوتر النفسي بمقياس PSS-10 العلمي. كيف أعرف مستوى ضغطي النفسي؟ اكتشف بسرية تامة.",
  keywords: ["اختبار مستوى التوتر", "كيف أعرف مستوى ضغطي النفسي", "PSS عربي"],
};

export default function StressTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={pssConfig} />
      </main>
      <Footer />
    </div>
  );
}
