import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal-var",
  display: "swap",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://waaei.me"),
  title: {
    default: "واعي | اختبارات الصحة النفسية",
    template: "%s | واعي",
  },
  description:
    "اختبارات نفسية مجانية وسرية للتعرف على مستوى صحتك النفسية. اختبار الاكتئاب، القلق، الإحتراق الوظيفي والمزيد — بالعربية.",
  keywords: [
    "اختبار الاكتئاب",
    "اختبار القلق النفسي",
    "اختبار الإحتراق الوظيفي",
    "الصحة النفسية",
    "PHQ-9 عربي",
    "GAD-7 عربي",
  ],
  openGraph: {
    siteName: "واعي",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "واعي",
  url: "https://waaei.me",
  email: "contact@emdash.ae",
  parentOrganization: {
    "@type": "Organization",
    name: "Emdash",
    url: "https://emdash.ae",
    email: "contact@emdash.ae",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
