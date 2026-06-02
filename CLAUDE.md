@AGENTS.md

# واعي — Arabic Mental Health Self-Assessment Platform

## What this is
23 free, anonymous, Arabic-language mental health self-assessment tests targeting GCC + Egypt. Brand name: **واعي** (waaei = "aware"). Domain: **waaei.me**. Zero stigma framing.

**Operator:** Emdash — UAE company, DED Abu Dhabi licence. Contact: contact@emdash.ae · https://emdash.ae

## Deployment
- **GitHub:** https://github.com/s3eedlol/waaei
- **Vercel:** https://waaei.vercel.app (auto-deploys on push to `master`)
- **Custom domain:** waaei.me (add in Vercel dashboard → Settings → Domains)

## Tech stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS **v4** (CSS-first — no `tailwind.config.ts`, all theme in `app/globals.css` using `@theme` blocks)
- **Tajawal** Google Font (Arabic + Latin subsets) — weights 400, 500, 700, 800 (**no 600 — Tajawal doesn't have it**); variable `--font-tajawal-var` set in `app/layout.tsx`
  - **Font loading gotcha:** `body` references the font as `font-family: var(--font-tajawal-var), system-ui, sans-serif` **directly** — do NOT route it through an `@theme` variable (that resolves at compile time and loses the `var()` reference at `:root` scope, breaking the font)
- `dir="rtl"` on `<html>`, RTL layout throughout
- Vitest + @testing-library/react for unit tests
- `@vercel/analytics` — `<Analytics />` mounted in `app/layout.tsx` for page-view tracking
- `app/icon.png` — custom واعي app icon (dark green rounded square); Next.js App Router picks it up automatically as the favicon. Source file in `logo/`.
- **Header logo** is **code-generated** in `components/Header.tsx` — no image file. An ink-filled 32×32 rounded square tile (borderRadius 9, `background: var(--waaei-ink)`) with the letter "و" centered in `var(--waaei-bg)` color, followed by the "واعي" wordmark (18px, 800 weight, `color: var(--waaei-ink)`). No separate LogoMark component — rendered inline in the header.
- Header nav has **4 links**: الاختبارات → `/اختبارات` (ink color, active), المقالات → `/مقالات` (mute), عن الموقع → `/عن-الموقع` (mute), الخصوصية → `/سياسة-الخصوصية` (mute)
- `app/layout.tsx` includes a global Organization JSON-LD `<script>` (واعي → parentOrg Emdash) via `dangerouslySetInnerHTML`.
- `components/AboutPage.tsx` — about page component served at `/عن-الموقع` via the `[test]` dynamic route. Has its own Emdash+واعي Organization JSON-LD.
- **Design tokens:** All brand colors and spacing live in `--waaei-*` CSS custom properties in `app/globals.css` (e.g. `--waaei-ink`, `--waaei-bg`, `--waaei-surface`, `--waaei-mute`, `--waaei-rule`, `--waaei-cat-depression`, etc.). Use `var(--waaei-*)` in inline styles — not hardcoded `oklch()` values for brand colors.
- **ESLint:** `design_handoff_waaei_redesign/**` is in `globalIgnores` in `eslint.config.mjs` — do not remove.

## Critical architecture decisions

### Tailwind v4 — never use class strings in data files
Tailwind v4 scans source files for class names. Classes in `lib/tests/*.ts` string literals get purged unless listed in `@source` directives. **All colors in `TestEngine.tsx` use raw `oklch()` values in `style={{ }}` attributes** — never Tailwind classes for dynamic/conditional colors.

### Arabic URL routing — never create Arabic-named app directories
Arabic-named directories under `app/` break the build in two ways:
- **Windows dev:** Next.js cannot match Unicode folder names to incoming URL requests (runtime 404).
- **Production SSG:** Next.js throws `InvalidCharacterError: Invalid character` (code 5) during static page generation on any platform — build fails.

**All pages with Arabic URLs** (tests + the about page) are served from a single `app/[test]/page.tsx` dynamic route using a `testsBySlug` lookup map with `decodeURIComponent(params.test)`. Non-test pages like the about page add a named slug check (`slug === "عن-الموقع"`) and render a dedicated component.

### TestEngine uses zero shadcn/third-party components
`components/TestEngine.tsx` is pure HTML + inline styles. Progress bar is a plain `<div>` with `width: ${pct}%`. Answer buttons use `aria-pressed` and inline `style` for selected state. This avoids shadcn base-nova component quirks and Tailwind purging.

**TestEngine overlay architecture:** Both the test phase and results phase render as a full-screen fixed overlay (`position: fixed; inset: 0; z-index: 200; overflowY: auto; background: var(--waaei-bg)`). An `overlayRef` + `useEffect([phase, currentIndex])` scrolls the overlay to the top on every question change and when results appear.

**Question counter bidi fix:** The counter (`{currentIndex + 1} / {totalQuestions}`) is wrapped in a `div` with `dir="ltr"` and `textAlign: "right"` — without this, RTL context reverses "1 / 9" to "9 / 1".

**Scale visualization — RTL convention:** The severity scale on the results screen follows RTL direction: **green (score 0) on the RIGHT, red (severe/max) on the LEFT**. Implementation:
- Container is RTL flex; band segments render left→right in DOM but appear right→left visually
- "أنت" marker position: `right: (finalScore / maxScore) * 100%` + `transform: translateX(50%)` (percentage from right edge)
- Labels in RTL flex: `<span>0</span>` renders to the physical RIGHT, `<span>{maxScore}</span>` renders to the physical LEFT

### Scoring
`lib/scoring.ts` — `calculateScore()` handles reversed items (e.g. PSS, RSES). `maxValue = answerOptions.length - 1`. Score ranges defined per-test in `TestConfig.scoreRanges`.

### FAQ structure — 7 items per test (updated 2026-05-31)
`buildFAQItems(config)` in `app/[test]/page.tsx` returns `{ q: string; a: React.ReactNode }[]`. Order:
1. `ما هو ${config.name}؟` — uses `config.conditionDescription` (about the condition itself). Skipped if field absent.
2. `ما الذي يقيسه ${config.name}؟` — uses `config.longDescription` (about the test)
3. `كم يستغرق ${config.name}؟` — duration + question count
4. `هل هذا الاختبار تشخيص طبي؟` — static disclaimer
5. `هل نتائجي سرية؟` — static privacy answer
6. `كيف أفسّر نتيجتي؟` — JSX score table rendered from `config.scoreRanges` with `severityColorMap` dots
7. `متى يجب أن أطلب المساعدة المتخصصة؟` — static help-seeking guidance

The FAQ body wrapper is `<div>` (not `<p>`) to allow block-level JSX in item 6. `buildFAQSchema` filters to string-only items before building JSON-LD (item 6 is excluded from schema as it's JSX).

**`conditionDescription`** — optional field on `TestConfig` (`lib/types.ts`). All 23 tests have it populated. 2–3 sentence Arabic description of the condition (not the test). When adding a new test, always add this field.

## SEO architecture — data maps in `app/[test]/page.tsx`
All SEO metadata lives alongside the routing in `app/[test]/page.tsx`. When adding a new test, update all five maps:

**Rendering note (May 2026):** Do NOT add `export const dynamic = "force-dynamic"` to this file. Test pages are static content — letting Next.js statically generate them at build time is faster, better for SEO, and avoids unnecessary server load. A comment in the file marks this. Earlier versions had `force-dynamic` which disabled SSG for all 23 tests; that was removed.

**MedicalWebPage schema enrichment (May 2026):** `buildTestSchema` now emits:
- `citation` — ScholarlyArticle pulled from `sourceBySlug` (PubMed/WHO link + scale name + authors). Tells Google/YMYL crawlers the test is grounded in published research.
- `dateModified` + `lastReviewed` — driven by the `TEST_CONTENT_UPDATED` constant at the top of the file.
**When you change test content, scoring, or interpretation, bump `TEST_CONTENT_UPDATED`** — that single constant updates schema dates across all 23 tests. (Sitemap dates are separate in `app/sitemap.ts`; bump both together for consistency.)


| Map | Purpose |
|-----|---------|
| `testsBySlug` | Slug → TestConfig (routing) |
| `metaBySlug` | Slug → title, description, keywords |
| `conditionBySlug` | Slug → MedicalCondition schema (name + alternateName) |
| `sourceBySlug` | Slug → clinical scale name, authors, source URL |
| `relatedBySlug` | Slug → 3 related test slugs (shown as persistent grid after FAQ + after results in TestEngine) |

Also update `app/[test]/opengraph-image.tsx` (`testsBySlug` there) and the footer links in `components/Footer.tsx`.

### OG image generation
`app/opengraph-image.tsx` — homepage OG image (1200×630, dark green brand).
`app/[test]/opengraph-image.tsx` — per-test OG image using **Cairo** font fetched from Google Fonts at edge runtime (note: OG image still uses Cairo, not Tajawal — `next/og` image generation uses a separate font pipeline). Uses the `testsBySlug` map to look up name + icon.

### Share / Save results feature
After completing any test, a "شارك نتائجك" block appears between the scale visualization and related tests. Three buttons:

- **حفظ كصورة** — downloads a 1080×1080 branded PNG card drawn via Canvas API (off-screen, never appended to DOM). Card contains: واعي logo tile, test name pill, score numeral, severity label, scale bar, full score-range legend (all bands with colored dots + score ranges), and waaei.me footer.
- **مشاركة** — `navigator.share({files, url})` on mobile; falls back to clipboard copy on desktop.
- **نسخ الرابط** — copies `origin/slug?score=N` to clipboard; button label flips to "تم النسخ ✓" for 2 s.

**Shareable URL:** `?score=N` param is read on mount by a `useEffect([config])`. Valid score → jumps straight to results phase (`setPhase("results")`). Invalid/missing → normal test flow. Logic lives in `lib/parseScoreParam.ts`.

**Canvas gotchas:**
- `ctx.direction = "rtl"` for all Arabic text; temporarily switch to `ctx.direction = "ltr"` before drawing score-range numbers (e.g. "0 – 4") then restore, otherwise RTL context reverses the digits.
- Font loaded via `document.fonts.load("800 32px Tajawal")` etc. — Canvas uses the already-loaded page font, not a separate fetch.
- Canvas colors use hardcoded hex (not `var(--waaei-*)`) because Canvas API cannot resolve CSS custom properties.
- Scale bar: `config.scoreRanges` is reversed before drawing so severe (red) is on the left, none (green) on the right, matching the RTL UI convention.
- `copyTimerRef` (useRef) tracks the "تم النسخ" timer so it's cleared on unmount.

### TestEngine props
`components/TestEngine.tsx` accepts:
- `config: TestConfig` — required
- `compact?: boolean` — hides the intro header/description/info-card (used when the page renders an SSR intro section above the engine)
- `relatedTests?: { name: string; slug: string }[]` — shown in the results phase as "قد يهمك أيضاً" links

### Non-test pages
Live pages served from `[test]` route:
- `/عن-الموقع` → `components/AboutPage.tsx`
- `/سياسة-الخصوصية` → `components/PrivacyPage.tsx`
- `/اختبارات` → `components/AllTestsPage.tsx` (all-tests index; linked from header nav "الاختبارات")

### MoodSelector
`components/HomeMoodSection.tsx` / `components/MoodSelector.tsx` — **6 moods** (index order):
0. بخير, 1. قَلِق, 2. حزين, 3. مرهَق, 4. **متوتر** (added), 5. متبلّد

`MOOD_SLUGS` in `app/page.tsx` has 6 rows (one per mood). If you add/reorder moods, update both the moods array and `MOOD_SLUGS` in sync.

## Adding a new test
1. Create `lib/tests/{id}.ts` exporting `{id}Config: TestConfig`
2. Add slug → config mapping in `app/[test]/page.tsx` — update ALL five maps: `testsBySlug`, `metaBySlug`, `conditionBySlug`, `sourceBySlug`, `relatedBySlug`
3. Add config to the relevant category array in `app/page.tsx`
4. Add slug to `app/sitemap.ts` (update `TESTS_UPDATED` date)
5. Add slug → config to `app/[test]/opengraph-image.tsx`
6. Add test link to the correct category column in `components/Footer.tsx`

## Adding a new non-test page (e.g. about, privacy)
1. Create the page as a component in `components/` (e.g. `components/MyPage.tsx`)
2. Import it in `app/[test]/page.tsx` and add a slug check (e.g. `if (slug === "اسم-الصفحة") return <MyPage />;`)
3. Add metadata for the slug in `generateMetadata` in `app/[test]/page.tsx`
4. Add the URL to `app/sitemap.ts`
**Never create Arabic-named directories under `app/` — see routing constraint above.**

## Articles hub (`/مقالات`) — AI-generated educational content

Daily AI-generated Arabic mental health articles, Supabase-backed, with a draft → review → publish pipeline. Modeled on the dahabpulse pipeline.

### Architecture
- **Supabase project: `waaei`** (project ID `rvvvqkqcyattuvwpmkzg`, region eu-central-1). Single `articles` table — id (uuid PK), slug (unique), title, meta_description, content (markdown), category, related_test_slug/name/scale/minutes, reading_minutes, status (`draft`|`published`), published_at, created_at. RLS enabled, no policies — the **service-role key bypasses RLS** and is server-only.
- **`lib/supabase/client.ts`** — service-role client (`import "server-only"` guard). Reads `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
- **`lib/supabase/articles.ts`** — DB layer. `getPublishedArticles` is wrapped in `unstable_cache` (revalidate 3600, tag `published-articles`). `approveArticle`/`deleteArticle` call `updateTag("published-articles")` for immediate list invalidation. `approveArticle` also stamps `published_at`. `getDraftArticles` is uncached.
  - **`getArticleBySlug` uses React `cache()`, NOT `unstable_cache`** — React `cache()` deduplicates within the request only, writes no persistent cache entry, and sets no headers. Never switch it back to `unstable_cache`. (This alone was an *incomplete* fix for the Arabic-slug 500 — see the article-page caching note below for the actual root cause.)
- **`lib/ai/generateArticle.ts`** — 26-topic Arabic mental-health pool (one+ per test). `pickUnusedTopic` does day-of-year rotation and skips slugs already in the DB (returns `null` when all 26 are used). `generateAndSaveArticle` calls Claude (`claude-sonnet-4-6`), saves as `draft` with `published_at: null`. **CTA marker:** Claude often strips the `<!-- CTA -->` HTML comment, so there's a post-processing fallback that re-inserts it after the second `##` section.
- **`app/api/cron/generate-article/route.ts`** — GET endpoint, auth via `Bearer ${CRON_SECRET}` (fails closed if the env var is missing). Returns 200 + `articleId:null` when all topics are used, 500 on generation error.
- **`vercel.json`** — cron `0 2 * * *` (2am UTC daily), `maxDuration: 300` for the cron route.

### Routing — Arabic URL via rewrites (CRITICAL)
Arabic-named dirs under `app/` break the build (see routing constraint). The hub lives in the Latin dir `app/articles/` and is exposed at `/مقالات` via rewrites in `next.config.ts`. **Next.js 16 matches `rewrites` `source` against the percent-encoded path**, so the source MUST be percent-encoded, not raw Arabic:
```ts
{ source: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA", destination: "/articles" }
{ source: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/:path*", destination: "/articles/:path*" }
```
Raw Arabic sources silently 404. Canonical/OG URLs still use the raw Arabic form (`/مقالات/slug`).

### Pages
- **`app/articles/page.tsx`** — hub index at `/مقالات`. 2-col mobile / 3-col desktop card grid of published articles (category pill, title, description, read time). Empty state: "لا توجد مقالات منشورة بعد."
- **`app/articles/[slug]/page.tsx`** — article page. `react-markdown` + `remark-gfm`. Splits `content` at `<!-- CTA -->` (via `indexOf`, first-occurrence only) and injects a dark CTA card (`var(--waaei-ink)` bg) linking to the related test. Article JSON-LD. `notFound()` for drafts (also guarded in `generateMetadata` so drafts never leak title/desc).
  - **MUST render dynamically — `export const dynamic = "force-dynamic"`, NO `generateStaticParams`** (matches the `[test]` route, which serves Arabic slugs fine because it is `ƒ` Dynamic). **This is the actual root cause of the "newly-approved article → 500 / This page couldn't load" bug.** `generateStaticParams` puts the route in SSG/ISR mode (`●`). Next then caches each render together with an *implicit route tag derived from the decoded pathname* (`/articles/<arabic-slug>`) — this tag is added by the page render itself (`prerenderStore.tags = [...implicitTags.tags]`), **independent of `unstable_cache`**. On Vercel, any article approved after the last build renders on-demand in a Function and that Arabic tag is written into the `x-next-cache-tags` HTTP header → Node throws `ERR_INVALID_CHAR` (headers must be ASCII) → 500. Pre-built test pages dodge this (tags baked into the prerender manifest at build, never via runtime `setHeader`); newly-approved articles can't be pre-built, so they crash. **`next start` cannot reproduce it** — it keeps `x-next-cache-tags` internal; only Vercel's CDN adapter emits it to the wire. Dynamic rendering collects no cache tags → no header → no crash, and SEO is unaffected (HTML is still server-rendered).
- **`app/review/page.tsx`** — operator-only at `/review`, NOT linked in nav. Password login → server action checks `REVIEW_PASSWORD` → sets `review_auth` HttpOnly+SameSite=strict cookie (7-day, `secure` in prod). Shows all articles (drafts first), full markdown render, **نشر ✓** (approve) and **حذف** (delete) buttons. `app/review/actions.ts` server actions re-check the cookie independently (the page gate is not enough — server actions are directly callable). `app/review/logout/route.ts` clears the cookie.

### Env vars (Vercel)
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Prod+Dev), `ANTHROPIC_API_KEY`, `REVIEW_PASSWORD`, `CRON_SECRET` (Prod). Sensitive vars can't be added to the Development environment — use `.env.local` for local dev. `vercel env add ... preview` stalls on CLI v54 (asks for a git branch); single-branch project so preview env isn't needed.

### Daily flow
Cron at 2am UTC → Claude writes article → saved as draft (invisible). Operator visits `/review`, reads it, clicks نشر ✓ → `status: published` + cache invalidated → live on `/مقالات` immediately. To add topics, extend the `TOPICS` array in `lib/ai/generateArticle.ts`.

## Test inventory (23 total)
| File | Scale | Slug |
|------|-------|------|
| phq9 | PHQ-9 Depression | اختبار-الاكتئاب |
| gad7 | GAD-7 Anxiety | اختبار-القلق |
| pss | PSS-10 Stress | اختبار-التوتر |
| burnout | Burnout | اختبار-الإحتراق-الوظيفي |
| ocir | OCI-R OCD | اختبار-الوسواس-القهري |
| asrs5 | ASRS-5 ADHD | اختبار-ADHD-للبالغين |
| pcl5 | PCL-5 PTSD | اختبار-الصدمة-النفسية |
| isi | ISI Insomnia | اختبار-الأرق |
| rses | RSES Self-esteem | اختبار-تقدير-الذات |
| spin | SPIN Social Phobia | اختبار-الرهاب-الاجتماعي |
| bfi10 | BFI-10 Big Five | اختبار-الشخصية-الخمسة |
| ecrs | ECR-S Attachment | اختبار-نمط-التعلق-العاطفي |
| sassv | SAS-SV Phone addiction | اختبار-إدمان-الهاتف |
| beis10 | BEIS-10 Emotional IQ | اختبار-الذكاء-العاطفي |
| uls8 | ULS-8 Loneliness | اختبار-الوحدة-النفسية |
| staxi | STAXI Anger | اختبار-الغضب |
| eat7 | EAT-7 Eating disorders | اختبار-اضطراب-الأكل |
| mdq | MDQ Bipolar | اختبار-ثنائي-القطب |
| dass21 | DASS-21 Comprehensive | اختبار-الاكتئاب-والقلق-والتوتر |
| bpni | PNI-16 Narcissism | اختبار-الشخصية-النرجسية |
| psqi | PSQI Sleep quality | اختبار-جودة-النوم |
| ptgi | PTGI-SF Post-traumatic growth | اختبار-النمو-بعد-الصدمة |
| auditc | AUDIT-C Substances | اختبار-أنماط-الاستهلاك |

## SEO status

### Fixed (2026-05-31)
- FAQ items expanded 5 → 7 on all 23 tests (conditionDescription, score table, when to seek help, related tests grid)
- CTR rewrites: phone addiction → "هل أنا مدمن على هاتفي؟", ADHD → "هل لدي ADHD؟" (commit c61ccb2)
- Anxiety title → "هل لدي قلق مزمن؟ — اختبار GAD-7 بالعربي"
- `conditionName` field added to `TestConfig` + all 23 test configs
- FAQ first question changed from "ما هو اختبار X؟" → "ما هو ${conditionName}؟" — People Also Ask eligible
- Rich `conditionDescription` for top 5 (4-5 sentences each): depression, anxiety, ADHD, insomnia, phone addiction
- `TEST_CONTENT_UPDATED` = "2026-05-31" → feeds `dateModified`/`lastReviewed` in MedicalWebPage schema
- 23 pages submitted to IndexNow (commits b72ecf6, 7b3a830, 4ef3687)
- `llms.txt` — `public/llms.txt` lists all 23 tests with scale names + direct URLs for ChatGPT/Perplexity/Claude citation (commit 47f204e)

### Remaining
- Expand `conditionDescription` for 18 non-top-5 tests (priority: burnout, stress, OCD, social phobia, loneliness)
- Approve blog drafts at `/review` daily — priority topics: depression, anxiety, ADHD, phone addiction articles
- Monitor GSC ~2026-06-14 for CTR movement + People Also Ask appearances
- Mental Health Resources Directory — therapist/crisis lines by country (UAE, Saudi, Egypt) — highest E-E-A-T + backlink value
- Backlinks — 0 currently, deferred

## Dev server
Run `npm run dev` — available at http://localhost:3000 (or 3001 if 3000 is taken).
To connect Vercel CLI through corporate proxy: `$env:NODE_OPTIONS="--use-system-ca"; vercel`
