# Articles Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/مقالات` educational content hub with 5 Arabic health articles, a password-protected `/review` page, and all supporting routing/SEO/nav wiring.

**Architecture:** Next.js rewrites map `/مقالات/:path*` → `/articles/:path*` (Latin directory, avoids Windows Arabic-dir bug). Articles are TypeScript data files. Draft articles are invisible to visitors but shown in full on the review page. The review page uses a server action to set an HttpOnly cookie on correct password entry.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4 CSS-first, inline `var(--waaei-*)` styles. `params` and `searchParams` and `cookies()` are all async (must be awaited). Vitest + @testing-library/react for tests.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/articles/index.ts` | Article type, allArticles array, articlesBySlug map |
| Create | `lib/articles/depression.ts` | أعراض-الاكتئاب article data |
| Create | `lib/articles/anxiety.ts` | أعراض-القلق-النفسي article data |
| Create | `lib/articles/burnout.ts` | الإحتراق-الوظيفي article data |
| Create | `lib/articles/stress.ts` | التوتر-النفسي article data |
| Create | `lib/articles/sleep.ts` | مشاكل-النوم-والأرق article data |
| Create | `lib/articles/articles.test.ts` | Data integrity tests |
| Modify | `next.config.ts` | Add Arabic→Latin URL rewrites |
| Create | `app/articles/page.tsx` | Hub index at /مقالات |
| Create | `app/articles/[slug]/page.tsx` | Individual article page at /مقالات/[slug] |
| Create | `app/review/actions.ts` | Server action: validate password, set cookie |
| Create | `app/review/page.tsx` | Review page: login form or full article list |
| Create | `app/review/logout/route.ts` | Route handler: clear cookie, redirect |
| Modify | `components/Header.tsx` | Add المقالات nav link |
| Modify | `app/sitemap.ts` | Add hub + published article URLs |

---

## Task 1: Article type + data files

**Files:**
- Create: `lib/articles/index.ts`
- Create: `lib/articles/depression.ts`
- Create: `lib/articles/anxiety.ts`
- Create: `lib/articles/burnout.ts`
- Create: `lib/articles/stress.ts`
- Create: `lib/articles/sleep.ts`
- Create: `lib/articles/articles.test.ts`

- [ ] **Step 1: Write failing data tests**

Create `lib/articles/articles.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { allArticles, articlesBySlug } from "./index";

const VALID_TEST_SLUGS = [
  "اختبار-الاكتئاب", "اختبار-القلق", "اختبار-الإحتراق-الوظيفي",
  "اختبار-التوتر", "اختبار-الأرق",
];

describe("articles data integrity", () => {
  it("exports 5 articles", () => {
    expect(allArticles).toHaveLength(5);
  });

  it("every article has at least 2 sources", () => {
    allArticles.forEach((a) => {
      expect(a.sources.length, `${a.slug} needs ≥2 sources`).toBeGreaterThanOrEqual(2);
    });
  });

  it("every relatedTestSlug is a known test slug", () => {
    allArticles.forEach((a) => {
      expect(VALID_TEST_SLUGS, `${a.slug} has unknown relatedTestSlug`).toContain(a.relatedTestSlug);
    });
  });

  it("every relatedArticleSlug references another article in the array", () => {
    const slugs = new Set(allArticles.map((a) => a.slug));
    allArticles.forEach((a) => {
      a.relatedArticleSlugs.forEach((rel) => {
        expect(slugs, `${a.slug} references unknown article "${rel}"`).toContain(rel);
      });
    });
  });

  it("ctaAfterSectionIndex is within sections bounds", () => {
    allArticles.forEach((a) => {
      expect(a.ctaAfterSectionIndex, `${a.slug} ctaAfterSectionIndex out of range`)
        .toBeLessThan(a.sections.length);
    });
  });

  it("articlesBySlug lookup map matches allArticles", () => {
    allArticles.forEach((a) => {
      expect(articlesBySlug[a.slug]).toBe(a);
    });
  });

  it("status is 'draft' or 'published'", () => {
    allArticles.forEach((a) => {
      expect(["draft", "published"]).toContain(a.status);
    });
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npx vitest run lib/articles/articles.test.ts
```

Expected: FAIL — `Cannot find module './index'`

- [ ] **Step 3: Create `lib/articles/index.ts`**

```ts
export type Article = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  keywords: string[];
  relatedTestSlug: string;
  relatedTestName: string;
  relatedTestScale: string;
  relatedTestMinutes: number;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  ctaAfterSectionIndex: number;
  status: "draft" | "published";
  sections: { heading: string; body: string }[];
  relatedArticleSlugs: string[];
  sources: { label: string; url: string }[];
};

import { depressionArticle } from "./depression";
import { anxietyArticle } from "./anxiety";
import { burnoutArticle } from "./burnout";
import { stressArticle } from "./stress";
import { sleepArticle } from "./sleep";

export const allArticles: Article[] = [
  depressionArticle,
  anxietyArticle,
  burnoutArticle,
  stressArticle,
  sleepArticle,
];

export const articlesBySlug: Record<string, Article> = Object.fromEntries(
  allArticles.map((a) => [a.slug, a])
);
```

- [ ] **Step 4: Create `lib/articles/depression.ts`**

```ts
import type { Article } from "./index";

export const depressionArticle: Article = {
  slug: "أعراض-الاكتئاب",
  title: "ما هو الاكتئاب؟ الأعراض والأسباب ومتى تطلب المساعدة",
  description: "تعرّف على أعراض الاكتئاب وأسبابه والفرق بينه وبين الحزن الطبيعي — ومتى يكون الوقت المناسب للتحدث مع متخصص.",
  intro: "الاكتئاب ليس ضعفاً في الشخصية ولا مجرد حزن عابر — بل اضطراب طبي حقيقي يصيب مئات الملايين حول العالم ويمكن تشخيصه وعلاجه.",
  keywords: ["أعراض الاكتئاب", "ما هو الاكتئاب", "علاج الاكتئاب", "PHQ-9 عربي", "اختبار الاكتئاب"],
  relatedTestSlug: "اختبار-الاكتئاب",
  relatedTestName: "اختبار الاكتئاب",
  relatedTestScale: "PHQ-9",
  relatedTestMinutes: 2,
  category: "الاكتئاب والمزاج",
  readingMinutes: 5,
  publishedAt: "2026-06-01",
  ctaAfterSectionIndex: 1,
  status: "draft",
  sections: [
    {
      heading: "ما هو الاكتئاب؟",
      body: "الاكتئاب هو اضطراب مزاجي يُسبِّب شعوراً مستمراً بالحزن وفقدان الاهتمام بالأشياء التي كانت ممتعة. يختلف عن الحزن الطبيعي في أنه لا يرتبط بحدث بعينه، ويستمر أسابيع أو أشهراً، ويُعيق القدرة على العمل والعلاقات والمهام اليومية.\n\nوفقاً لمنظمة الصحة العالمية، يعاني أكثر من 280 مليون شخص من الاكتئاب — مما يجعله من أكثر الاضطرابات النفسية انتشاراً. والخبر الجيد: إنه من أكثرها قابلية للعلاج.",
    },
    {
      heading: "أعراض الاكتئاب الشائعة",
      body: "لا يبدو الاكتئاب متشابهاً لدى الجميع. لكن ثمة أعراض تتكرر: الشعور بالحزن أو الفراغ أو اليأس معظم اليوم، فقدان المتعة في الأنشطة التي كنت تحبها، تغيّرات ملحوظة في الشهية أو الوزن، صعوبة في النوم أو النوم أكثر من المعتاد، والشعور الدائم بالإرهاق.\n\nقد تشمل أيضاً صعوبة التركيز أو اتخاذ القرارات، والشعور بعدم القيمة أو الذنب بدون سبب واضح. إذا تعرّفت على أكثر من خمسة من هذه الأعراض واستمرت أكثر من أسبوعين، فهذا يستحق الانتباه.",
    },
    {
      heading: "أسباب الاكتئاب",
      body: "لا يوجد سبب واحد للاكتئاب — بل هو نتيجة تفاعل بين عوامل متعددة: الوراثة والتاريخ العائلي، اختلالات في الناقلات العصبية كالسيروتونين والدوبامين، أحداث حياتية مُجهِدة كفقدان عزيز أو الضغط المالي، والأمراض الجسدية المزمنة.\n\nالاكتئاب لا يعني أن شيئاً خاطئاً في شخصيتك أو أنك «لا تحاول بما يكفي». هو حالة طبية مثل أي حالة أخرى.",
    },
    {
      heading: "متى تطلب المساعدة؟",
      body: "إذا لاحظت أن هذه الأعراض تؤثر على حياتك اليومية وتستمر أكثر من أسبوعين، فأنت تستحق الحصول على مساعدة متخصصة. لا تنتظر حتى تصل لأسوأ نقطة — كلما طلبت المساعدة مبكراً، كان العلاج أسهل وأسرع.\n\nيمكن أن يشمل العلاج العلاج النفسي (كالعلاج المعرفي السلوكي)، الأدوية، أو كليهما معاً. إذا كانت لديك أفكار إيذاء النفس، تواصل مع متخصص فوراً.",
    },
  ],
  relatedArticleSlugs: ["أعراض-القلق-النفسي", "الإحتراق-الوظيفي"],
  sources: [
    {
      label: "منظمة الصحة العالمية — حقائق عن الاكتئاب (2023)",
      url: "https://www.who.int/news-room/fact-sheets/detail/depression",
    },
    {
      label: "Kroenke K, Spitzer RL — PHQ-9: A New Depression Diagnostic and Severity Measure (2002)",
      url: "https://pubmed.ncbi.nlm.nih.gov/11556941/",
    },
  ],
};
```

- [ ] **Step 5: Create `lib/articles/anxiety.ts`**

```ts
import type { Article } from "./index";

export const anxietyArticle: Article = {
  slug: "أعراض-القلق-النفسي",
  title: "ما هو القلق النفسي؟ الأعراض والفرق عن الخوف الطبيعي",
  description: "تعرّف على الفرق بين القلق الطبيعي واضطراب القلق، وأبرز الأعراض التي تستحق الانتباه — ومتى يصبح القلق عائقاً يحتاج مساعدة.",
  intro: "الشعور بالقلق أحياناً طبيعي تماماً — لكن حين يصبح مستمراً ويتحكم في قراراتك وحياتك اليومية، فهو يستحق انتباهاً مختلفاً.",
  keywords: ["أعراض القلق", "اضطراب القلق العام", "GAD-7 عربي", "علاج القلق النفسي", "هل لدي قلق مزمن"],
  relatedTestSlug: "اختبار-القلق",
  relatedTestName: "اختبار القلق",
  relatedTestScale: "GAD-7",
  relatedTestMinutes: 2,
  category: "القلق والخوف",
  readingMinutes: 4,
  publishedAt: "2026-06-01",
  ctaAfterSectionIndex: 1,
  status: "draft",
  sections: [
    {
      heading: "ما هو القلق النفسي؟",
      body: "القلق هو استجابة طبيعية للخطر والضغط — مشكلة، موقف مهم، خوف من المستقبل. هذا قلق صحي يأتي ويذهب.\n\nاضطراب القلق العام يختلف: هو قلق مستمر وغير متناسب مع المواقف الفعلية. يشعر فيه الشخص بالقلق تجاه أشياء كثيرة في آن واحد — العمل، الصحة، الأسرة — بشكل لا يمكن التحكم فيه ويستمر أشهراً.",
    },
    {
      heading: "أعراض اضطراب القلق العام",
      body: "الأعراض النفسية تشمل: القلق المستمر الذي يصعب إيقافه، التشاؤم وتوقع الأسوأ في كل موقف، وصعوبة التركيز. الأعراض الجسدية لا تقل أهمية: توتر العضلات، الصداع المتكرر، الإرهاق رغم قلة المجهود، واضطرابات النوم.\n\nقد تلاحظ أنك تتجنب مواقف بعينها خوفاً من القلق، أو أنك تحتاج وقتاً طويلاً لاتخاذ قرارات بسيطة.",
    },
    {
      heading: "أسباب اضطراب القلق",
      body: "يتشكّل اضطراب القلق من تفاعل عوامل متعددة: التاريخ العائلي، أحداث حياتية مُجهِدة كالصدمات أو الضغوط المتراكمة، وبعض السمات الشخصية كالميل للكمالية أو الحساسية الزائدة.\n\nالجهاز العصبي لدى الأشخاص الذين يعانون من القلق المزمن يميل لتفسير مواقف عادية على أنها تهديدات — وهذا قابل للتعديل بالعلاج.",
    },
    {
      heading: "متى تطلب المساعدة؟",
      body: "إذا كان القلق يؤثر على عملك أو علاقاتك أو نومك بشكل متكرر — ولم تتمكن من إيقافه رغم محاولتك — فهذا وقت التحدث مع متخصص.\n\nاضطراب القلق يُعالَج بشكل فعّال جداً بالعلاج المعرفي السلوكي وأحياناً الأدوية. لا تنتظر حتى يصبح القلق هو الوضع الطبيعي في حياتك.",
    },
  ],
  relatedArticleSlugs: ["أعراض-الاكتئاب", "التوتر-النفسي"],
  sources: [
    {
      label: "منظمة الصحة العالمية — القلق واضطراباته",
      url: "https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders",
    },
    {
      label: "Spitzer RL, et al. — A Brief Measure for Assessing Generalized Anxiety Disorder: GAD-7 (2006)",
      url: "https://pubmed.ncbi.nlm.nih.gov/16717171/",
    },
  ],
};
```

- [ ] **Step 6: Create `lib/articles/burnout.ts`**

```ts
import type { Article } from "./index";

export const burnoutArticle: Article = {
  slug: "الإحتراق-الوظيفي",
  title: "الإحتراق الوظيفي: الأعراض والأسباب وكيف تتعافى",
  description: "الإحتراق الوظيفي ليس ضعفاً — بل استجابة لضغط متراكم. تعرّف على علاماته الحقيقية وكيف تميّزه عن الإجهاد العادي، وما الذي يساعد في التعافي.",
  intro: "الإحتراق الوظيفي يحدث حين يتجاوز الضغط المتراكم قدرة جسمك وعقلك على التعامل معه — وهو أكثر شيوعاً مما تتخيل.",
  keywords: ["الإحتراق الوظيفي", "أعراض الإحتراق الوظيفي", "burnout عربي", "ضغط العمل", "الإرهاق النفسي"],
  relatedTestSlug: "اختبار-الإحتراق-الوظيفي",
  relatedTestName: "اختبار الإحتراق الوظيفي",
  relatedTestScale: "MBI",
  relatedTestMinutes: 3,
  category: "التوتر والإرهاق",
  readingMinutes: 5,
  publishedAt: "2026-06-01",
  ctaAfterSectionIndex: 1,
  status: "draft",
  sections: [
    {
      heading: "ما هو الإحتراق الوظيفي؟",
      body: "الإحتراق الوظيفي هو حالة من الإرهاق المزمن الناجمة عن ضغط العمل الطويل الأمد. عرّفته منظمة الصحة العالمية ضمن التصنيف الدولي للأمراض ICD-11 كظاهرة مهنية تتمثل في ثلاثة أبعاد: الإرهاق الشديد، التحرر العاطفي من العمل، وتراجع الكفاءة المهنية.\n\nالفارق بينه وبين الإجهاد المؤقت: الإجهاد العادي له نهاية. الإحتراق الوظيفي لا ينتهي حتى مع أيام الإجازة.",
    },
    {
      heading: "أعراض الإحتراق الوظيفي",
      body: "الإرهاق الشديد هو العَلَم الأحمر الأول: تستيقظ مُنهَكاً حتى بعد نوم كامل. يليه الانفصال العاطفي — تشعر بأن عملك لم يعد يعنيك، وربما ببعض السخرية تجاهه.\n\nعلامات أخرى: صعوبة التركيز وانخفاض الإنتاجية رغم وقت أطول، التهيّج وسرعة الغضب، والأعراض الجسدية كالصداع المتكرر وضعف المناعة.",
    },
    {
      heading: "أسباب الإحتراق الوظيفي",
      body: "ليس سبباً واحداً بل تراكم عوامل: عبء عمل مفرط مع ضعف السيطرة على القرارات، بيئة عمل غير داعمة، غياب الاعتراف بالجهد، وعدم التوازن بين المتطلبات والموارد.\n\nيُضاف إليها عوامل شخصية: الميل للكمالية، صعوبة قول «لا»، والتماهي الزائد مع الهوية المهنية.",
    },
    {
      heading: "كيف تتعافى من الإحتراق الوظيفي؟",
      body: "التعافي لا يحدث بأسبوع إجازة — يحتاج إلى تغييرات حقيقية. ابدأ بتحديد حدود واضحة لساعات العمل. تحدّث مع مديرك إن كان الحمل مفرطاً.\n\nعلى المستوى الشخصي: أعد الاستثمار في الأنشطة التي تمنحك طاقة خارج العمل، وحافظ على النوم والرياضة كأولوية. إذا ظل الأمر صعباً، يمكن للعلاج النفسي أن يساعدك في إعادة بناء علاقتك مع العمل.",
    },
  ],
  relatedArticleSlugs: ["التوتر-النفسي", "أعراض-الاكتئاب"],
  sources: [
    {
      label: "منظمة الصحة العالمية — الإحتراق الوظيفي في ICD-11 (2019)",
      url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases",
    },
    {
      label: "Maslach C, Leiter MP — Understanding the Burnout Experience (2016)",
      url: "https://pubmed.ncbi.nlm.nih.gov/27404353/",
    },
  ],
};
```

- [ ] **Step 7: Create `lib/articles/stress.ts`**

```ts
import type { Article } from "./index";

export const stressArticle: Article = {
  slug: "التوتر-النفسي",
  title: "التوتر النفسي: الفرق بين التوتر الصحي والمُضِر",
  description: "ليس كل توتر ضاراً — بعضه يدفعك للإنجاز. تعرّف على الفرق بين النوعين، وأعراض التوتر المزمن، وكيف تقيّم مستواك.",
  intro: "التوتر جزء طبيعي من الحياة — لكن حين يصبح مزمناً ومتواصلاً، يبدأ في التأثير على جسمك وعقلك وعلاقاتك بطرق تستحق الانتباه.",
  keywords: ["التوتر النفسي", "أعراض التوتر المزمن", "PSS عربي", "كيف أتخلص من التوتر", "مقياس التوتر"],
  relatedTestSlug: "اختبار-التوتر",
  relatedTestName: "اختبار التوتر",
  relatedTestScale: "PSS-10",
  relatedTestMinutes: 3,
  category: "التوتر والإرهاق",
  readingMinutes: 4,
  publishedAt: "2026-06-01",
  ctaAfterSectionIndex: 1,
  status: "draft",
  sections: [
    {
      heading: "ما هو التوتر النفسي؟",
      body: "التوتر هو استجابة الجسم لأي مطلب أو ضغط، سواء كان حقيقياً أم متوقعاً. عندما تواجه موقفاً ضاغطاً، يُفرز جسمك هرمونات كالأدرينالين والكورتيزول تُهيّئك للتعامل معه.\n\nهذا مفيد على المدى القصير — يزيد التركيز ويرفع الأداء. المشكلة حين لا يتوقف الضغط ويتحول التوتر إلى حالة دائمة.",
    },
    {
      heading: "أعراض التوتر المزمن",
      body: "جسدياً: الصداع المتكرر، توتر العضلات خاصة في الرقبة والكتفين، مشاكل في الهضم، والتعب المستمر. نفسياً: صعوبة الاسترخاء حتى في أوقات الراحة، الشعور بأن الأمور خارج سيطرتك، والتهيّج وسرعة الاستثارة.\n\nقد تلاحظ أيضاً اللجوء لعادات غير صحية كتناول الطعام بشكل مفرط أو الانسحاب الاجتماعي — وهي طرق اللاوعي لإدارة الضغط.",
    },
    {
      heading: "ما الذي يُسبِّب التوتر؟",
      body: "المصادر الأكثر شيوعاً: ضغط العمل وضيق الوقت، المشكلات المالية، العلاقات الصعبة، والتغييرات الكبيرة في الحياة.\n\nشخصان يواجهان نفس الموقف قد يشعران بمستويات توتر مختلفة تماماً. طريقة التفكير وتقدير الموارد المتاحة تلعب دوراً كبيراً.",
    },
    {
      heading: "متى يصبح التوتر مشكلة؟",
      body: "إذا كان التوتر يؤثر على نومك أو علاقاتك أو عملك بشكل متكرر لأسابيع — فهذا يستحق التقييم.\n\nالتدخل المبكر يُحدِث فارقاً كبيراً. تقنيات مثل العلاج المعرفي السلوكي والتمارين الرياضية وتقنيات التنفس أثبتت فعاليتها في تخفيف التوتر المزمن.",
    },
  ],
  relatedArticleSlugs: ["الإحتراق-الوظيفي", "مشاكل-النوم-والأرق"],
  sources: [
    {
      label: "Cohen S, et al. — A Global Measure of Perceived Stress (1983)",
      url: "https://pubmed.ncbi.nlm.nih.gov/6668417/",
    },
    {
      label: "American Psychological Association — Stress effects on the body",
      url: "https://www.apa.org/topics/stress/body",
    },
  ],
};
```

- [ ] **Step 8: Create `lib/articles/sleep.ts`**

```ts
import type { Article } from "./index";

export const sleepArticle: Article = {
  slug: "مشاكل-النوم-والأرق",
  title: "مشاكل النوم والأرق: الأسباب وكيف تحسّن نومك",
  description: "الأرق ليس مجرد إزعاء — التأثير على الصحة النفسية والجسدية حقيقي. تعرّف على أنواع مشاكل النوم وأسبابها وما يساعد فعلاً.",
  intro: "نحن نقضي ثلث حياتنا نائمين — لكن لأسباب كثيرة، يصعب على الكثيرين الحصول على نوم كافٍ أو مريح، وهذا يؤثر على كل شيء آخر.",
  keywords: ["مشاكل النوم", "الأرق", "اضطراب النوم", "ISI عربي", "كيف أنام بشكل أفضل", "أسباب الأرق"],
  relatedTestSlug: "اختبار-الأرق",
  relatedTestName: "اختبار الأرق",
  relatedTestScale: "ISI",
  relatedTestMinutes: 2,
  category: "التوتر والإرهاق",
  readingMinutes: 5,
  publishedAt: "2026-06-01",
  ctaAfterSectionIndex: 1,
  status: "draft",
  sections: [
    {
      heading: "ما هو الأرق؟",
      body: "الأرق هو صعوبة الدخول في النوم أو الاستمرار فيه أو الاستيقاظ باكراً جداً دون القدرة على العودة للنوم — رغم توفر الظروف المناسبة. يُصبح اضطراباً حين يتكرر ثلاث مرات أسبوعياً أو أكثر لمدة ثلاثة أشهر.\n\nالأرق قصير الأمد شائع جداً ويرتبط عادةً بضغط مؤقت. الأرق المزمن أكثر تعقيداً ويحتاج تدخلاً.",
    },
    {
      heading: "أعراض اضطراب النوم",
      body: "الأعراض الليلية: تقضي وقتاً طويلاً في السرير قبل النوم، تستيقظ مرات عدة، أو تصحو قبل موعدك دون قدرة على العودة.\n\nالأعراض النهارية لا تقل أهمية: التعب والنعاس خلال النهار، صعوبة التركيز، التهيّج، والقلق من النوم نفسه — وهو ما يخلق حلقة مفرغة.",
    },
    {
      heading: "أسباب مشاكل النوم",
      body: "الأسباب النفسية هي الأكثر شيوعاً: القلق والتوتر والاكتئاب تُعطّل النوم بشكل مباشر. الأسباب السلوكية تشمل: جدول نوم غير منتظم، استخدام الشاشات قبل النوم، الكافيين في وقت متأخر، والنوم الزائد نهاراً.\n\nأسباب طبية قد تكون وراءها أيضاً: توقف التنفس أثناء النوم، متلازمة تململ الساقين، أو بعض الأدوية.",
    },
    {
      heading: "كيف تحسّن جودة نومك؟",
      body: "العلاج المعرفي السلوكي للأرق (CBT-I) هو الأكثر فعالية على المدى البعيد — وأثبت تفوقاً على الأدوية في معظم الدراسات. يعمل على تغيير الأفكار والعادات المرتبطة بالنوم.\n\nعملياً: اجعل وقت النوم والاستيقاظ ثابتاً حتى أيام الراحة، تجنّب الشاشات ساعة قبل النوم، واجعل غرفتك باردة ومظلمة. إذا لم تنم خلال 20 دقيقة، اخرج من السرير واعمل شيئاً هادئاً حتى تشعر بالنعاس.",
    },
  ],
  relatedArticleSlugs: ["التوتر-النفسي", "أعراض-الاكتئاب"],
  sources: [
    {
      label: "Morin CM, et al. — Validation of the Insomnia Severity Index as an Outcome Measure (2011)",
      url: "https://pubmed.ncbi.nlm.nih.gov/21300408/",
    },
    {
      label: "American Academy of Sleep Medicine — Insomnia: Clinical Practice Guideline",
      url: "https://aasm.org/resources/clinicalguidelines/040514.pdf",
    },
  ],
};
```

- [ ] **Step 9: Run tests — confirm they pass**

```bash
npx vitest run lib/articles/articles.test.ts
```

Expected: 7 tests PASS

- [ ] **Step 10: Commit**

```bash
git add lib/articles/
git commit -m "feat: add Article type and 5 draft article data files"
```

---

## Task 2: Next.js rewrites

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add rewrites**

Replace the contents of `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/مقالات", destination: "/articles" },
      { source: "/مقالات/:path*", destination: "/articles/:path*" },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify on dev server**

```bash
npm run dev
```

Navigate to `http://localhost:3000/مقالات` in a browser. Expected: no 404 (Next.js will try to render `/articles` — a 404 is fine at this step since `app/articles/` doesn't exist yet, but it must NOT show a rewrite error in the terminal).

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: add /مقالات → /articles URL rewrites"
```

---

## Task 3: Hub index page

**Files:**
- Create: `app/articles/page.tsx`

- [ ] **Step 1: Create the hub index**

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { allArticles } from "@/lib/articles";

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

export default function ArticlesHubPage() {
  const published = allArticles.filter((a) => a.status === "published");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto px-[22px] py-[32px] lg:px-[56px] lg:py-[64px]" style={{ maxWidth: 1280 }}>
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

          {published.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--waaei-mute)" }}>لا توجد مقالات منشورة بعد.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-[10px] lg:gap-[16px]">
              {published.map((article) => {
                const color = CATEGORY_COLOR[article.category] ?? "var(--waaei-ink)";
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
                        {article.description}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--waaei-mute)" }}>
                        {article.readingMinutes} دقائق للقراءة
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
```

- [ ] **Step 2: Verify on dev server**

With `npm run dev` running, navigate to `http://localhost:3000/مقالات`.

Expected: page loads, shows "لا توجد مقالات منشورة بعد." (all articles are drafts). No console errors.

- [ ] **Step 3: Temporarily publish one article to verify the card renders**

In `lib/articles/depression.ts`, change `status: "draft"` to `status: "published"`. Hard-refresh the page.

Expected: depression article card appears in 2-col grid with category pill, title, description, read time.

Then revert the status back to `"draft"`.

- [ ] **Step 4: Commit**

```bash
git add app/articles/page.tsx
git commit -m "feat: add articles hub index page at /مقالات"
```

---

## Task 4: Individual article page

**Files:**
- Create: `app/articles/[slug]/page.tsx`

- [ ] **Step 1: Create the article page**

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { allArticles, articlesBySlug } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allArticles
    .filter((a) => a.status === "published")
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesBySlug[decodeURIComponent(slug)];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/مقالات/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articlesBySlug[decodeURIComponent(slug)];
  if (!article || article.status !== "published") notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    inLanguage: "ar",
    url: `https://waaei.me/مقالات/${article.slug}`,
    datePublished: article.publishedAt,
    publisher: { "@type": "Organization", name: "واعي", url: "https://waaei.me" },
    about: { "@type": "MedicalCondition", name: article.title },
  };

  const catColor = CATEGORY_COLOR[article.category] ?? "var(--waaei-ink)";
  const relatedArticles = article.relatedArticleSlugs
    .map((s) => articlesBySlug[s])
    .filter(Boolean);

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
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: catColor,
                background: catColor + "18",
                padding: "3px 9px",
                borderRadius: 5,
              }}
            >
              {article.category}
            </span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>{article.readingMinutes} دقائق للقراءة</span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
              {new Date(article.publishedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long" })}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-[22px] lg:text-[28px] font-black"
            style={{ color: "var(--waaei-ink)", lineHeight: 1.35, marginBottom: 14 }}
          >
            {article.title}
          </h1>

          {/* Intro */}
          <p style={{ fontSize: 15, color: "var(--waaei-mute)", lineHeight: "var(--waaei-lh-body)", marginBottom: 24 }}>
            {article.intro}
          </p>

          <div style={{ height: 1, background: "var(--waaei-rule)", marginBottom: 28 }} />

          {/* Sections with CTA injected after ctaAfterSectionIndex */}
          {article.sections.map((section, i) => (
            <div key={i}>
              <div style={{ marginBottom: 24 }}>
                <h2
                  className="text-[16px] lg:text-[18px] font-black"
                  style={{ color: "var(--waaei-ink)", marginBottom: 10 }}
                >
                  {section.heading}
                </h2>
                {section.body.split("\n\n").map((para, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 14,
                      color: "var(--waaei-ink)",
                      lineHeight: "var(--waaei-lh-body)",
                      marginBottom: j < section.body.split("\n\n").length - 1 ? 12 : 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {i === article.ctaAfterSectionIndex && (
                <div
                  style={{
                    background: "var(--waaei-ink)",
                    borderRadius: "var(--waaei-radius-md)",
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    marginBottom: 28,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ color: "var(--waaei-bg)", fontSize: 14, fontWeight: 700 }}>
                      هل تتعرف على هذه الأعراض؟
                    </div>
                    <div style={{ color: "var(--waaei-mute)", fontSize: 12 }}>
                      {article.relatedTestName} · {article.relatedTestScale} · {article.relatedTestMinutes} دقائق · مجاني وسري
                    </div>
                  </div>
                  <Link
                    href={`/${article.relatedTestSlug}`}
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
            </div>
          ))}

          <div style={{ height: 1, background: "var(--waaei-rule)", marginBottom: 28 }} />

          {/* Sources */}
          <div style={{ marginBottom: 36 }}>
            <h2
              style={{ fontSize: 14, fontWeight: 700, color: "var(--waaei-ink)", marginBottom: 10 }}
            >
              المصادر
            </h2>
            <ol style={{ paddingRight: 18, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {article.sources.map((src, i) => (
                <li key={i} style={{ fontSize: 12, color: "var(--waaei-mute)", lineHeight: 1.6 }}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--waaei-mute)", textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h2
                style={{ fontSize: 14, fontWeight: 700, color: "var(--waaei-ink)", marginBottom: 10 }}
              >
                اقرأ أيضاً
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/مقالات/${rel.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                      background: "var(--waaei-surface)",
                      border: "1px solid var(--waaei-rule)",
                      borderRadius: "var(--waaei-radius-md)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--waaei-ink)" }}>
                      {rel.title}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--waaei-mute)", flexShrink: 0 }}>←</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Temporarily publish the depression article to verify the page renders**

In `lib/articles/depression.ts`, change `status: "draft"` to `status: "published"`.

Navigate to `http://localhost:3000/مقالات/أعراض-الاكتئاب`.

Expected:
- Breadcrumb: "مقالات › الاكتئاب والمزاج"
- H1 title visible
- All 4 sections render
- CTA card appears after section index 1 (after "أعراض الاكتئاب الشائعة")
- Sources section shows 2 linked citations
- "اقرأ أيضاً" shows 2 related article links (they may 404 since those articles are still drafts — that's fine for this step)

Revert status back to `"draft"`.

- [ ] **Step 3: Verify draft article returns 404**

With depression back to `"draft"`, navigate to `http://localhost:3000/مقالات/أعراض-الاكتئاب`.

Expected: Next.js 404 page.

- [ ] **Step 4: Commit**

```bash
git add app/articles/
git commit -m "feat: add individual article page at /مقالات/[slug]"
```

---

## Task 5: Review page

**Files:**
- Create: `app/review/actions.ts`
- Create: `app/review/page.tsx`
- Create: `app/review/logout/route.ts`

- [ ] **Step 1: Create `app/review/actions.ts`**

```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitReviewPassword(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.REVIEW_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("review_auth", "1", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    redirect("/review");
  }
  redirect("/review?error=1");
}
```

- [ ] **Step 2: Create `app/review/logout/route.ts`**

```ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("review_auth");
  redirect("/review");
}
```

- [ ] **Step 3: Create `app/review/page.tsx`**

```tsx
import { cookies } from "next/headers";
import { allArticles, articlesBySlug } from "@/lib/articles";
import { submitReviewPassword } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

const FILE_MAP: Record<string, string> = {
  "أعراض-الاكتئاب":    "depression.ts",
  "أعراض-القلق-النفسي": "anxiety.ts",
  "الإحتراق-الوظيفي":  "burnout.ts",
  "التوتر-النفسي":      "stress.ts",
  "مشاكل-النوم-والأرق": "sleep.ts",
};

export default async function ReviewPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("review_auth")?.value === "1";
  const { error } = await searchParams;

  if (!isAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--waaei-bg)",
          fontFamily: "var(--waaei-font-sans)",
          direction: "rtl",
        }}
      >
        <div
          style={{
            background: "var(--waaei-surface)",
            border: "1px solid var(--waaei-rule)",
            borderRadius: 12,
            padding: "36px 32px",
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--waaei-ink)" }}>
            مراجعة المقالات
          </div>
          {error && (
            <div
              style={{
                fontSize: 13,
                color: "#c25940",
                background: "#c2594018",
                padding: "8px 12px",
                borderRadius: 7,
              }}
            >
              كلمة المرور غير صحيحة
            </div>
          )}
          <form action={submitReviewPassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--waaei-rule)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--waaei-bg)",
                color: "var(--waaei-ink)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--waaei-ink)",
                color: "var(--waaei-bg)",
                border: "none",
                borderRadius: 8,
                padding: "11px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
              }}
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated: show all articles, drafts first
  const sorted = [...allArticles].sort((a, b) => {
    if (a.status === "draft" && b.status === "published") return -1;
    if (a.status === "published" && b.status === "draft") return 1;
    return 0;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--waaei-bg)",
        fontFamily: "var(--waaei-font-sans)",
        direction: "rtl",
        padding: "32px 22px",
      }}
    >
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--waaei-ink)" }}>
              مراجعة المقالات
            </div>
            <div style={{ fontSize: 13, color: "var(--waaei-mute)", marginTop: 4 }}>
              {sorted.filter((a) => a.status === "draft").length} مسودة ·{" "}
              {sorted.filter((a) => a.status === "published").length} منشور
            </div>
          </div>
          <a
            href="/review/logout"
            style={{
              fontSize: 13,
              color: "var(--waaei-mute)",
              textDecoration: "none",
              border: "1px solid var(--waaei-rule)",
              borderRadius: 7,
              padding: "6px 14px",
            }}
          >
            تسجيل الخروج
          </a>
        </div>

        {/* Articles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {sorted.map((article) => {
            const isDraft = article.status === "draft";
            const fileName = FILE_MAP[article.slug] ?? `${article.slug}.ts`;
            return (
              <div key={article.slug}>
                {/* Status badge + publish hint */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 18,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 5,
                      background: isDraft ? "#d0a23618" : "#9ec79f30",
                      color: isDraft ? "#d0a236" : "#4a7a4a",
                      flexShrink: 0,
                    }}
                  >
                    {isDraft ? "مسودة" : "منشور"}
                  </span>
                  {isDraft && (
                    <code
                      style={{
                        fontSize: 11,
                        color: "var(--waaei-mute)",
                        background: "var(--waaei-surface)",
                        border: "1px solid var(--waaei-rule)",
                        borderRadius: 5,
                        padding: "3px 8px",
                        direction: "ltr",
                        textAlign: "left",
                      }}
                    >
                      {`lib/articles/${fileName} → status: "published"`}
                    </code>
                  )}
                </div>

                {/* Article content (mirrors public article page) */}
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--waaei-ink)",
                    lineHeight: 1.35,
                    marginBottom: 10,
                  }}
                >
                  {article.title}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--waaei-mute)",
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {article.intro}
                </p>

                {article.sections.map((section, i) => (
                  <div key={i} style={{ marginBottom: 18 }}>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--waaei-ink)",
                        marginBottom: 8,
                      }}
                    >
                      {section.heading}
                    </h3>
                    {section.body.split("\n\n").map((para, j) => (
                      <p
                        key={j}
                        style={{
                          fontSize: 14,
                          color: "var(--waaei-ink)",
                          lineHeight: 1.7,
                          marginBottom: j < section.body.split("\n\n").length - 1 ? 10 : 0,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                ))}

                {/* Sources */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid var(--waaei-rule)",
                  }}
                >
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--waaei-mute)", marginBottom: 6 }}
                  >
                    المصادر
                  </div>
                  <ol style={{ paddingRight: 16, margin: 0 }}>
                    {article.sources.map((src, i) => (
                      <li key={i} style={{ fontSize: 12, color: "var(--waaei-mute)", marginBottom: 4 }}>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--waaei-mute)", textDecoration: "underline" }}
                        >
                          {src.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Divider between articles */}
                <div
                  style={{
                    height: 2,
                    background: "var(--waaei-rule)",
                    marginTop: 40,
                    borderRadius: 1,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Set REVIEW_PASSWORD for local dev**

Create a `.env.local` file in the project root (if it doesn't exist) and add:

```
REVIEW_PASSWORD=Rapit@2004!
```

`.env.local` is already git-ignored by Next.js. Do NOT commit this file.

- [ ] **Step 5: Test login flow on dev server**

With `npm run dev` running:

1. Navigate to `http://localhost:3000/review`
   Expected: password login form with "مراجعة المقالات" heading

2. Submit wrong password
   Expected: form re-renders with "كلمة المرور غير صحيحة" error

3. Submit correct password (`Rapit@2004!`)
   Expected: redirects to `/review`, shows article list with "مسودة" badges and file hints

4. Navigate to `http://localhost:3000/review/logout`
   Expected: cookie cleared, redirected to login form

- [ ] **Step 6: Add REVIEW_PASSWORD to Vercel**

In Vercel dashboard → Project Settings → Environment Variables, add:
- Key: `REVIEW_PASSWORD`
- Value: `Rapit@2004!`
- Environments: Production + Preview

- [ ] **Step 7: Commit**

```bash
git add app/review/
git commit -m "feat: add password-protected review page for article drafts"
```

---

## Task 6: Header nav + sitemap

**Files:**
- Modify: `components/Header.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add المقالات link to header**

In `components/Header.tsx`, add the new nav link between الاختبارات and عن الموقع:

```tsx
<nav className="flex gap-2 lg:gap-4 text-[11px] lg:text-[12px] font-semibold">
  <Link
    href="/اختبارات"
    style={{ color: "var(--waaei-ink)", textDecoration: "none" }}
  >
    الاختبارات
  </Link>
  <Link
    href="/مقالات"
    style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
  >
    المقالات
  </Link>
  <Link
    href="/عن-الموقع"
    style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
  >
    عن الموقع
  </Link>
  <Link
    href="/سياسة-الخصوصية"
    style={{ color: "var(--waaei-mute)", textDecoration: "none" }}
  >
    الخصوصية
  </Link>
</nav>
```

- [ ] **Step 2: Add articles to sitemap**

In `app/sitemap.ts`, import allArticles and add the hub + published article entries:

```ts
import { MetadataRoute } from "next";
import { allArticles } from "@/lib/articles";

const HOMEPAGE_UPDATED = new Date("2026-05-22");
const TESTS_UPDATED = new Date("2026-05-22");
const ABOUT_UPDATED = new Date("2026-04-01");
const PRIVACY_UPDATED = new Date("2026-05-22");
const ARTICLES_UPDATED = new Date("2026-06-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://waaei.me";

  const testSlugs = [
    "اختبار-الاكتئاب",
    "اختبار-القلق",
    "اختبار-الإحتراق-الوظيفي",
    "اختبار-التوتر",
    "اختبار-الوسواس-القهري",
    "اختبار-ADHD-للبالغين",
    "اختبار-الصدمة-النفسية",
    "اختبار-الأرق",
    "اختبار-تقدير-الذات",
    "اختبار-الرهاب-الاجتماعي",
    "اختبار-الشخصية-الخمسة",
    "اختبار-نمط-التعلق-العاطفي",
    "اختبار-إدمان-الهاتف",
    "اختبار-الذكاء-العاطفي",
    "اختبار-الوحدة-النفسية",
    "اختبار-الغضب",
    "اختبار-اضطراب-الأكل",
    "اختبار-ثنائي-القطب",
    "اختبار-الاكتئاب-والقلق-والتوتر",
    "اختبار-الشخصية-النرجسية",
    "اختبار-جودة-النوم",
    "اختبار-النمو-بعد-الصدمة",
    "اختبار-أنماط-الاستهلاك",
  ];

  const publishedArticles = allArticles.filter((a) => a.status === "published");

  return [
    {
      url: base,
      lastModified: HOMEPAGE_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/عن-الموقع`,
      lastModified: ABOUT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${base}/اختبارات`,
      lastModified: TESTS_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${base}/سياسة-الخصوصية`,
      lastModified: PRIVACY_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    ...(publishedArticles.length > 0
      ? [
          {
            url: `${base}/مقالات`,
            lastModified: ARTICLES_UPDATED,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
          ...publishedArticles.map((a) => ({
            url: `${base}/مقالات/${a.slug}`,
            lastModified: new Date(a.publishedAt),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          })),
        ]
      : []),
    ...testSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: TESTS_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
```

- [ ] **Step 3: Verify header on dev server**

Navigate to `http://localhost:3000`. Expected: header shows 4 nav links: الاختبارات (dark) · المقالات (muted) · عن الموقع (muted) · الخصوصية (muted).

Click "المقالات" — should navigate to `/مقالات`.

- [ ] **Step 4: Verify sitemap**

Navigate to `http://localhost:3000/sitemap.xml`.

Expected: `/مقالات` entry does NOT appear (all articles are still drafts). No errors.

Temporarily publish depression article, refresh sitemap — expected: `/مقالات` and `/مقالات/أعراض-الاكتئاب` entries appear. Revert to draft.

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass (the articles.test.ts suite from Task 1).

- [ ] **Step 6: Commit and push**

```bash
git add components/Header.tsx app/sitemap.ts
git commit -m "feat: add المقالات header nav link and sitemap entries"
git push
```

Expected: Vercel auto-deploys. Verify on `https://waaei.vercel.app/مقالات` — page loads (shows "لا توجد مقالات منشورة بعد."). Header shows 4 links.
