# Share & Save Results — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After completing any واعي test, users can download a branded 1080×1080 results card, share via the native OS share sheet, or copy a score-encoded URL — all client-side, zero server changes, zero new dependencies.

**Architecture:** One pure helper (`lib/parseScoreParam.ts`) + changes to `components/TestEngine.tsx` only. A `sharedScore` state + mount `useEffect` detects `?score=N` in the URL and jumps directly to results. A `drawResultsCard` async function renders a Canvas PNG at click-time. Three share buttons are inserted between the interpretation block and the retake/home buttons in the results phase.

**Tech Stack:** Browser Canvas API, Web Share API, Clipboard API, `URLSearchParams`, Vitest (unit tests for parseScoreParam), Playwright MCP (E2E verification).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `lib/parseScoreParam.ts` | Pure fn: parse `?score=N` from URL search string |
| Create | `lib/__tests__/parseScoreParam.test.ts` | Unit tests for the parser |
| Modify | `components/TestEngine.tsx` | sharedScore state, URL reading, share block UI, canvas card |

---

### Task 1: parseScoreParam helper + unit tests (TDD)

**Files:**
- Create: `lib/parseScoreParam.ts`
- Create: `lib/__tests__/parseScoreParam.test.ts`

- [ ] **Step 1: Create the helper**

Create `lib/parseScoreParam.ts`:
```typescript
export function parseScoreParam(search: string, maxScore: number): number | null {
  const raw = new URLSearchParams(search).get("score");
  if (raw === null) return null;
  const n = parseInt(raw, 10);
  return !isNaN(n) && n >= 0 && n <= maxScore ? n : null;
}
```

- [ ] **Step 2: Create the test file**

Create `lib/__tests__/parseScoreParam.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { parseScoreParam } from "../parseScoreParam";

describe("parseScoreParam", () => {
  it("returns null when no score param present", () => {
    expect(parseScoreParam("", 27)).toBeNull();
  });
  it("parses a valid score", () => {
    expect(parseScoreParam("?score=12", 27)).toBe(12);
  });
  it("accepts score=0", () => {
    expect(parseScoreParam("?score=0", 27)).toBe(0);
  });
  it("accepts score equal to maxScore", () => {
    expect(parseScoreParam("?score=27", 27)).toBe(27);
  });
  it("returns null when score exceeds maxScore", () => {
    expect(parseScoreParam("?score=28", 27)).toBeNull();
  });
  it("returns null for non-numeric value", () => {
    expect(parseScoreParam("?score=abc", 27)).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run lib/__tests__/parseScoreParam.test.ts
```
Expected: 6 tests pass.

- [ ] **Step 4: Commit**

```bash
git add lib/parseScoreParam.ts lib/__tests__/parseScoreParam.test.ts
git commit -m "feat: add parseScoreParam helper + unit tests"
```

---

### Task 2: Wire URL param into TestEngine (sharedScore state)

**Files:**
- Modify: `components/TestEngine.tsx`

- [ ] **Step 1: Add import**

At the top of `components/TestEngine.tsx`, after the existing imports, add:
```typescript
import { parseScoreParam } from "@/lib/parseScoreParam";
```

- [ ] **Step 2: Add sharedScore and copied states**

Inside `TestEngine`, directly after the `const overlayRef = useRef<HTMLDivElement>(null);` line, add:
```typescript
const [sharedScore, setSharedScore] = useState<number | null>(null);
const [copied, setCopied] = useState(false);
```

- [ ] **Step 3: Add mount effect for URL reading**

After the existing scroll `useEffect` (the one that calls `overlayRef.current?.scrollTo`), add:
```typescript
useEffect(() => {
  const max = totalQuestions * maxValue;
  const parsed = parseScoreParam(window.location.search, max);
  if (parsed !== null) {
    setSharedScore(parsed);
    setPhase("results");
  }
}, []);
```

- [ ] **Step 4: Update finalScore to use sharedScore**

In the results section (after both `if (phase === "intro")` and `if (phase === "test")` early returns), find:
```typescript
const finalScore = calculateScore(answers, config.questions, maxValue);
```
Replace with:
```typescript
const finalScore = sharedScore ?? calculateScore(answers, config.questions, maxValue);
```

- [ ] **Step 5: Verify in browser**

Start dev server (`npm run dev`). Navigate to:
```
http://localhost:3000/اختبار-الاكتئاب?score=12
```
Expected: Results phase loads immediately. The big hero numeral shows "12". No questions appear.

- [ ] **Step 6: Commit**

```bash
git add components/TestEngine.tsx
git commit -m "feat: read ?score URL param and jump directly to results phase"
```

---

### Task 3: Share block UI + copy link + stub handlers

**Files:**
- Modify: `components/TestEngine.tsx`

- [ ] **Step 1: Add handlers in the results block**

In the results section, after the `currentCatColor` declaration and BEFORE the `return (`, add:

```typescript
const shareUrl = `${window.location.origin}/${config.slug}?score=${finalScore}`;

function handleCopyLink() {
  navigator.clipboard.writeText(shareUrl).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

async function drawResultsCard(): Promise<Blob> {
  // Full implementation in Task 4
  const c = document.createElement("canvas");
  c.width = 1; c.height = 1;
  return new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
}

async function handleDownload() {
  const blob = await drawResultsCard();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = "نتائجي-واعي.png";
  a.click();
  URL.revokeObjectURL(blobUrl);
}

async function handleShare() {
  const blob = await drawResultsCard();
  const file = new File([blob], "نتائجي-واعي.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: `نتائجي على واعي: ${scoreRange.label}`,
      url: shareUrl,
    });
  } else {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
}
```

- [ ] **Step 2: Insert share block JSX**

In the results `return (...)`, find the `{/* Retake + Home */}` comment. Insert the following block IMMEDIATELY BEFORE that comment:

```tsx
{/* Share block */}
<div style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 10 }}>
  <div style={{ fontSize: 11, color: "var(--waaei-mute)", fontWeight: 700, letterSpacing: 1 }}>
    شارك نتائجك
  </div>
  <div style={{ display: "flex", gap: 8 }}>
    <button
      type="button"
      onClick={handleDownload}
      style={{
        flex: 1, padding: "12px 4px",
        background: "var(--waaei-surface)", color: "var(--waaei-ink)",
        border: "1px solid var(--waaei-rule)", borderRadius: 12,
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}
    >
      <span style={{ fontSize: 18 }}>⬇</span>
      حفظ كصورة
    </button>
    <button
      type="button"
      onClick={handleShare}
      style={{
        flex: 1, padding: "12px 4px",
        background: "var(--waaei-surface)", color: "var(--waaei-ink)",
        border: "1px solid var(--waaei-rule)", borderRadius: 12,
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}
    >
      <span style={{ fontSize: 18 }}>↗</span>
      مشاركة
    </button>
    <button
      type="button"
      onClick={handleCopyLink}
      style={{
        flex: 1, padding: "12px 4px",
        background: copied ? "var(--waaei-ink)" : "var(--waaei-surface)",
        color: copied ? "var(--waaei-bg)" : "var(--waaei-ink)",
        border: copied ? "1px solid var(--waaei-ink)" : "1px solid var(--waaei-rule)",
        borderRadius: 12,
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        transition: "all .2s",
      }}
    >
      <span style={{ fontSize: 18 }}>{copied ? "✓" : "🔗"}</span>
      {copied ? "تم النسخ" : "نسخ الرابط"}
    </button>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Complete a test. The share block appears with 3 buttons above "أعد الاختبار". Click "نسخ الرابط" — button turns ink-colored with "تم النسخ", resets after 2 seconds. Click "حفظ كصورة" — a 1×1 PNG downloads (placeholder; card comes in Task 4).

- [ ] **Step 4: Commit**

```bash
git add components/TestEngine.tsx
git commit -m "feat: add share block UI with copy link and stubbed download/share handlers"
```

---

### Task 4: Implement drawResultsCard (Canvas PNG)

**Files:**
- Modify: `components/TestEngine.tsx` — replace the `drawResultsCard` stub

Colors used (hardcoded because Canvas cannot read CSS custom properties):
- bg: `#eef2ea`, ink: `#1f2a23`, mute: `#6e7a70`
- `bandColor` and `catColor` are already declared in the results block and in scope

- [ ] **Step 1: Replace drawResultsCard stub**

Find and replace the stub `drawResultsCard` function (the 3-line placeholder) with:

```typescript
async function drawResultsCard(): Promise<Blob> {
  const size = 1080;
  const pad = 80;
  const barW = size - 2 * pad;
  const barH = 20;
  const totalPossible = maxScore + 1;

  await document.fonts.load("800 32px Tajawal");
  await document.fonts.load("700 32px Tajawal");

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.direction = "rtl";

  // Background
  ctx.fillStyle = "#eef2ea";
  ctx.fillRect(0, 0, size, size);

  // ── Logo mark: dark-green rounded tile with "و" (top-right) ──
  const tileSize = 56;
  const tileX = size - pad - tileSize;
  const tileY = pad;
  ctx.fillStyle = "#1f2a23";
  ctx.beginPath();
  ctx.roundRect(tileX, tileY, tileSize, tileSize, 16);
  ctx.fill();
  ctx.fillStyle = "#eef2ea";
  ctx.font = "700 30px Tajawal";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("و", tileX + tileSize / 2, tileY + tileSize / 2 + 2);

  // ── "واعي" wordmark immediately left of tile ──
  ctx.fillStyle = "#1f2a23";
  ctx.font = "800 30px Tajawal";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("واعي", tileX - 12, tileY + tileSize / 2);

  // ── Category pill ──
  const pillY = tileY + tileSize + 40;
  ctx.font = "700 18px Tajawal";
  const pillMetrics = ctx.measureText(config.name);
  const pillPadH = 16;
  const pillH = 36;
  const pillW = pillMetrics.width + pillPadH * 2 + 20; // 20 for dot
  ctx.fillStyle = `${currentCatColor}30`;
  ctx.beginPath();
  ctx.roundRect(size - pad - pillW, pillY, pillW, pillH, 18);
  ctx.fill();
  // Dot
  ctx.fillStyle = currentCatColor;
  ctx.beginPath();
  ctx.arc(size - pad - 12, pillY + pillH / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  // Pill text
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(config.name, size - pad - 26, pillY + pillH / 2);

  // ── Big score numeral ──
  const scoreY = pillY + pillH + 24;
  ctx.fillStyle = "#1f2a23";
  ctx.font = "800 160px Tajawal";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(String(finalScore), size - pad, scoreY);

  // "/ maxScore" subscript
  ctx.fillStyle = "#6e7a70";
  ctx.font = "400 36px Tajawal";
  ctx.textBaseline = "top";
  ctx.fillText(`/ ${maxScore}`, size - pad - 200, scoreY + 116);

  // ── "أعراض" label + colored severity word ──
  const labelY = scoreY + 184;
  ctx.fillStyle = "#1f2a23";
  ctx.font = "700 26px Tajawal";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("أعراض", size - pad, labelY);
  ctx.fillStyle = currentBandColor;
  ctx.font = "800 52px Tajawal";
  ctx.fillText(scoreRange.label, size - pad, labelY + 34);

  // ── Scale bar (RTL: severe=left, none=right) ──
  const barY = labelY + 120;
  const reversedRanges = [...config.scoreRanges].reverse(); // severe first → leftmost
  let bx = pad;
  reversedRanges.forEach((band, i) => {
    const w = Math.floor(((band.max - band.min + 1) / totalPossible) * barW);
    ctx.globalAlpha = band.severity === scoreRange.severity ? 1 : 0.35;
    ctx.fillStyle = bandColor[band.severity] ?? "#9ec79f";
    ctx.beginPath();
    const isFirst = i === 0;
    const isLast = i === reversedRanges.length - 1;
    // roundRect radii: [top-left, top-right, bottom-right, bottom-left]
    ctx.roundRect(bx, barY, w - 2, barH, isFirst ? [4, 0, 0, 4] : isLast ? [0, 4, 4, 0] : 2);
    ctx.fill();
    bx += w;
  });
  ctx.globalAlpha = 1;

  // ── "أنت" chip + arrow (clamped so chip never goes off-canvas) ──
  const chipW = 52;
  const chipH = 26;
  // RTL: score=0 → right edge (x = size-pad), score=maxScore → left edge (x = pad)
  const rawMarkerX = Math.round((size - pad) - (finalScore / maxScore) * barW);
  const markerX = Math.max(pad + chipW / 2, Math.min(size - pad - chipW / 2, rawMarkerX));
  const chipY = barY - chipH - 8;
  ctx.fillStyle = "#1f2a23";
  ctx.beginPath();
  ctx.roundRect(markerX - chipW / 2, chipY, chipW, chipH, 6);
  ctx.fill();
  ctx.fillStyle = "#eef2ea";
  ctx.font = "700 18px Tajawal";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("أنت", markerX, chipY + chipH / 2);
  // Arrow pointing down into bar
  ctx.fillStyle = "#1f2a23";
  ctx.beginPath();
  ctx.moveTo(markerX - 5, barY - 1);
  ctx.lineTo(markerX + 5, barY - 1);
  ctx.lineTo(markerX, barY + 6);
  ctx.closePath();
  ctx.fill();

  // ── "waaei.me" domain at bottom center ──
  ctx.fillStyle = "#6e7a70";
  ctx.font = "400 26px Tajawal";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("waaei.me", size / 2, size - pad);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas.toBlob failed"))), "image/png")
  );
}
```

- [ ] **Step 2: Test download**

Complete any test. Click "حفظ كصورة". A file named `نتائجي-واعي.png` should download. Open it — verify: واعي logo mark top-right, wordmark, category pill, score numeral, "أعراض X" label, colored scale bar with "أنت" chip, "waaei.me" at the bottom.

- [ ] **Step 3: Test social share (mobile emulation)**

Open DevTools → toggle mobile emulation (any phone preset). Complete a test. Click "مشاركة". The native share sheet should open with the image attached.

On desktop (no Web Share): clicking "مشاركة" should silently copy the URL and briefly show "تم النسخ" on the copy button.

- [ ] **Step 4: Commit**

```bash
git add components/TestEngine.tsx
git commit -m "feat: implement drawResultsCard — 1080x1080 canvas PNG share card"
```

---

### Task 5: Playwright MCP verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```
Server starts at http://localhost:3000.

- [ ] **Step 2: Navigate to a test**

Use Playwright MCP to navigate to `http://localhost:3000/اختبار-القلق`.
Expected: GAD-7 test intro page with "ابدأ الاختبار" button.

- [ ] **Step 3: Complete the test**

Click "ابدأ الاختبار". For each of the 7 questions: click the first answer option (value=0, "لا، أبداً"). Click "التالي" after each. On the last question, click "عرض النتيجة".

- [ ] **Step 4: Verify share block**

Take a screenshot. Confirm "شارك نتائجك" heading is visible. Confirm the three buttons — "حفظ كصورة", "مشاركة", "نسخ الرابط" — appear in a row above "أعد الاختبار".

- [ ] **Step 5: Test copy link**

Click "نسخ الرابط". Verify the button label changes to "تم النسخ". Run in browser console:
```javascript
await navigator.clipboard.readText()
```
Verify clipboard value is `http://localhost:3000/اختبار-القلق?score=0`.

- [ ] **Step 6: Verify shareable URL**

Navigate to `http://localhost:3000/اختبار-القلق?score=14`.
Expected: Results phase loads directly. The "النتيجة" heading is visible, the hero numeral shows "14". No question UI appears.

- [ ] **Step 7: Commit any fixes**

If any visual issues were caught and fixed during verification:
```bash
git add components/TestEngine.tsx
git commit -m "fix: adjust share card layout from Playwright review"
```
