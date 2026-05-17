@AGENTS.md

# واعي — Arabic Mental Health Self-Assessment Platform

## What this is
23 free, anonymous, Arabic-language mental health self-assessment tests targeting GCC + Egypt. Brand name: **واعي** (waaei = "aware"). Domain: **waaei.me**. Zero stigma framing.

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

## Critical architecture decisions

### Tailwind v4 — never use class strings in data files
Tailwind v4 scans source files for class names. Classes in `lib/tests/*.ts` string literals get purged unless listed in `@source` directives. **All colors in `TestEngine.tsx` use raw `oklch()` values in `style={{ }}` attributes** — never Tailwind classes for dynamic/conditional colors.

### Arabic URL routing on Windows
Next.js App Router on Windows cannot match Unicode Arabic folder names to URL requests. **Never create Arabic-named app directories.** All 23 tests are served from a single `app/[test]/page.tsx` dynamic route using a `testsBySlug` lookup map with `decodeURIComponent(params.test)`.

### TestEngine uses zero shadcn/third-party components
`components/TestEngine.tsx` is pure HTML + inline styles. Progress bar is a plain `<div>` with `width: ${pct}%`. Answer buttons use `aria-pressed` and inline `style` for selected state. This avoids shadcn base-nova component quirks and Tailwind purging.

### Scoring
`lib/scoring.ts` — `calculateScore()` handles reversed items (e.g. PSS, RSES). `maxValue = answerOptions.length - 1`. Score ranges defined per-test in `TestConfig.scoreRanges`.

## Adding a new test
1. Create `lib/tests/{id}.ts` exporting `{id}Config: TestConfig`
2. Add slug → config mapping in `app/[test]/page.tsx` (`testsBySlug` and `metaBySlug`)
3. Add config to the relevant category array in `app/page.tsx`
4. Add slug to `app/sitemap.ts`

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
| bpni | B-PNI Narcissism | اختبار-الشخصية-النرجسية |
| psqi | PSQI Sleep quality | اختبار-جودة-النوم |
| ptgi | PTGI-SF Post-traumatic growth | اختبار-النمو-بعد-الصدمة |
| auditc | AUDIT-C Substances | اختبار-أنماط-الاستهلاك |

## Dev server
Run `npm run dev` — available at http://localhost:3000 (or 3001 if 3000 is taken).
To connect Vercel CLI through corporate proxy: `$env:NODE_OPTIONS="--use-system-ca"; vercel`
