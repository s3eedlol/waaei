import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { burnoutConfig } from "@/lib/tests/burnout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اختبار الإرهاق الوظيفي — هل أنا محترق وظيفياً؟",
  description:
    "اختبر نفسك للكشف عن الاحتراق الوظيفي. أعراض الاحتراق النفسي في العمل — اكتشف مستواك بسرية تامة.",
  keywords: ["اختبار الإرهاق الوظيفي", "هل أنا محترق وظيفياً", "أعراض الاحتراق النفسي"],
};

export default function BurnoutTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={burnoutConfig} />
      </main>
      <Footer />
    </div>
  );
}
