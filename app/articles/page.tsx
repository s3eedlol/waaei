import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedArticles } from "@/lib/supabase/articles";

export const metadata: Metadata = {
  title: "مقالات الصحة النفسية | واعي",
  description: "مقالات تعليمية مبنية على مصادر علمية للتعرف على الحالات النفسية الشائعة وأعراضها",
  alternates: { canonical: "/مقالات" },
  openGraph: {
    title: "مقالات الصحة النفسية | واعي",
    description: "مقالات تعليمية مبنية على مصادر علمية للتعرف على الحالات النفسية الشائعة وأعراضها",
    url: "/مقالات",
  },
  twitter: {
    title: "مقالات الصحة النفسية | واعي",
    description: "مقالات تعليمية مبنية على مصادر علمية للتعرف على الحالات النفسية الشائعة وأعراضها",
  },
};

const CATEGORY_COLOR: Record<string, string> = {
  "الاكتئاب والمزاج":  "#5e7bbf",
  "القلق والخوف":      "#d0a236",
  "التوتر والإرهاق":   "#c25940",
  "الشخصية والعلاقات": "#9c7bb8",
};

export default async function ArticlesHubPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div
          className="mx-auto px-[22px] py-[32px] lg:px-[56px] lg:py-[64px]"
          style={{ maxWidth: 1280 }}
        >
          <div style={{ marginBottom: 28 }}>
            <h1
              className="text-[22px] lg:text-[32px] font-black"
              style={{ color: "var(--waaei-ink)", marginBottom: 6 }}
            >
              مقالات الصحة النفسية
            </h1>
            <p style={{ fontSize: 14, color: "var(--waaei-mute)", lineHeight: "var(--waaei-lh-body)" }}>
              مقالات تعليمية مبنية على مصادر علمية — لفهم الحالات النفسية الشائعة والتعرف على أعراضها
            </p>
          </div>

          {articles.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--waaei-mute)" }}>لا توجد مقالات منشورة بعد.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-[10px] lg:gap-[16px]">
              {articles.map((article) => {
                const color = CATEGORY_COLOR[article.category] ?? "#5e7bbf";
                return (
                  <Link
                    key={article.slug}
                    href={`/مقالات/${article.slug}`}
                    style={{ textDecoration: "none", display: "flex", height: "100%" }}
                  >
                    <div
                      style={{
                        background: "var(--waaei-surface)",
                        border: "1px solid var(--waaei-rule)",
                        borderRadius: "var(--waaei-radius-md)",
                        padding: 14,
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color,
                          background: color + "18",
                          padding: "2px 8px",
                          borderRadius: 4,
                          alignSelf: "flex-start",
                        }}
                      >
                        {article.category}
                      </span>
                      <div
                        className="text-[12px] lg:text-[14px] font-bold"
                        style={{ color: "var(--waaei-ink)", lineHeight: 1.35 }}
                      >
                        {article.title}
                      </div>
                      <div
                        className="line-clamp-2"
                        style={{
                          fontSize: 11,
                          color: "var(--waaei-mute)",
                          lineHeight: "var(--waaei-lh-body)",
                          flex: 1,
                        }}
                      >
                        {article.meta_description}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--waaei-mute)" }}>
                        {article.reading_minutes} {article.reading_minutes === 1 ? "دقيقة" : article.reading_minutes === 2 ? "دقيقتان" : "دقائق"} للقراءة
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
