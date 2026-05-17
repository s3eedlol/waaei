# Arabic Mental Health Hub (نفسي) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Phase 1 Arabic-language mental health self-assessment site with 5 clinically-validated tests (PHQ-9, GAD-7, Burnout, PSS, OCI-R), full RTL UI, client-side scoring, and Vercel deployment.

**Architecture:** Next.js App Router with a single `TestEngine` component that accepts a `TestConfig` object — each test page is a thin wrapper that passes its config to the engine. All scoring is client-side in the browser (no backend, no accounts, fully anonymous).

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS (RTL via `dir="rtl"`) · shadcn/ui · Cairo Google Font · Vitest for scoring unit tests · Vercel deployment

---

## File Map

```
app/
  layout.tsx                        # Root layout: dir="rtl", Cairo font, base metadata
  page.tsx                          # Home: responsive grid of TestCards
  globals.css                       # Custom properties, Cairo import, base resets
  اختبار-الاكتئاب/page.tsx          # PHQ-9 (depression)
  اختبار-القلق/page.tsx             # GAD-7 (anxiety)
  اختبار-الإرهاق-الوظيفي/page.tsx  # Burnout (MBI-short)
  اختبار-التوتر/page.tsx            # PSS-10 (stress)
  اختبار-الوسواس-القهري/page.tsx    # OCI-R (OCD)
  sitemap.ts                        # Next.js sitemap generator

components/
  TestEngine.tsx     # Full test flow: intro → questions → results
  TestCard.tsx       # Home page card per test
  Header.tsx         # Site header with nav
  Footer.tsx         # Simple footer with disclaimer

lib/
  types.ts           # TestConfig, Question, Answer, ScoreRange interfaces
  scoring.ts         # calculateScore(), getScoreRange()
  tests/
    phq9.ts          # PHQ-9 config (depression)
    gad7.ts          # GAD-7 config (anxiety)
    burnout.ts       # Burnout config
    pss.ts           # PSS-10 config (stress)
    ocir.ts          # OCI-R config (OCD)

__tests__/
  scoring.test.ts    # Unit tests for scoring functions
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: all project files via `create-next-app`

- [ ] **Step 1: Scaffold Next.js project**

Run from `C:\Users\saeed\OneDrive\Desktop\claude\mental health hub`:
```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```
Expected: project files created, `package.json`, `app/`, `tailwind.config.ts` present.

- [ ] **Step 2: Install additional dependencies**

```powershell
npm install class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-progress @radix-ui/react-radio-group
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
npx shadcn@latest init --defaults --yes
```
When prompted by shadcn init, accept defaults (New York style, zinc base color, CSS variables yes).

- [ ] **Step 3: Add shadcn components**

```powershell
npx shadcn@latest add button card progress badge separator
```

- [ ] **Step 4: Verify dev server starts**

```powershell
npm run dev
```
Expected: server on http://localhost:3000 with default Next.js page. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```powershell
git init
git add .
git commit -m "feat: scaffold Next.js project with shadcn/ui"
```

---

### Task 2: Tailwind Config, Fonts & Globals

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Update `tailwind.config.ts`**

Replace the entire file with:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
      colors: {
        sage: {
          50: "#f2f7f2",
          100: "#e0ece0",
          200: "#c2d9c2",
          300: "#96bc96",
          400: "#5b8c5a",
          500: "#4a7a49",
          600: "#3a623a",
          700: "#2f4f2e",
          800: "#274127",
          900: "#1e321e",
        },
        mist: {
          50: "#f0f6fa",
          100: "#dceef6",
          200: "#b3d8ec",
          300: "#7ab7d8",
          400: "#5b8c9e",
          500: "#4a7a8c",
          600: "#3a6275",
          700: "#2e4f5f",
          800: "#25404d",
          900: "#1c3340",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update `app/globals.css`**

Replace the entire file with:
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 40 20% 98%;
    --foreground: 240 10% 12%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 12%;
    --primary: 122 21% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 200 25% 48%;
    --secondary-foreground: 0 0% 100%;
    --muted: 40 10% 94%;
    --muted-foreground: 240 5% 48%;
    --accent: 40 10% 94%;
    --accent-foreground: 240 10% 12%;
    --border: 40 10% 90%;
    --input: 40 10% 90%;
    --ring: 122 21% 45%;
    --radius: 1rem;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-cairo), system-ui, sans-serif;
    direction: rtl;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.3;
  }

  p {
    line-height: 1.8;
  }
}
```

- [ ] **Step 3: Update `app/layout.tsx`**

Replace the entire file with:
```typescript
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
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
```

- [ ] **Step 4: Configure Vitest in `vitest.config.ts`**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Create `vitest.setup.ts`:
```typescript
import "@testing-library/jest-dom";
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Commit**

```powershell
git add .
git commit -m "feat: configure Tailwind RTL theme, Cairo font, and Vitest"
```

---

### Task 3: Type System

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
export interface Question {
  id: number;
  text: string;
  reversed?: boolean; // for PSS items that score inversely
}

export interface AnswerOption {
  label: string;
  value: number;
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  severity: "none" | "mild" | "moderate" | "moderateHigh" | "severe";
  description: string;
  recommendation: string;
  color: string; // Tailwind bg class for result card accent
}

export interface TestConfig {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  estimatedMinutes: number;
  questions: Question[];
  answerOptions: AnswerOption[];
  scoreRanges: ScoreRange[];
  disclaimer: string;
  category: "mood" | "anxiety" | "work" | "stress" | "ocd";
  icon: string; // emoji used on cards
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/types.ts
git commit -m "feat: add TestConfig type definitions"
```

---

### Task 4: Scoring Utility + Tests

**Files:**
- Create: `lib/scoring.ts`
- Create: `__tests__/scoring.test.ts`

- [ ] **Step 1: Write failing tests first**

Create `__tests__/scoring.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { calculateScore, getScoreRange } from "@/lib/scoring";
import { phq9Config } from "@/lib/tests/phq9";

describe("calculateScore", () => {
  it("sums all answer values", () => {
    const answers = { 1: 3, 2: 2, 3: 1, 4: 0, 5: 2, 6: 1, 7: 3, 8: 1, 9: 0 };
    expect(calculateScore(answers)).toBe(13);
  });

  it("returns 0 for all zeros", () => {
    const answers = { 1: 0, 2: 0, 3: 0 };
    expect(calculateScore(answers)).toBe(0);
  });

  it("handles reversed items (PSS)", () => {
    // item 1 is normal (value=3 → 3), item 2 is reversed (value=2 → 2, reversed=4-2=2)
    const answers = { 1: 3, 2: 2 };
    const questions = [
      { id: 1, text: "q1" },
      { id: 2, text: "q2", reversed: true },
    ];
    expect(calculateScore(answers, questions, 4)).toBe(5); // 3 + (4-2)
  });
});

describe("getScoreRange", () => {
  it("returns mild range for PHQ-9 score 7", () => {
    const range = getScoreRange(7, phq9Config);
    expect(range.severity).toBe("mild");
  });

  it("returns severe range for PHQ-9 score 22", () => {
    const range = getScoreRange(22, phq9Config);
    expect(range.severity).toBe("severe");
  });

  it("returns none range for PHQ-9 score 0", () => {
    const range = getScoreRange(0, phq9Config);
    expect(range.severity).toBe("none");
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```powershell
npm test
```
Expected: FAIL — `@/lib/scoring` and `@/lib/tests/phq9` not yet defined.

- [ ] **Step 3: Create `lib/scoring.ts`**

```typescript
import { TestConfig, Question } from "./types";

export function calculateScore(
  answers: Record<number, number>,
  questions?: Question[],
  maxValue = 3
): number {
  return Object.entries(answers).reduce((sum, [idStr, value]) => {
    const id = Number(idStr);
    const question = questions?.find((q) => q.id === id);
    const score = question?.reversed ? maxValue - value : value;
    return sum + score;
  }, 0);
}

export function getScoreRange(score: number, config: TestConfig) {
  const range = config.scoreRanges.find(
    (r) => score >= r.min && score <= r.max
  );
  if (!range) throw new Error(`No score range found for score ${score}`);
  return range;
}
```

- [ ] **Step 4: Run tests — expect FAIL (phq9 still missing)**

```powershell
npm test
```
Expected: scoring tests pass, phq9 import still fails. That's OK — phq9 is created in Task 5.

- [ ] **Step 5: Commit scoring utility**

```powershell
git add lib/scoring.ts __tests__/scoring.test.ts
git commit -m "feat: add scoring utility with unit tests"
```

---

### Task 5: PHQ-9 Test Data

**Files:**
- Create: `lib/tests/phq9.ts`

- [ ] **Step 1: Create `lib/tests/phq9.ts`**

```typescript
import { TestConfig } from "../types";

export const phq9Config: TestConfig = {
  id: "phq9",
  slug: "اختبار-الاكتئاب",
  name: "اختبار الاكتئاب",
  shortDescription: "هل تشعر بالحزن أو فقدان الاهتمام؟ تعرّف على مستوى مزاجك",
  longDescription:
    "يعتمد هذا الاختبار على مقياس PHQ-9، وهو أداة مُتحقَّق منها طبياً تُستخدم في أبحاث الصحة النفسية حول العالم. يساعدك على فهم ما تمر به، ولا يُعدّ تشخيصاً طبياً.",
  estimatedMinutes: 3,
  category: "mood",
  icon: "🌿",
  answerOptions: [
    { label: "أبداً", value: 0 },
    { label: "عدة أيام", value: 1 },
    { label: "أكثر من نصف الأيام", value: 2 },
    { label: "كل يوم تقريباً", value: 3 },
  ],
  questions: [
    {
      id: 1,
      text: "الشعور بالاكتئاب أو اليأس أو فقدان الأمل",
    },
    {
      id: 2,
      text: "فقدان الاهتمام أو المتعة في الأشياء التي كنت تستمتع بها",
    },
    {
      id: 3,
      text: "صعوبة في النوم أو النوم أكثر من المعتاد",
    },
    {
      id: 4,
      text: "الشعور بالتعب أو نقص الطاقة",
    },
    {
      id: 5,
      text: "ضعف الشهية أو الإفراط في الأكل",
    },
    {
      id: 6,
      text: "الشعور بالذنب أو أنك فاشل أو خذلت نفسك أو عائلتك",
    },
    {
      id: 7,
      text: "صعوبة في التركيز على الأشياء مثل قراءة الجريدة أو مشاهدة التلفزيون",
    },
    {
      id: 8,
      text: "التحرك أو الكلام ببطء شديد لدرجة أن الآخرين لاحظوا ذلك، أو العكس",
    },
    {
      id: 9,
      text: "أفكار بأنك أفضل ميتاً أو بإيذاء نفسك",
    },
  ],
  scoreRanges: [
    {
      min: 0,
      max: 4,
      label: "لا توجد أعراض تذكر",
      severity: "none",
      color: "bg-sage-100 border-sage-300",
      description:
        "نتيجتك تشير إلى أنك لا تعاني من أعراض الاكتئاب حالياً. الحفاظ على الصحة النفسية ممارسة يومية — استمر في رعاية نفسك.",
      recommendation:
        "استمر في ممارسة العادات الصحية مثل النوم الكافي والتواصل الاجتماعي والنشاط البدني. إذا شعرت بتغيّر في مزاجك لاحقاً، يمكنك إعادة الاختبار.",
    },
    {
      min: 5,
      max: 9,
      label: "أعراض خفيفة",
      severity: "mild",
      color: "bg-yellow-50 border-yellow-200",
      description:
        "نتيجتك تشير إلى وجود بعض الأعراض الخفيفة. هذا شائع ويمكن أن يكون استجابةً طبيعية للضغوط اليومية.",
      recommendation:
        "انتبه لصحتك النفسية. يساعد النوم المنتظم، والحركة اليومية، والتحدث مع شخص تثق به. إذا استمرت الأعراض أكثر من أسبوعين، فكّر في التحدث مع متخصص.",
    },
    {
      min: 10,
      max: 14,
      label: "أعراض متوسطة",
      severity: "moderate",
      color: "bg-orange-50 border-orange-200",
      description:
        "نتيجتك تشير إلى وجود أعراض متوسطة تستحق الاهتمام. ما تشعر به حقيقي، والمساعدة متاحة.",
      recommendation:
        "ننصحك بالتحدث مع طبيب أو معالج نفسي. العلاج المبكر فعّال جداً. يمكنك استشارة معالج متخصص عبر الإنترنت إذا كنت تفضل الخصوصية.",
    },
    {
      min: 15,
      max: 19,
      label: "أعراض متوسطة إلى شديدة",
      severity: "moderateHigh",
      color: "bg-red-50 border-red-200",
      description:
        "نتيجتك تشير إلى أعراض تؤثر على حياتك اليومية وتحتاج لاهتمام جدي. أنت لست وحدك في هذا.",
      recommendation:
        "يُنصح بشدة بالتحدث مع متخصص في الصحة النفسية في أقرب وقت. العلاج النفسي والدعم المتخصص يُحدثان فرقاً حقيقياً. لا تؤجّل طلب المساعدة.",
    },
    {
      min: 20,
      max: 27,
      label: "أعراض شديدة",
      severity: "severe",
      color: "bg-red-100 border-red-300",
      description:
        "نتيجتك تشير إلى أعراض شديدة. ما تمر به صعب، ومن المهم جداً أن تتلقى دعماً متخصصاً الآن.",
      recommendation:
        "يُرجى التواصل مع طبيب أو معالج نفسي في أقرب وقت ممكن. إذا كانت لديك أفكار بإيذاء نفسك، تحدّث مع شخص تثق به الآن أو اطلب المساعدة من مختص.",
    },
  ],
  disclaimer:
    "هذا الاختبار أداة للتوعية الذاتية وليس تشخيصاً طبياً. النتائج سرية تماماً ولا تُحفظ على أي خادم.",
};
```

- [ ] **Step 2: Run tests — all should pass now**

```powershell
npm test
```
Expected: all scoring tests PASS.

- [ ] **Step 3: Commit**

```powershell
git add lib/tests/phq9.ts
git commit -m "feat: add PHQ-9 test config data"
```

---

### Task 6: Remaining Test Data (GAD-7, Burnout, PSS, OCI-R)

**Files:**
- Create: `lib/tests/gad7.ts`
- Create: `lib/tests/burnout.ts`
- Create: `lib/tests/pss.ts`
- Create: `lib/tests/ocir.ts`

- [ ] **Step 1: Create `lib/tests/gad7.ts`**

```typescript
import { TestConfig } from "../types";

export const gad7Config: TestConfig = {
  id: "gad7",
  slug: "اختبار-القلق",
  name: "اختبار القلق",
  shortDescription: "هل تعاني من قلق مستمر؟ اكتشف مستوى قلقك",
  longDescription:
    "يعتمد هذا الاختبار على مقياس GAD-7، وهو أداة مُتحقَّق منها دولياً للكشف عن اضطراب القلق العام. يساعدك على فهم ما إذا كان ما تشعر به يستحق الاهتمام.",
  estimatedMinutes: 2,
  category: "anxiety",
  icon: "🌊",
  answerOptions: [
    { label: "أبداً", value: 0 },
    { label: "عدة أيام", value: 1 },
    { label: "أكثر من نصف الأيام", value: 2 },
    { label: "كل يوم تقريباً", value: 3 },
  ],
  questions: [
    { id: 1, text: "الشعور بالتوتر أو القلق أو الانفعال الشديد" },
    { id: 2, text: "عدم القدرة على التوقف عن القلق أو التحكم فيه" },
    { id: 3, text: "القلق الزائد بشأن أشياء مختلفة" },
    { id: 4, text: "صعوبة الاسترخاء" },
    { id: 5, text: "الانفعال الشديد لدرجة صعوبة الجلوس ساكناً" },
    { id: 6, text: "الشعور بالانزعاج أو التهيج أو سرعة الغضب بسهولة" },
    { id: 7, text: "الشعور بالخوف كأن شيئاً فظيعاً سيحدث" },
  ],
  scoreRanges: [
    {
      min: 0,
      max: 4,
      label: "قلق طبيعي",
      severity: "none",
      color: "bg-sage-100 border-sage-300",
      description:
        "نتيجتك تشير إلى أن مستوى قلقك ضمن الحدود الطبيعية. القليل من القلق صحي ويساعدنا على التعامل مع تحديات الحياة.",
      recommendation:
        "استمر في الاهتمام بصحتك النفسية. ممارسات مثل التنفس العميق والنوم الكافي تساعد على الحفاظ على مستوى قلق صحي.",
    },
    {
      min: 5,
      max: 9,
      label: "قلق خفيف",
      severity: "mild",
      color: "bg-yellow-50 border-yellow-200",
      description:
        "نتيجتك تشير إلى وجود قلق خفيف. هذا المستوى شائع ويمكن إدارته بأساليب بسيطة.",
      recommendation:
        "جرّب تقنيات إدارة القلق مثل التنفس العميق والتأمل. تقليل الكافيين والحصول على نوم كافٍ يساعد كثيراً. إذا استمر الشعور، استشر متخصصاً.",
    },
    {
      min: 10,
      max: 14,
      label: "قلق متوسط",
      severity: "moderate",
      color: "bg-orange-50 border-orange-200",
      description:
        "نتيجتك تشير إلى قلق متوسط قد يؤثر على يومياتك. ما تشعر به حقيقي ويستحق الاهتمام.",
      recommendation:
        "ننصح بالتحدث مع معالج نفسي. العلاج المعرفي السلوكي فعّال جداً لاضطراب القلق. لا تتردد في طلب المساعدة.",
    },
    {
      min: 15,
      max: 21,
      label: "قلق شديد",
      severity: "severe",
      color: "bg-red-50 border-red-200",
      description:
        "نتيجتك تشير إلى قلق شديد يؤثر بشكل ملحوظ على حياتك. أنت تستحق الدعم والمساعدة.",
      recommendation:
        "يُنصح بشدة بالتواصل مع متخصص في الصحة النفسية في أقرب وقت. العلاج المناسب يمكن أن يُحدث فرقاً كبيراً في جودة حياتك.",
    },
  ],
  disclaimer:
    "هذا الاختبار أداة للتوعية الذاتية وليس تشخيصاً طبياً. النتائج سرية تماماً ولا تُحفظ على أي خادم.",
};
```

- [ ] **Step 2: Create `lib/tests/burnout.ts`**

```typescript
import { TestConfig } from "../types";

export const burnoutConfig: TestConfig = {
  id: "burnout",
  slug: "اختبار-الإرهاق-الوظيفي",
  name: "اختبار الإرهاق الوظيفي",
  shortDescription: "هل تشعر بالاستنزاف من عملك؟ تعرّف على مستوى إرهاقك",
  longDescription:
    "الاحتراق الوظيفي حالة نفسية ناتجة عن الإجهاد المزمن في مكان العمل. يساعدك هذا الاختبار على تقييم ما إذا كنت تعاني من علامات الاحتراق الوظيفي وفق أبعاده الثلاثة: الإرهاق العاطفي، وفقدان الدافعية، والشعور بانعدام الإنجاز.",
  estimatedMinutes: 3,
  category: "work",
  icon: "🌑",
  answerOptions: [
    { label: "أبداً", value: 0 },
    { label: "نادراً", value: 1 },
    { label: "أحياناً", value: 2 },
    { label: "غالباً", value: 3 },
    { label: "دائماً تقريباً", value: 4 },
  ],
  questions: [
    { id: 1, text: "أشعر بالإرهاق العاطفي من عملي" },
    { id: 2, text: "أشعر بالانهاك في نهاية يوم العمل" },
    { id: 3, text: "أشعر بالتعب حين أستيقظ صباحاً وأفكر في مواجهة يوم عمل آخر" },
    { id: 4, text: "أشعر بأن العمل يستنزفني نفسياً وعاطفياً" },
    { id: 5, text: "أشعر بخيبة أمل من عملي" },
    { id: 6, text: "أشعر بأنني أعمل بجهد زائد في وظيفتي" },
    { id: 7, text: "أصبحت أقل اكتراثاً بما يحدث لزملائي أو عملائي" },
    { id: 8, text: "أشعر بأن عملي يجعلني أكثر قسوة على الناس" },
    { id: 9, text: "لا أستطيع تحقيق إنجازات حقيقية في هذه الوظيفة" },
    { id: 10, text: "أشعر بأنني وصلت إلى نهاية طاقتي" },
  ],
  scoreRanges: [
    {
      min: 0,
      max: 12,
      label: "لا يوجد احتراق وظيفي",
      severity: "none",
      color: "bg-sage-100 border-sage-300",
      description:
        "نتيجتك تشير إلى أنك لا تعاني من علامات الاحتراق الوظيفي حالياً. وضعك جيد في ما يخص التوازن بين العمل والحياة.",
      recommendation:
        "استمر في الحفاظ على التوازن الصحي. خصّص وقتاً للراحة والهوايات، واحرص على الفصل بين وقت العمل والوقت الشخصي.",
    },
    {
      min: 13,
      max: 22,
      label: "إرهاق وظيفي خفيف",
      severity: "mild",
      color: "bg-yellow-50 border-yellow-200",
      description:
        "نتيجتك تشير إلى بعض علامات الإرهاق الوظيفي. هذه إشارة مبكرة تستحق الانتباه قبل أن تتطور.",
      recommendation:
        "انتبه لحدودك وتعلّم قول لا عند الضرورة. خذ استراحات منتظمة خلال يوم العمل. تحدّث مع مديرك عن توزيع المهام إذا كان العبء زائداً.",
    },
    {
      min: 23,
      max: 31,
      label: "إرهاق وظيفي متوسط",
      severity: "moderate",
      color: "bg-orange-50 border-orange-200",
      description:
        "نتيجتك تشير إلى احتراق وظيفي متوسط يؤثر على طاقتك وحماسك. الوضع يستدعي تغييرات فعلية.",
      recommendation:
        "خذ استراحة حقيقية من العمل إذا أمكن. راجع أولوياتك وحدودك المهنية. قد يفيدك التحدث مع معالج نفسي أو مستشار مهني.",
    },
    {
      min: 32,
      max: 40,
      label: "احتراق وظيفي شديد",
      severity: "severe",
      color: "bg-red-50 border-red-200",
      description:
        "نتيجتك تشير إلى احتراق وظيفي شديد. ما تشعر به جدي ويؤثر على صحتك وحياتك بشكل عام.",
      recommendation:
        "يُنصح بالتحدث مع متخصص في الصحة النفسية. قد تحتاج لإجازة وتغييرات جوهرية في بيئة عملك. صحتك أهم من أي وظيفة.",
    },
  ],
  disclaimer:
    "هذا الاختبار أداة للتوعية الذاتية وليس تشخيصاً طبياً. النتائج سرية تماماً ولا تُحفظ على أي خادم.",
};
```

- [ ] **Step 3: Create `lib/tests/pss.ts`**

```typescript
import { TestConfig } from "../types";

export const pssConfig: TestConfig = {
  id: "pss",
  slug: "اختبار-التوتر",
  name: "اختبار التوتر النفسي",
  shortDescription: "كيف مستوى الضغط النفسي في حياتك؟ اكتشفه الآن",
  longDescription:
    "يعتمد هذا الاختبار على مقياس الضغط النفسي المُدرَك PSS-10، وهو من أكثر المقاييس استخداماً في أبحاث الصحة النفسية عالمياً. يقيس الأسئلة خلال الشهر الماضي.",
  estimatedMinutes: 3,
  category: "stress",
  icon: "🍃",
  answerOptions: [
    { label: "أبداً", value: 0 },
    { label: "نادراً", value: 1 },
    { label: "أحياناً", value: 2 },
    { label: "غالباً", value: 3 },
    { label: "دائماً", value: 4 },
  ],
  questions: [
    { id: 1, text: "شعرت بانزعاج بسبب حدث غير متوقع" },
    { id: 2, text: "شعرت بأنك غير قادر على التحكم في الأمور المهمة في حياتك" },
    { id: 3, text: "شعرت بالتوتر والضغط النفسي" },
    { id: 4, text: "تعاملت بنجاح مع المشاكل اليومية المزعجة", reversed: true },
    { id: 5, text: "شعرت بأنك تتعامل بفاعلية مع التغييرات المهمة في حياتك", reversed: true },
    { id: 6, text: "شعرت بثقتك في قدرتك على حل مشاكلك الشخصية", reversed: true },
    { id: 7, text: "شعرت بأن الأمور تسير وفق ما تريد", reversed: true },
    { id: 8, text: "وجدت صعوبة في إنجاز ما عليك القيام به" },
    { id: 9, text: "استطعت التحكم في مشاعر التوتر لديك", reversed: true },
    { id: 10, text: "شعرت بأن الأمور كانت خارجة عن سيطرتك" },
  ],
  scoreRanges: [
    {
      min: 0,
      max: 13,
      label: "مستوى توتر منخفض",
      severity: "none",
      color: "bg-sage-100 border-sage-300",
      description:
        "نتيجتك تشير إلى أنك تتعامل جيداً مع ضغوط الحياة. تمتلك مهارات جيدة في إدارة التوتر.",
      recommendation:
        "استمر في استخدام استراتيجيات إدارة الضغط التي تعتمد عليها. الحفاظ على هذا المستوى يعني الاستمرار في ممارسة عاداتك الصحية.",
    },
    {
      min: 14,
      max: 26,
      label: "مستوى توتر متوسط",
      severity: "moderate",
      color: "bg-yellow-50 border-yellow-200",
      description:
        "نتيجتك تشير إلى مستوى توتر متوسط. هذا شائع في حياتنا المعاصرة، لكن الأمر يستحق الاهتمام.",
      recommendation:
        "جرّب تقنيات إدارة التوتر مثل التمرين المنتظم والتأمل وتحديد الأولويات. احرص على الاستراحة اليومية من الشاشات والمسؤوليات.",
    },
    {
      min: 27,
      max: 40,
      label: "مستوى توتر مرتفع",
      severity: "severe",
      color: "bg-red-50 border-red-200",
      description:
        "نتيجتك تشير إلى مستوى توتر مرتفع يؤثر على جودة حياتك. ما تشعر به يستحق الاهتمام الجدي.",
      recommendation:
        "يُنصح بالتحدث مع متخصص لمساعدتك على تطوير استراتيجيات فعّالة لإدارة التوتر. التوتر المزمن له آثار على الصحة الجسدية أيضاً.",
    },
  ],
  disclaimer:
    "هذا الاختبار يقيس التوتر خلال الشهر الماضي. النتائج سرية تماماً ولا تُحفظ على أي خادم.",
};
```

- [ ] **Step 4: Create `lib/tests/ocir.ts`**

```typescript
import { TestConfig } from "../types";

export const ocirConfig: TestConfig = {
  id: "ocir",
  slug: "اختبار-الوسواس-القهري",
  name: "اختبار الوسواس القهري",
  shortDescription: "هل تعاني من أفكار متكررة أو سلوكيات قهرية؟",
  longDescription:
    "يعتمد هذا الاختبار على نسخة مختصرة من مقياس OCI-R للوسواس القهري. يقيس مدى الانزعاج الذي تسببه لك الأفكار والسلوكيات الوسواسية في الشهر الماضي.",
  estimatedMinutes: 3,
  category: "ocd",
  icon: "🔄",
  answerOptions: [
    { label: "لا أبداً", value: 0 },
    { label: "قليلاً", value: 1 },
    { label: "إلى حدٍّ ما", value: 2 },
    { label: "كثيراً", value: 3 },
    { label: "بشكل مفرط", value: 4 },
  ],
  questions: [
    { id: 1, text: "أغسل وأنظّف الأشياء بشكل مفرط" },
    { id: 2, text: "أتحقق من الأشياء أكثر مما هو ضروري (المفاتيح، الغاز، الأقفال)" },
    { id: 3, text: "أشعر بالضيق إذا لم تكن الأشياء في نظام أو ترتيب معين" },
    { id: 4, text: "أتخيل مشاهد أو أفكاراً مزعجة لا أريدها" },
    { id: 5, text: "أجمع وأحتفظ بأشياء لا أحتاجها" },
    { id: 6, text: "تستغرق مني بعض التصرفات وقتاً أطول مما يجب بسبب التكرار" },
    { id: 7, text: "أشعر بقلق شديد إذا لم أؤدِّ بعض الطقوس أو الأفعال المعتادة" },
    { id: 8, text: "تنتابني أفكار ضارة أو مزعجة رغماً عني" },
    { id: 9, text: "أعيد قراءة أو كتابة أشياء عدة مرات دون ضرورة" },
    { id: 10, text: "أجد صعوبة في التخلص من الأشياء القديمة حتى لو كانت بلا قيمة" },
  ],
  scoreRanges: [
    {
      min: 0,
      max: 10,
      label: "لا توجد مؤشرات",
      severity: "none",
      color: "bg-sage-100 border-sage-300",
      description:
        "نتيجتك لا تشير إلى وجود مؤشرات للوسواس القهري. الأفكار المتكررة البسيطة أحياناً طبيعية لدى الجميع.",
      recommendation:
        "لا توجد مخاوف تستدعي الاهتمام. إذا شعرت بتغيّر لاحقاً، يمكنك إعادة الاختبار.",
    },
    {
      min: 11,
      max: 20,
      label: "مؤشرات خفيفة",
      severity: "mild",
      color: "bg-yellow-50 border-yellow-200",
      description:
        "نتيجتك تشير إلى بعض المؤشرات الخفيفة التي قد تستحق المتابعة. هذا لا يعني بالضرورة أنك مصاب بالوسواس القهري.",
      recommendation:
        "راقب هذه الأفكار أو السلوكيات. إذا كانت تؤثر على حياتك اليومية أو تسبب لك ضيقاً كبيراً، فكّر في التحدث مع متخصص.",
    },
    {
      min: 21,
      max: 30,
      label: "مؤشرات متوسطة",
      severity: "moderate",
      color: "bg-orange-50 border-orange-200",
      description:
        "نتيجتك تشير إلى مؤشرات متوسطة قد تؤثر على يومياتك. من الأفضل استشارة متخصص للتقييم الدقيق.",
      recommendation:
        "ننصحك بالتحدث مع معالج نفسي متخصص. العلاج المعرفي السلوكي فعّال جداً للتعامل مع الوسواس القهري.",
    },
    {
      min: 31,
      max: 40,
      label: "مؤشرات مرتفعة",
      severity: "severe",
      color: "bg-red-50 border-red-200",
      description:
        "نتيجتك تشير إلى مؤشرات مرتفعة تستحق التقييم المتخصص. ما تشعر به يمكن علاجه بفاعلية.",
      recommendation:
        "يُنصح بالتواصل مع معالج نفسي متخصص في الاضطرابات القلقية. العلاج المناسب يمكن أن يُحسّن جودة حياتك بشكل ملحوظ.",
    },
  ],
  disclaimer:
    "هذا الاختبار أداة للتوعية الذاتية وليس تشخيصاً طبياً. النتائج سرية تماماً ولا تُحفظ على أي خادم.",
};
```

- [ ] **Step 5: Commit**

```powershell
git add lib/tests/
git commit -m "feat: add GAD-7, Burnout, PSS, and OCI-R test configs"
```

---

### Task 7: TestEngine Component

**Files:**
- Create: `components/TestEngine.tsx`

This is the core component — it handles the full test flow: intro screen → question-by-question → results.

- [ ] **Step 1: Create `components/TestEngine.tsx`**

```typescript
"use client";

import { useState } from "react";
import { TestConfig } from "@/lib/types";
import { calculateScore, getScoreRange } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Phase = "intro" | "test" | "results";

export function TestEngine({ config }: { config: TestConfig }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const question = config.questions[currentIndex];
  const totalQuestions = config.questions.length;
  const progress = ((currentIndex) / totalQuestions) * 100;
  const isLast = currentIndex === totalQuestions - 1;

  const score = calculateScore(answers, config.questions, config.answerOptions.length - 1);
  const scoreRange = phase === "results" ? getScoreRange(score, config) : null;

  function handleAnswer(value: number) {
    setSelected(value);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetake() {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
    setSelected(null);
  }

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="text-center">
          <span className="text-6xl">{config.icon}</span>
          <h1 className="text-3xl font-bold mt-4 text-foreground">{config.name}</h1>
          <p className="mt-3 text-muted-foreground text-lg leading-relaxed">
            {config.longDescription}
          </p>
        </div>

        <div className="bg-muted rounded-2xl p-5 flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-sage-500">⏱</span>
            <span>المدة التقديرية: {config.estimatedMinutes} دقائق</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sage-500">🔒</span>
            <span>سري تماماً — لا يُحفظ أي شيء</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sage-500">📋</span>
            <span>{totalQuestions} أسئلة</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center border border-border rounded-xl p-4">
          {config.disclaimer}
        </p>

        <Button
          size="lg"
          className="w-full text-lg py-6 rounded-2xl bg-sage-400 hover:bg-sage-500 text-white"
          onClick={() => setPhase("test")}
        >
          ابدأ الاختبار
        </Button>
      </div>
    );
  }

  if (phase === "test") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{config.name}</span>
            <span>
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-xl font-semibold leading-relaxed text-foreground">
            {question.text}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {config.answerOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                "w-full text-right px-5 py-4 rounded-2xl border-2 transition-all duration-150 text-base font-medium",
                selected === option.value
                  ? "border-sage-400 bg-sage-50 text-sage-700"
                  : "border-border bg-card text-foreground hover:border-sage-300 hover:bg-sage-50/50"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full py-6 rounded-2xl bg-sage-400 hover:bg-sage-500 text-white text-lg disabled:opacity-40"
          disabled={selected === null}
          onClick={handleNext}
        >
          {isLast ? "عرض النتيجة" : "التالي"}
        </Button>
      </div>
    );
  }

  // Results phase
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">نتيجتك</h2>
        <p className="text-muted-foreground mt-1">{config.name}</p>
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 p-6 text-center flex flex-col gap-2",
          scoreRange?.color
        )}
      >
        <span className="text-5xl font-bold text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground">
          من أصل {(config.questions.length) * (config.answerOptions.length - 1)} نقطة
        </span>
        <span className="text-xl font-semibold mt-2">{scoreRange?.label}</span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2">ماذا تعني هذه النتيجة؟</h3>
          <p className="text-muted-foreground leading-relaxed">{scoreRange?.description}</p>
        </div>
        <div className="border-t border-border pt-4">
          <h3 className="font-semibold text-foreground mb-2">ماذا تفعل الآن؟</h3>
          <p className="text-muted-foreground leading-relaxed">{scoreRange?.recommendation}</p>
        </div>
      </div>

      {scoreRange?.severity === "severe" || scoreRange?.severity === "moderateHigh" ? (
        <a
          href="https://www.arabtherapy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-4 px-6 rounded-2xl bg-mist-400 hover:bg-mist-500 text-white font-semibold text-base transition-colors"
        >
          تحدث مع معالج نفسي عبر الإنترنت
        </a>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full py-5 rounded-2xl text-base"
          onClick={handleRetake}
        >
          إعادة الاختبار
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground border border-border rounded-xl p-3">
        {config.disclaimer}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/TestEngine.tsx
git commit -m "feat: add TestEngine component with intro/test/results flow"
```

---

### Task 8: Layout Components (Header, Footer, TestCard)

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Create: `components/TestCard.tsx`

- [ ] **Step 1: Create `components/Header.tsx`**

```typescript
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-sage-500">
          نفسي
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            الاختبارات
          </Link>
          <Link href="/عن-الموقع" className="hover:text-foreground transition-colors">
            عن الموقع
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `components/Footer.tsx`**

```typescript
export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-4 text-center">
        <p className="text-2xl font-bold text-sage-500">نفسي</p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          جميع الاختبارات على هذا الموقع أدوات للتوعية الذاتية فقط ولا تُعدّ تشخيصاً طبياً.
          لا تُحفظ أي بيانات شخصية. إذا كنت تمر بأزمة، يرجى التواصل مع متخصص.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} نفسي — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create `components/TestCard.tsx`**

```typescript
import Link from "next/link";
import { TestConfig } from "@/lib/types";

export function TestCard({ config }: { config: TestConfig }) {
  const categoryColors: Record<TestConfig["category"], string> = {
    mood: "bg-purple-50 text-purple-700 border-purple-200",
    anxiety: "bg-blue-50 text-blue-700 border-blue-200",
    work: "bg-orange-50 text-orange-700 border-orange-200",
    stress: "bg-green-50 text-green-700 border-green-200",
    ocd: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  const categoryLabel: Record<TestConfig["category"], string> = {
    mood: "المزاج",
    anxiety: "القلق",
    work: "العمل",
    stress: "التوتر",
    ocd: "الوسواس",
  };

  return (
    <Link href={`/${config.slug}`}>
      <div className="group bg-card border border-border rounded-2xl p-6 hover:border-sage-300 hover:shadow-md transition-all duration-200 flex flex-col gap-4 h-full cursor-pointer">
        <div className="flex justify-between items-start">
          <span className="text-4xl">{config.icon}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full border font-medium ${categoryColors[config.category]}`}
          >
            {categoryLabel[config.category]}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-foreground group-hover:text-sage-600 transition-colors">
            {config.name}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {config.shortDescription}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
          <span>⏱ {config.estimatedMinutes} دقائق</span>
          <span>📋 {config.questions.length} أسئلة</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Commit**

```powershell
git add components/Header.tsx components/Footer.tsx components/TestCard.tsx
git commit -m "feat: add Header, Footer, and TestCard components"
```

---

### Task 9: Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update `app/page.tsx`**

```typescript
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestCard } from "@/components/TestCard";
import { phq9Config } from "@/lib/tests/phq9";
import { gad7Config } from "@/lib/tests/gad7";
import { burnoutConfig } from "@/lib/tests/burnout";
import { pssConfig } from "@/lib/tests/pss";
import { ocirConfig } from "@/lib/tests/ocir";

export const metadata: Metadata = {
  title: "اختبارات الصحة النفسية بالعربية — مجانية وسرية",
  description:
    "اختبر صحتك النفسية بشكل مجاني وسري. اختبارات الاكتئاب والقلق والإرهاق الوظيفي والتوتر — مبنية على مقاييس علمية مُتحقَّق منها.",
};

const allTests = [phq9Config, gad7Config, pssConfig, burnoutConfig, ocirConfig];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sage-50 to-background py-16 px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              كيف صحتك النفسية
              <span className="text-sage-500"> اليوم؟</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              اختبارات علمية مجانية وسرية تماماً — بدون تسجيل، بدون حفظ بيانات.
              فهم ما تشعر به هو الخطوة الأولى.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-sage-500">🔒</span> سري تماماً
              </span>
              <span className="flex items-center gap-1">
                <span className="text-sage-500">✓</span> مبني على مقاييس علمية
              </span>
              <span className="flex items-center gap-1">
                <span className="text-sage-500">🆓</span> مجاني بالكامل
              </span>
            </div>
          </div>
        </section>

        {/* Tests grid */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground">اختر الاختبار</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allTests.map((config) => (
              <TestCard key={config.id} config={config} />
            ))}
          </div>
        </section>

        {/* Trust section */}
        <section className="bg-muted py-12 px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
            <h2 className="text-2xl font-bold">لماذا نفسي؟</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-3xl">🔬</span>
                <h3 className="font-semibold">مبني علمياً</h3>
                <p className="text-muted-foreground">
                  جميع الاختبارات مبنية على مقاييس مُتحقَّق منها ومُستخدَمة في الأبحاث العالمية
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-3xl">🔒</span>
                <h3 className="font-semibold">خصوصية تامة</h3>
                <p className="text-muted-foreground">
                  لا حساب، لا بريد إلكتروني، لا حفظ بيانات. نتائجك تبقى معك فقط
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-3xl">🌍</span>
                <h3 className="font-semibold">باللغة العربية</h3>
                <p className="text-muted-foreground">
                  مُصمَّم خصيصاً للمستخدم العربي بلغة واضحة وسهلة وبعيدة عن التعقيد الطبي
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add app/page.tsx
git commit -m "feat: build home page with test cards and hero section"
```

---

### Task 10: Individual Test Pages

**Files:**
- Create: `app/اختبار-الاكتئاب/page.tsx`
- Create: `app/اختبار-القلق/page.tsx`
- Create: `app/اختبار-الإرهاق-الوظيفي/page.tsx`
- Create: `app/اختبار-التوتر/page.tsx`
- Create: `app/اختبار-الوسواس-القهري/page.tsx`

Each page is a thin wrapper: metadata + Header + TestEngine + Footer.

- [ ] **Step 1: Create depression test page `app/اختبار-الاكتئاب/page.tsx`**

```typescript
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { phq9Config } from "@/lib/tests/phq9";

export const metadata: Metadata = {
  title: "اختبار الاكتئاب — PHQ-9 بالعربي",
  description:
    "اختبر نفسك بمقياس PHQ-9 المُتحقَّق منه طبياً. هل أنا مصاب بالاكتئاب؟ اكتشف بشكل سري ومجاني.",
  keywords: ["اختبار الاكتئاب", "هل أنا مصاب بالاكتئاب", "PHQ-9 عربي", "أعراض الاكتئاب اختبار"],
};

export default function DepressionTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={phq9Config} />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create anxiety test page `app/اختبار-القلق/page.tsx`**

```typescript
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { gad7Config } from "@/lib/tests/gad7";

export const metadata: Metadata = {
  title: "اختبار القلق النفسي — GAD-7 بالعربي",
  description:
    "اختبر مستوى قلقك بمقياس GAD-7 العلمي. هل لدي قلق مزمن؟ اكتشف بشكل سري ومجاني.",
  keywords: ["اختبار القلق النفسي", "هل لدي قلق مزمن", "GAD-7 عربي", "اضطراب القلق العام"],
};

export default function AnxietyTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={gad7Config} />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Create burnout test page `app/اختبار-الإرهاق-الوظيفي/page.tsx`**

```typescript
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { burnoutConfig } from "@/lib/tests/burnout";

export const metadata: Metadata = {
  title: "اختبار الإرهاق الوظيفي — هل أنا محترق وظيفياً؟",
  description:
    "اختبر نفسك للكشف عن الاحتراق الوظيفي. أعراض الاحتراق النفسي في العمل — اكتشف مستواك بسرية تامة.",
  keywords: ["اختبار الإرهاق الوظيفي", "هل أنا محترق وظيفياً", "أعراض الاحتراق النفسي"],
};

export default function BurnoutTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={burnoutConfig} />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Create stress test page `app/اختبار-التوتر/page.tsx`**

```typescript
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { pssConfig } from "@/lib/tests/pss";

export const metadata: Metadata = {
  title: "اختبار التوتر النفسي — كيف مستوى ضغطك؟",
  description:
    "اختبر مستوى التوتر النفسي بمقياس PSS-10 العلمي. كيف أعرف مستوى ضغطي النفسي؟ اكتشف بسرية تامة.",
  keywords: ["اختبار مستوى التوتر", "كيف أعرف مستوى ضغطي النفسي", "PSS عربي"],
};

export default function StressTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={pssConfig} />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Create OCD test page `app/اختبار-الوسواس-القهري/page.tsx`**

```typescript
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { ocirConfig } from "@/lib/tests/ocir";

export const metadata: Metadata = {
  title: "اختبار الوسواس القهري — OCI-R بالعربي",
  description:
    "هل لدي وسواس قهري؟ اختبر نفسك بمقياس OCI-R العلمي المُتحقَّق منه. نتائج سرية ومجانية.",
  keywords: ["اختبار الوسواس القهري", "هل لدي وسواس قهري", "OCD اختبار بالعربي"],
};

export default function OCDTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TestEngine config={ocirConfig} />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```powershell
git add "app/اختبار-الاكتئاب/" "app/اختبار-القلق/" "app/اختبار-الإرهاق-الوظيفي/" "app/اختبار-التوتر/" "app/اختبار-الوسواس-القهري/"
git commit -m "feat: add all 5 test pages (PHQ-9, GAD-7, Burnout, PSS, OCI-R)"
```

---

### Task 11: Sitemap & SEO Finalization

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nafsi.me"; // update with actual domain

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/اختبار-الاكتئاب`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/اختبار-القلق`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/اختبار-الإرهاق-الوظيفي`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/اختبار-التوتر`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/اختبار-الوسواس-القهري`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://nafsi.me/sitemap.xml",
  };
}
```

- [ ] **Step 3: Commit**

```powershell
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots.txt generation"
```

---

### Task 12: Final Build Verification

- [ ] **Step 1: Run tests**

```powershell
npm test
```
Expected: all scoring tests PASS.

- [ ] **Step 2: Run TypeScript check**

```powershell
npx tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 3: Run production build**

```powershell
npm run build
```
Expected: successful build, all routes compiled.

- [ ] **Step 4: Verify dev server works end-to-end**

```powershell
npm run dev
```
Open http://localhost:3000 — verify:
- Home page loads with 5 test cards
- Click "اختبار الاكتئاب" → intro screen loads
- Start test → questions render one at a time with RTL layout
- Select answers → progress bar advances
- Complete test → results screen with score, interpretation, recommendation

- [ ] **Step 5: Final commit**

```powershell
git add .
git commit -m "feat: complete Phase 1 — Arabic mental health assessment site with 5 tests"
```

---

## Spec Coverage Checklist

- [x] Next.js App Router + TypeScript
- [x] RTL Tailwind (dir="rtl" on html + Cairo font)
- [x] shadcn/ui components
- [x] No database, client-side only
- [x] No user accounts, fully anonymous
- [x] 5 Phase 1 tests: PHQ-9, GAD-7, Burnout, PSS, OCI-R
- [x] Correct PHQ-9 questions and scoring (0-4/5-9/10-14/15-19/20-27)
- [x] Same answer scale (أبداً/عدة أيام/أكثر من نصف الأيام/كل يوم تقريباً)
- [x] Progress indicator (question X of Y)
- [x] Instant results with score interpretation
- [x] Non-alarmist compassionate framing
- [x] "What this means" + "What to do next" sections
- [x] Retake button
- [x] Arabic meta titles and descriptions per page
- [x] Sitemap
- [x] Open Graph tags (in root layout)
- [x] Arabic URL slugs (/اختبار-الاكتئاب etc.)
- [x] Vercel-ready (standard Next.js, no custom server)
- [x] PSS reversed-item scoring handled in calculateScore()
- [x] Affiliate links on severe results (arabtherapy.com)
- [ ] /عن-الموقع (About page) — Phase 1.5
- [ ] Shareable results link — Phase 2
- [ ] AdSense on article pages — Phase 2
