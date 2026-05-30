# Educational Content Hub — Design Spec

**Date:** 2026-05-30
**Status:** Approved — ready for implementation planning

---

## Overview

Add a `/مقالات` educational content hub to واعي: a set of 5–10 Arabic-language health articles targeting top-of-funnel informational queries (e.g. "أعراض الاكتئاب"). Each article explains a mental health condition and ends with a CTA linking to the relevant self-assessment test. Goal: capture organic search traffic from people who don't yet know about the tests.

---

## Routing & File Structure

Arabic directories under `app/` are forbidden (breaks Windows dev + SSG build). The `/مقالات/` URL prefix is achieved via Next.js rewrites mapping to a Latin-named `app/articles/` directory.

### New files

```
app/
  articles/
    page.tsx              ← hub index, internally at /articles → publicly /مقالات
    [slug]/
      page.tsx            ← article page, internally at /articles/[slug] → publicly /مقالات/[slug]

lib/
  articles/
    index.ts              ← Article type, allArticles array, articlesBySlug lookup map
    depression.ts         ← أعراض-الاكتئاب
    anxiety.ts            ← أعراض-القلق-النفسي
    burnout.ts            ← الإحتراق-الوظيفي
    stress.ts             ← التوتر-النفسي
    sleep.ts              ← مشاكل-النوم-والأرق
```

### Rewrites in `next.config.ts`

```ts
async rewrites() {
  return [
    { source: '/مقالات', destination: '/articles' },
    { source: '/مقالات/:path*', destination: '/articles/:path*' },
  ];
}
```

Canonical URLs in all metadata point to the Arabic-prefix form (`/مقالات/slug`), never the internal `/articles/slug` path.

---

## Data Model

```ts
// lib/articles/index.ts

export type Article = {
  slug: string;              // Arabic slug, e.g. "أعراض-الاكتئاب"
  title: string;             // H1 + meta title
  description: string;       // Meta description (~155 chars), also shown on hub card
  intro: string;             // Lead paragraph shown between H1 and first section — one concise sentence
  keywords: string[];        // SEO keywords
  relatedTestSlug: string;   // Slug of the test the CTA links to
  relatedTestName: string;   // e.g. "اختبار الاكتئاب"
  relatedTestScale: string;  // e.g. "PHQ-9"
  relatedTestMinutes: number;
  category: string;          // Matches existing test categories, e.g. "الاكتئاب والمزاج"
  readingMinutes: number;
  publishedAt: string;       // ISO date string, e.g. "2026-06-01"
  ctaAfterSectionIndex: number; // CTA card is inserted after sections[ctaAfterSectionIndex]; default 1 (after symptoms)
  sections: {
    heading: string;
    body: string;            // Plain Arabic text; paragraphs separated by \n\n
  }[];
  relatedArticleSlugs: string[]; // 2 slugs shown in "اقرأ أيضاً" at article bottom
};
```

### Initial 5 articles

| File | Slug | Targets | CTA test |
|------|------|---------|----------|
| `depression.ts` | `أعراض-الاكتئاب` | "أعراض الاكتئاب", "ما هو الاكتئاب" | PHQ-9 |
| `anxiety.ts` | `أعراض-القلق-النفسي` | "أعراض القلق", "هل لدي قلق مزمن" | GAD-7 |
| `burnout.ts` | `الإحتراق-الوظيفي` | "الاحتراق الوظيفي", "أسبابه وعلاجه" | Burnout |
| `stress.ts` | `التوتر-النفسي` | "التوتر النفسي", "أعراض التوتر الزائد" | PSS |
| `sleep.ts` | `مشاكل-النوم-والأرق` | "أسباب الأرق", "علاج مشاكل النوم" | ISI |

---

## Hub Index Page (`/مقالات`)

**Component:** `app/articles/page.tsx`

**Layout:**
- Header (shared)
- H1: "مقالات الصحة النفسية" + subtitle
- **2-column card grid on mobile** (`grid-cols-2`), **3 columns on desktop** (`lg:grid-cols-3`) — 5–10 articles look better at 3 cols than 4
- Footer (shared)

**Card contents** (top to bottom):
1. Category pill — background colour matched to `--waaei-cat-*` token for that category
2. Title (font-weight 700)
3. One-line description (muted, truncated at 2 lines)
4. Read time in minutes (muted)

Cards are `<a>` tags linking to `/مقالات/[slug]`. Equal card height in a row via `flex-direction: column` + `flex: 1` on the description.

**Metadata:**
- `title`: "مقالات الصحة النفسية | واعي"
- `description`: "مقالات تعليمية مبنية على مصادر علمية للتعرف على الحالات النفسية الشائعة وأعراضها"
- `alternates.canonical`: `/مقالات`

---

## Article Page (`/مقالات/[slug]`)

**Component:** `app/articles/[slug]/page.tsx`

**Layout:** Single column, centered, `max-width: ~720px`, RTL throughout. Uses `var(--waaei-*)` design tokens and `var(--font-tajawal-var)` — no hardcoded colours or font values.

**Structure (top to bottom):**
1. **Header** (shared)
2. **Breadcrumb:** مقالات › [category]
3. **Meta row:** category pill + read time + published date
4. **H1** title
5. **Lead paragraph** — `article.intro` field, rendered directly (not extracted from sections)
6. **Divider** (`var(--waaei-rule)`)
7. **Article sections** — each: `<h2>` heading + paragraph(s) from `section.body` (split on `\n\n`). CTA card is injected after `sections[article.ctaAfterSectionIndex]`.
8. **CTA card** — dark green card (`var(--waaei-ink)` bg): "هل تتعرف على هذه الأعراض؟" + test name/scale/duration + "اكتشف مستواك ←" button linking to `/{relatedTestSlug}`
9. **Remaining sections** continue after the CTA
10. **Divider**
11. **"اقرأ أيضاً"** — 2 article link cards from `relatedArticleSlugs`
12. **Footer** (shared)

**Static generation:** `generateStaticParams()` returns all article slugs. Do NOT add `force-dynamic`. Pages are fully static.

---

## SEO & Structured Data

### Per-article `generateMetadata`

```ts
{
  title: article.title,
  description: article.description,
  keywords: article.keywords,
  alternates: { canonical: `/مقالات/${article.slug}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `/مقالات/${article.slug}`,
  },
  twitter: { card: 'summary_large_image' },
}
```

### JSON-LD per article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<title>",
  "inLanguage": "ar",
  "url": "https://waaei.me/مقالات/<slug>",
  "datePublished": "<publishedAt>",
  "publisher": {
    "@type": "Organization",
    "name": "واعي",
    "url": "https://waaei.me"
  },
  "about": {
    "@type": "MedicalCondition",
    "name": "<condition name in Arabic>"
  }
}
```

### Sitemap (`app/sitemap.ts`)

Add `ARTICLES_UPDATED` date constant. Add entries:
- `/مقالات` — `changeFrequency: "monthly"`, `priority: 0.7`
- Each article slug — `changeFrequency: "monthly"`, `priority: 0.8`

---

## Header Nav Update

`components/Header.tsx` — add a 4th link:

| Link | URL | Style |
|------|-----|-------|
| الاختبارات | `/اختبارات` | ink colour (active) |
| المقالات | `/مقالات` | mute colour ← new |
| عن الموقع | `/عن-الموقع` | mute colour |
| الخصوصية | `/سياسة-الخصوصية` | mute colour |

---

## Out of Scope (initial launch)

- Per-article OG image (`opengraph-image.tsx`) — use site default for now
- CMS or MDX — articles are TypeScript data files, AI-drafted and developer-reviewed
- Search or filtering on the hub index
- Category sub-pages (e.g. `/مقالات/الاكتئاب`)
- Comment section or user engagement features
