import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { ocirConfig } from "@/lib/tests/ocir";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اختبار الوسواس القهري — OCI-R بالعربي",
  description:
    "هل لدي وسواس قهري؟ اختبر نفسك بمقياس OCI-R العلمي المُتحقَّق منه. نتائج سرية ومجانية.",
  keywords: ["اختبار الوسواس القهري", "هل لدي وسواس قهري", "OCD اختبار بالعربي"],
};

export default function OCDTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={ocirConfig} />
      </main>
      <Footer />
    </div>
  );
}
