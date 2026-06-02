import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getArticleBySlug } from "@/lib/supabase/articles";

type Props = { params: Promise<{ slug: string }> };

// Render dynamically (like the Arabic-slug `[test]` route) — NOT via SSG/ISR.
// `generateStaticParams` would put this route in SSG/ISR mode, which caches the
// rendered page together with an implicit route tag derived from the decoded
// pathname (`/articles/<arabic-slug>`). On Vercel that tag is written into the
// `x-next-cache-tags` HTTP header; non-ASCII Arabic chars throw ERR_INVALID_CHAR
// → 500 whenever a newly-approved article (absent from the last build) renders
// on-demand. Dynamic rendering collects no cache tags, so no header, no crash.
// Do NOT add generateStaticParams back, and do NOT mark this route SSG/ISR.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(decodeURIComponent(slug));
  if (!article || article.status !== "published") return {};
  return {
    title: article.title,
    description: article.meta_description,
    alternates: { canonical: `/مقالات/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.meta_description,
      url: `/مقالات/${article.slug}`,
    },
    twitter: { card: "summary_large_image" },
  };
}

const CATEGORY_COLOR: Record<string, string> = {
  "الاكتئاب والمزاج":  "#5e7bbf",
  "القلق والخوف":      "#d0a236",
  "التوتر والإرهاق":   "#c25940",
  "الشخصية والعلاقات": "#9c7bb8",
};

const mdComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--waaei-ink)", marginTop: 28, marginBottom: 10, lineHeight: 1.35 }}>
      {children}
    </h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ fontSize: 14, color: "var(--waaei-ink)", lineHeight: "var(--waaei-lh-body)", marginBottom: 12 }}>
      {children}
    </p>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ paddingRight: 20, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 6 }}>
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ fontSize: 13, color: "var(--waaei-mute)", lineHeight: "var(--waaei-lh-body)" }}>
      {children}
    </li>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--waaei-mute)", textDecoration: "underline", textUnderlineOffset: 3 }}
    >
      {children}
    </a>
  ),
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(decodeURIComponent(slug));
  if (!article || article.status !== "published") notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    inLanguage: "ar",
    url: `https://waaei.me/مقالات/${article.slug}`,
    datePublished: article.published_at ?? undefined,
    publisher: { "@type": "Organization", name: "واعي", url: "https://waaei.me" },
    about: { "@type": "MedicalCondition", name: article.category },
  };

  const catColor = CATEGORY_COLOR[article.category] ?? "#5e7bbf";
  const CTA_MARKER = "<!-- CTA -->";
  const content = article.content ?? "";
  const ctaIdx = content.indexOf(CTA_MARKER);
  const beforeCTA = ctaIdx === -1 ? null : content.slice(0, ctaIdx);
  const afterCTA  = ctaIdx === -1 ? null : content.slice(ctaIdx + CTA_MARKER.length);

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main className="flex-1">
        <div
          className="mx-auto px-[22px] py-[32px] lg:px-[56px] lg:py-[56px]"
          style={{ maxWidth: 740 }}
        >
          {/* Breadcrumb */}
          <div style={{ fontSize: 12, color: "var(--waaei-mute)", marginBottom: 18, display: "flex", gap: 6 }}>
            <Link href="/مقالات" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>مقالات</Link>
            <span>›</span>
            <span style={{ color: "var(--waaei-ink)" }}>{article.category}</span>
          </div>

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: catColor, background: catColor + "18", padding: "3px 9px", borderRadius: 5 }}>
              {article.category}
            </span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
              {article.reading_minutes} {article.reading_minutes === 1 ? "دقيقة" : article.reading_minutes === 2 ? "دقيقتان" : "دقائق"} للقراءة
            </span>
            {article.published_at && (
              <>
                <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
                  {new Date(article.published_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long" })}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-[22px] lg:text-[28px] font-black"
            style={{ color: "var(--waaei-ink)", lineHeight: 1.35, marginBottom: 24 }}
          >
            {article.title}
          </h1>

          <div style={{ height: 1, background: "var(--waaei-rule)", marginBottom: 24 }} />

          {/* Content before CTA */}
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {beforeCTA !== null ? beforeCTA : content}
          </ReactMarkdown>

          {/* CTA card — only shown if <!-- CTA --> marker exists */}
          {afterCTA !== null && (
            <div
              style={{
                background: "var(--waaei-ink)",
                borderRadius: "var(--waaei-radius-md)",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                margin: "24px 0",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ color: "var(--waaei-bg)", fontSize: 14, fontWeight: 700 }}>
                  هل تتعرف على هذه الأعراض؟
                </div>
                <div style={{ color: "var(--waaei-bg)", fontSize: 12, opacity: 0.7 }}>
                  {article.related_test_name} · {article.related_test_scale} · {article.related_test_minutes} {article.related_test_minutes === 1 ? "دقيقة" : article.related_test_minutes === 2 ? "دقيقتان" : "دقائق"} · مجاني وسري
                </div>
              </div>
              <Link
                href={`/${article.related_test_slug}`}
                style={{
                  background: "var(--waaei-bg)",
                  color: "var(--waaei-ink)",
                  fontSize: 13,
                  fontWeight: 800,
                  padding: "9px 16px",
                  borderRadius: "var(--waaei-radius-sm)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                اكتشف مستواك ←
              </Link>
            </div>
          )}

          {/* Content after CTA */}
          {afterCTA !== null && (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {afterCTA}
            </ReactMarkdown>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
