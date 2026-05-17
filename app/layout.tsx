import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo-var",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "نفسي | اختبارات الصحة النفسية",
    template: "%s | نفسي",
  },
  description:
    "اختبارات نفسية مجانية وسرية للتعرف على مستوى صحتك النفسية. اختبار الاكتئاب، القلق، الإرهاق الوظيفي والمزيد — بالعربية.",
  keywords: [
    "اختبار الاكتئاب",
    "اختبار القلق النفسي",
    "اختبار الإرهاق الوظيفي",
    "الصحة النفسية",
    "PHQ-9 عربي",
    "GAD-7 عربي",
  ],
  openGraph: {
    siteName: "نفسي",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased`}>{children}</body>
    </html>
  );
}
