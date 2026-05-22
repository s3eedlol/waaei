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
- Cairo Google Font (Arabic + Latin subsets)
- `dir="rtl"` on `<html>`, RTL layout throughout
- Vitest + @testing-library/react for unit tests
- `@vercel/analytics` — `<Analytics />` mounted in `app/layout.tsx` for page-view tracking
- `app/icon.png` — custom واعي app icon (dark green rounded square); Next.js App Router picks it up automatically as the favicon. Source file in `logo/`.
- Header logo is **code-generated** in `components/Header.tsx` via a `LogoMark` component — no image file. Renders "واعي" in bold Cairo font with the "و" in sage-500 green (`oklch(55% 0.12 145)`) and "اعي" in dark green (`oklch(25% 0.06 145)`), inside a dark green outlined rounded border.
- `app/layout.tsx` includes a global Organization JSON-LD `<script>` (واعي → parentOrg Emdash) via `dangerouslySetInnerHTML`.
- `components/AboutPage.tsx` — about page component served at `/عن-الموقع` via the `[test]` dynamic route. Has its own Emdash+واعي Organization JSON-LD.

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

### Scoring
`lib/scoring.ts` — `calculateScore()` handles reversed items (e.g. PSS, RSES). `maxValue = answerOptions.length - 1`. Score ranges defined per-test in `TestConfig.scoreRanges`.

## SEO architecture — data maps in `app/[test]/page.tsx`
All SEO metadata lives alongside the routing in `app/[test]/page.tsx`. When adding a new test, update all five maps:

| Map | Purpose |
|-----|---------|
| `testsBySlug` | Slug → TestConfig (routing) |
| `metaBySlug` | Slug → title, description, keywords |
| `conditionBySlug` | Slug → MedicalCondition schema (name + alternateName) |
| `sourceBySlug` | Slug → clinical scale name, authors, source URL |
| `relatedBySlug` | Slug → 3 related test slugs (shown after results) |

Also update `app/[test]/opengraph-image.tsx` (`testsBySlug` there) and the footer links in `components/Footer.tsx`.

### OG image generation
`app/opengraph-image.tsx` — homepage OG image (1200×630, dark green brand).
`app/[test]/opengraph-image.tsx` — per-test OG image using Cairo font fetched from Google Fonts at edge runtime. Uses the `testsBySlug` map to look up name + icon.

### TestEngine props
`components/TestEngine.tsx` accepts:
- `config: TestConfig` — required
- `compact?: boolean` — hides the intro header/description/info-card (used when the page renders an SSR intro section above the engine)
- `relatedTests?: { name: string; slug: string }[]` — shown in the results phase as "قد يهمك أيضاً" links

### Non-test pages
Live pages served from `[test]` route:
- `/عن-الموقع` → `components/AboutPage.tsx`
- `/سياسة-الخصوصية` → `components/PrivacyPage.tsx`

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

## Test inventory (23 total)
| File | Scale | Slug |
|------|-------|------|
| phq9 | PHQ-9 Depression | اختبار-الاكتئاب |
| gad7 | GAD-7 Anxiety | اختبار-القلق |
| pss | PSS-10 Stress | اختبار-التوتر |
| burnout | Burnout | اختبار-الإرهاق-الوظيفي |
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

## Dev server
Run `npm run dev` — available at http://localhost:3000 (or 3001 if 3000 is taken).
To connect Vercel CLI through corporate proxy: `$env:NODE_OPTIONS="--use-system-ca"; vercel`
