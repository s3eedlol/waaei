import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "واعي | عن الموقع",
  description: "تعرّف على واعي، منصة الصحة النفسية العربية، وشركة Emdash المشغّلة لها.",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Emdash",
  legalName: "Emdash",
  url: "https://emdash.ae",
  email: "contact@emdash.ae",
  sameAs: ["https://waaei.me"],
  subOrganization: {
    "@type": "Organization",
    name: "واعي",
    url: "https://waaei.me",
    description: "اختبارات نفسية مجانية باللغة العربية.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">عن واعي</h2>
          <p className="text-muted-foreground leading-relaxed">
            واعي منصة مجانية تقدم اختبارات نفسية موثوقة باللغة العربية.
            هدفنا نشر الوعي بالصحة النفسية في المجتمع العربي.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">بإدارة Emdash</h2>
          <p className="text-muted-foreground leading-relaxed">
            واعي تابع لشركة Emdash، شركة محتوى رقمي مرخّصة في أبوظبي، الإمارات العربية المتحدة.
            لمزيد من المعلومات تفضل بزيارة{" "}
            <a
              href="https://emdash.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-500 hover:underline"
            >
              emdash.ae
            </a>
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">تنبيه مهم</h2>
          <p className="text-muted-foreground leading-relaxed">
            الاختبارات على هذا الموقع أدوات للتوعية الذاتية فقط ولا تُعدّ تشخيصاً طبياً.
            إذا كنت تمر بأزمة، يرجى التواصل مع متخصص.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">تواصل معنا</h2>
          <p className="text-muted-foreground leading-relaxed">
            للتواصل أو الاستفسار:{" "}
            <a
              href="mailto:contact@emdash.ae"
              className="text-sage-500 hover:underline"
            >
              contact@emdash.ae
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
