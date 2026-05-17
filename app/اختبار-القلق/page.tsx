import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { gad7Config } from "@/lib/tests/gad7";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اختبار القلق النفسي — GAD-7 بالعربي",
  description:
    "اختبر مستوى قلقك بمقياس GAD-7 العلمي. هل لدي قلق مزمن؟ اكتشف بشكل سري ومجاني.",
  keywords: ["اختبار القلق النفسي", "هل لدي قلق مزمن", "GAD-7 عربي", "اضطراب القلق العام"],
};

export default function AnxietyTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={gad7Config} />
      </main>
      <Footer />
    </div>
  );
}
