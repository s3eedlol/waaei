# Share / Save Results Feature — Design Spec

**Date:** 2026-05-24  
**Status:** Approved  
**Scope:** `components/TestEngine.tsx` only — no new files, no server changes, no new dependencies.

---

## Overview

After completing any of the 23 واعي tests, users are offered three ways to share or save their results:

1. **حفظ كصورة** — download a branded 1080×1080 PNG card
2. **مشاركة** — native OS share sheet (mobile) or copy-URL fallback (desktop)
3. **نسخ الرابط** — copy a score-encoded URL to clipboard

All logic is client-side. No data is stored on any server. Privacy promise ("بدون حفظ بيانات") is maintained.

---

## Section 1: UI Placement

A "شارك نتائجك" block is inserted in the TestEngine results phase, **between the scale visualization and the related tests section**.

- Three buttons in a row, styled with inline styles consistent with the rest of TestEngine (no shadcn, no Tailwind dynamic classes)
- Button labels: حفظ كصورة · مشاركة · نسخ الرابط
- Same RTL layout and `var(--waaei-*)` color tokens as existing results UI

---

## Section 2: Shareable Link

**Encoding:** Final score appended as a URL query param.  
Example: `/اختبار-الاكتئاب?score=12`

**On mount behavior in TestEngine:**
- Read `window.location.search` for a `score` param
- If present and a valid integer: skip the question phase, jump directly to the results phase using that score
- Score range is derived from the existing `config.scoreRanges` lookup — same logic as normal test completion
- If the param is missing or invalid: normal test flow

**No server involved.** The score is the only thing encoded; the test config (ranges, labels) lives in the JS bundle.

---

## Section 3: Results Card Image (Canvas)

**Format:** 1080×1080 PNG, drawn at runtime via the browser Canvas API.

**Layout (RTL, top → bottom, all text right-aligned):**

| Zone | Content |
|------|---------|
| Top | واعي logo mark ("و" tile) + "واعي" wordmark |
| Upper-middle | Test name (e.g., "اختبار الاكتئاب"), medium weight |
| Center | Result label (e.g., "اكتئاب خفيف"), large bold — dominant element |
| Lower-middle | Simplified scale bar: colored band strip + dot marking score position |
| Bottom | "waaei.me" in small muted text |

**Technical details:**
- `ctx.direction = 'rtl'` set before all `fillText` calls
- Font loaded via `FontFace` API using Tajawal from Google Fonts (same URL as the app font)
- Colors: hardcoded hex/oklch values matching `--waaei-ink`, `--waaei-bg`, `--waaei-accent`, and the test's category color (passed from `config`)
- Canvas is created off-screen (`document.createElement('canvas')`), never appended to DOM

---

## Section 4: Button Behaviors

### حفظ كصورة (Download)
1. Draw card on off-screen canvas
2. `canvas.toBlob(blob => { ... }, 'image/png')`
3. Create object URL → programmatic `<a download="نتائجي-واعي.png">` click
4. Revoke object URL

### مشاركة (Social Share)
1. Draw card, convert to `File` object (`new File([blob], 'نتائجي-واعي.png', { type: 'image/png' })`)
2. Check `navigator.canShare({ files: [file] })`
3. If supported: `navigator.share({ files: [file], text: 'نتائجي على واعي', url: shareUrl })`
4. If not supported (desktop): fall back to `navigator.clipboard.writeText(shareUrl)` + show "تم نسخ الرابط" feedback

### نسخ الرابط (Copy Link)
1. `navigator.clipboard.writeText(shareUrl)` where `shareUrl = window.location.origin + '/' + config.slug + '?score=' + finalScore`
2. Button label changes to "تم النسخ ✓" for 2 seconds, then resets to "نسخ الرابط"

---

## Data Flow

```
Test completes → finalScore known → results phase renders
  ├─ Share block renders with finalScore + config in scope
  ├─ shareUrl = origin + slug + ?score=finalScore
  └─ Canvas draw fn: (finalScore, config, scoreRange) → ImageData

URL with ?score=N opened →
  TestEngine mount reads param → jumps to results phase with score=N
  └─ scoreRange derived from config.scoreRanges (same as normal flow)
```

---

## What Does NOT Change

- No new files
- No new npm dependencies
- No server routes or API endpoints
- No shadcn components
- No Tailwind dynamic class strings (all styling via inline styles)
- No changes to `lib/tests/*.ts`, `app/[test]/page.tsx`, or any other component
- Existing TestEngine props (`config`, `compact`, `relatedTests`) unchanged

---

## Testing with Playwright

After implementation, Playwright verifies:
1. Complete a test → share block appears
2. Click "نسخ الرابط" → clipboard contains `?score=` URL
3. Navigate to that URL → results phase loads directly (no questions shown)
4. Click "حفظ كصورة" → download is triggered
