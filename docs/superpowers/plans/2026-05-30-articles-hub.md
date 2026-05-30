# Articles Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/مقالات` educational content hub with daily AI-generated Arabic mental health articles, a Supabase backend, a Vercel cron for automated generation, and a password-protected `/review` page with real Approve/Delete buttons.

**Architecture:** Matches the dahabpulse pattern exactly. Articles stored in Supabase `articles` table (already created). Daily Vercel cron calls `/api/cron/generate-article` → Claude API generates Arabic markdown → saved as `status: draft` → operator reviews at `/review` → clicks Approve → `status: published` → article goes live. Next.js rewrites map `/مقالات/:path*` → `/articles/:path*` (Latin directory, avoids Windows Arabic-dir bug).

**Tech Stack:** Next.js 16 App Router, TypeScript, `@supabase/supabase-js`, `@anthropic-ai/sdk`, `react-markdown` + `remark-gfm`, Tailwind v4, inline `var(--waaei-*)` styles. `params`, `searchParams`, and `cookies()` are all async (must be awaited).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/supabase/client.ts` | Service-role Supabase client (server-only) |
| Create | `lib/supabase/articles.ts` | DB functions: get/save/approve/delete articles |
| Create | `lib/ai/generateArticle.ts` | Topic pool + Claude prompt + article generation |
| Create | `app/api/cron/generate-article/route.ts` | Vercel cron endpoint |
| Create | `vercel.json` | Cron schedule + maxDuration |
| Create | `app/articles/page.tsx` | Hub index at /مقالات |
| Create | `app/articles/[slug]/page.tsx` | Article page at /مقالات/[slug] |
| Create | `app/review/actions.ts` | Server actions: login, approve, delete |
| Create | `app/review/page.tsx` | Review page: login form or article list |
| Create | `app/review/logout/route.ts` | Clear cookie, redirect |
| Modify | `next.config.ts` | Add Arabic→Latin URL rewrites |
| Modify | `components/Header.tsx` | Add المقالات nav link |
| Modify | `app/sitemap.ts` | Add published article URLs |

---

## Task 1: Install dependencies + Supabase client + DB functions

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/articles.ts`

- [ ] **Step 1: Install packages**

```bash
npm install @supabase/supabase-js @anthropic-ai/sdk react-markdown remark-gfm
```

Expected: packages added to `package.json`, no peer dependency errors.

- [ ] **Step 2: Create `lib/supabase/client.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
```

- [ ] **Step 3: Create `lib/supabase/articles.ts`**

```ts
import { unstable_cache } from "next/cache";
import { supabase } from "./client";

export type Article = {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  content: string;
  category: string;
  related_test_slug: string;
  related_test_name: string;
  related_test_scale: string;
  related_test_minutes: number;
  reading_minutes: number;
  status: "draft" | "published";
  published_at: string;
  created_at: string;
};

function rowToArticle(row: Record<string, unknown>): Article {
  return {
    id:                  row.id as string,
    slug:                row.slug as string,
    title:               row.title as string,
    meta_description:    row.meta_description as string,
    content:             row.content as string,
    category:            row.category as string,
    related_test_slug:   row.related_test_slug as string,
    related_test_name:   row.related_test_name as string,
    related_test_scale:  row.related_test_scale as string,
    related_test_minutes: row.related_test_minutes as number,
    reading_minutes:     row.reading_minutes as number,
    status:              row.status as "draft" | "published",
    published_at:        row.published_at as string,
    created_at:          row.created_at as string,
  };
}

async function _getPublishedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToArticle);
  } catch (e) {
    console.error("[supabase] getPublishedArticles failed:", e);
    return [];
  }
}

async function _getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return null;
    return rowToArticle(data);
  } catch (e) {
    console.error("[supabase] getArticleBySlug failed:", e);
    return null;
  }
}

export const getPublishedArticles = unstable_cache(
  _getPublishedArticles,
  ["published-articles"],
  { revalidate: 3600 }
);

export const getArticleBySlug = unstable_cache(
  _getArticleBySlug,
  ["article-by-slug"],
  { revalidate: 3600 }
);

export async function getDraftArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToArticle);
  } catch (e) {
    console.error("[supabase] getDraftArticles failed:", e);
    return [];
  }
}

export async function approveArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from("articles")
    .update({ status: "published" })
    .eq("id", id);
  if (error) throw new Error(`Supabase update failed: ${error.message}`);
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}

export async function saveArticle(
  article: Omit<Article, "id" | "created_at">
): Promise<string> {
  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug:                article.slug,
      title:               article.title,
      meta_description:    article.meta_description,
      content:             article.content,
      category:            article.category,
      related_test_slug:   article.related_test_slug,
      related_test_name:   article.related_test_name,
      related_test_scale:  article.related_test_scale,
      related_test_minutes: article.related_test_minutes,
      reading_minutes:     article.reading_minutes,
      status:              article.status,
      published_at:        article.published_at,
    })
    .select("id")
    .single();
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  return data.id as string;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors on the new files.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/ package.json package-lock.json
git commit -m "feat: add Supabase client and articles DB functions"
```

---

## Task 2: Article generation logic

**Files:**
- Create: `lib/ai/generateArticle.ts`

- [ ] **Step 1: Create `lib/ai/generateArticle.ts`**

```ts
import Anthropic from "@anthropic-ai/sdk";
import { saveArticle } from "@/lib/supabase/articles";
import { supabase } from "@/lib/supabase/client";

interface Topic {
  slug: string;
  title: string;
  category: string;
  related_test_slug: string;
  related_test_name: string;
  related_test_scale: string;
  related_test_minutes: number;
  topicHint: string;
}

const TOPICS: Topic[] = [
  // الاكتئاب والمزاج
  { slug: "أعراض-الاكتئاب", title: "ما هو الاكتئاب؟ الأعراض والأسباب ومتى تطلب المساعدة", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح ما هو الاكتئاب، الفرق بينه وبين الحزن الطبيعي، أعراضه الشائعة، أسبابه، ومتى يجب طلب المساعدة المتخصصة — بأسلوب مباشر يخاطب القارئ بـ'أنت'" },
  { slug: "الفرق-بين-الحزن-والاكتئاب", title: "الحزن أم الاكتئاب؟ كيف تعرف الفرق", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح الفرق الجوهري بين الحزن الطبيعي واضطراب الاكتئاب — المدة، الشدة، التأثير على الحياة اليومية، وعلامات التحول من حزن عابر إلى حالة تحتاج تدخلاً" },
  { slug: "الاكتئاب-لدى-الشباب-العربي", title: "الاكتئاب لدى الشباب العربي: خاص بك أم تجربة مشتركة؟", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اكتب عن الاكتئاب في السياق العربي — الوصمة الاجتماعية، الضغوط الأسرية، الاختلاف في التعبير عن الاكتئاب بين الثقافات، ولماذا يتأخر كثيرون في طلب المساعدة" },

  // القلق والخوف
  { slug: "أعراض-القلق-النفسي", title: "ما هو القلق النفسي؟ الأعراض والفرق عن الخوف الطبيعي", category: "القلق والخوف", related_test_slug: "اختبار-القلق", related_test_name: "اختبار القلق", related_test_scale: "GAD-7", related_test_minutes: 2, topicHint: "اشرح اضطراب القلق العام — الفرق بين القلق الصحي والمزمن، أعراضه النفسية والجسدية، أسبابه، وكيف يؤثر على الحياة اليومية" },
  { slug: "الرهاب-الاجتماعي", title: "الرهاب الاجتماعي: أكثر من مجرد خجل", category: "القلق والخوف", related_test_slug: "اختبار-الرهاب-الاجتماعي", related_test_name: "اختبار الرهاب الاجتماعي", related_test_scale: "SPIN", related_test_minutes: 2, topicHint: "اشرح الفرق بين الخجل الطبيعي والرهاب الاجتماعي — الأعراض التي تميّزه، كيف يعيق الحياة المهنية والعلاقات، وخيارات العلاج المتاحة" },
  { slug: "نوبات-الهلع", title: "نوبة الهلع: لماذا تحدث وكيف تتعامل معها", category: "القلق والخوف", related_test_slug: "اختبار-القلق", related_test_name: "اختبار القلق", related_test_scale: "GAD-7", related_test_minutes: 2, topicHint: "اشرح ما هي نوبة الهلع، لماذا الجسم يتصرف هكذا، كيف تميّزها عن النوبة القلبية، وما الذي يمكن فعله خلالها وبعدها" },
  { slug: "الوسواس-القهري", title: "الوسواس القهري: أكثر من مجرد ترتيب وتنظيف", category: "القلق والخوف", related_test_slug: "اختبار-الوسواس-القهري", related_test_name: "اختبار الوسواس القهري", related_test_scale: "OCI-R", related_test_minutes: 3, topicHint: "اشرح اضطراب الوسواس القهري — الأفكار الاقتحامية مقابل الأفعال القهرية، لماذا هو أكثر من مجرد حب للنظام، وكيف يؤثر على حياة من يعانون منه" },

  // التوتر والإرهاق
  { slug: "التوتر-النفسي", title: "التوتر النفسي: الفرق بين التوتر الصحي والمُضِر", category: "التوتر والإرهاق", related_test_slug: "اختبار-التوتر", related_test_name: "اختبار التوتر", related_test_scale: "PSS-10", related_test_minutes: 3, topicHint: "اشرح الفرق بين التوتر الصحي الذي يحفّز والتوتر المزمن الضار، أعراضه الجسدية والنفسية، وعلى ماذا تدل الدراسات عن تأثيره طويل الأمد على الصحة" },
  { slug: "الإحتراق-الوظيفي", title: "الإحتراق الوظيفي: الأعراض والأسباب وكيف تتعافى", category: "التوتر والإرهاق", related_test_slug: "اختبار-الإحتراق-الوظيفي", related_test_name: "اختبار الإحتراق الوظيفي", related_test_scale: "MBI", related_test_minutes: 3, topicHint: "اشرح الإحتراق الوظيفي وفق تعريف WHO في ICD-11 — الأعراض الثلاثة الأساسية، الفرق بينه وبين الإجهاد العادي، أسبابه الفردية والمؤسسية، وخطوات التعافي" },
  { slug: "إدمان-الهاتف-وصحتك-النفسية", title: "إدمان الهاتف وصحتك النفسية: ما الذي يحدث فعلاً؟", category: "التوتر والإرهاق", related_test_slug: "اختبار-إدمان-الهاتف", related_test_name: "اختبار إدمان الهاتف", related_test_scale: "SAS-SV", related_test_minutes: 2, topicHint: "اشرح كيف يؤثر الاستخدام المفرط للهاتف على الصحة النفسية — القلق، اضطراب النوم، تراجع التركيز، وعلامات التحول من استخدام صحي إلى إدمان فعلي" },

  // النوم
  { slug: "مشاكل-النوم-والأرق", title: "مشاكل النوم والأرق: الأسباب وكيف تحسّن نومك", category: "التوتر والإرهاق", related_test_slug: "اختبار-الأرق", related_test_name: "اختبار الأرق", related_test_scale: "ISI", related_test_minutes: 2, topicHint: "اشرح اضطراب الأرق — الفرق بين الأرق العارض والمزمن، أعراضه الليلية والنهارية، أسبابه النفسية والسلوكية، وفعالية العلاج المعرفي السلوكي (CBT-I)" },
  { slug: "النوم-والصحة-النفسية", title: "العلاقة بين النوم والصحة النفسية: دائرة لا تنتهي", category: "التوتر والإرهاق", related_test_slug: "اختبار-جودة-النوم", related_test_name: "اختبار جودة النوم", related_test_scale: "PSQI", related_test_minutes: 3, topicHint: "اشرح العلاقة الثنائية بين اضطرابات النوم والصحة النفسية — كيف يسبب الاكتئاب والقلق مشاكل النوم والعكس صحيح، وعلى ماذا تدل أبحاث النوم الحديثة" },

  // الصدمة
  { slug: "اضطراب-ما-بعد-الصدمة", title: "اضطراب ما بعد الصدمة: ما الذي يحدث في العقل والجسم", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الصدمة-النفسية", related_test_name: "اختبار الصدمة النفسية", related_test_scale: "PCL-5", related_test_minutes: 3, topicHint: "اشرح اضطراب ما بعد الصدمة — لماذا يحدث لبعض الناس دون غيرهم، الأعراض الأربع المحاور (إعادة المعايشة، التجنب، التغييرات المعرفية، الاستثارة)، وخيارات العلاج المتاحة" },
  { slug: "التعافي-من-الصدمة", title: "التعافي من الصدمة النفسية: هل يمكن العودة إلى الطبيعي؟", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-النمو-بعد-الصدمة", related_test_name: "اختبار النمو بعد الصدمة", related_test_scale: "PTGI-SF", related_test_minutes: 3, topicHint: "اشرح مفهوم التعافي من الصدمة والنمو ما بعد الصدمة — كيف يتعافى الناس، ما هو النمو ما بعد الصدمة، وكيف تدعم شخصاً قريباً يمر بتجربة صادمة" },

  // تقدير الذات
  { slug: "تقدير-الذات", title: "تقدير الذات المنخفض: أعراضه وكيف تبنيه من جديد", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-تقدير-الذات", related_test_name: "اختبار تقدير الذات", related_test_scale: "RSES", related_test_minutes: 2, topicHint: "اشرح تقدير الذات المنخفض — كيف يتشكّل، علاماته اليومية التي نتجاهلها، الفرق بين الغرور والثقة الحقيقية، وخطوات عملية لبناء تقدير ذات أكثر صحة" },

  // الوحدة
  { slug: "الوحدة-النفسية", title: "الوحدة النفسية: لماذا نشعر بها حتى وسط الناس؟", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الوحدة-النفسية", related_test_name: "اختبار الوحدة النفسية", related_test_scale: "ULS-8", related_test_minutes: 2, topicHint: "اشرح الوحدة النفسية — الفرق بين العزلة والوحدة، لماذا يشعر بها الناس حتى حين يكونون محاطين بالآخرين، تأثيرها على الصحة الجسدية والنفسية، وكيف تتعامل معها" },

  // الغضب
  { slug: "إدارة-الغضب", title: "إدارة الغضب: ليس كبته بل فهمه", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الغضب", related_test_name: "اختبار الغضب", related_test_scale: "STAXI", related_test_minutes: 3, topicHint: "اشرح الغضب كمشاعر طبيعية مقابل الغضب المزمن كمشكلة — ما الذي يحدث في الجسم أثناء الغضب، الفرق بين كبت الغضب والتعبير الصحي عنه، وتقنيات عملية لإدارته" },

  // الذكاء العاطفي
  { slug: "الذكاء-العاطفي", title: "الذكاء العاطفي: ما هو ولماذا يهمك أكثر من IQ؟", category: "الشخصية والعلاقات", related_test_slug: "اختبار-الذكاء-العاطفي", related_test_name: "اختبار الذكاء العاطفي", related_test_scale: "BEIS-10", related_test_minutes: 3, topicHint: "اشرح الذكاء العاطفي — مكوناته الخمسة وفق نموذج جولمان، لماذا يتنبأ بالنجاح في العمل والعلاقات أكثر من معدل الذكاء، وكيف يمكن تطويره" },

  // أنماط التعلق
  { slug: "أنماط-التعلق-العاطفي", title: "أنماط التعلق العاطفي: لماذا تتصرف هكذا في العلاقات؟", category: "الشخصية والعلاقات", related_test_slug: "اختبار-نمط-التعلق-العاطفي", related_test_name: "اختبار نمط التعلق", related_test_scale: "ECR-S", related_test_minutes: 3, topicHint: "اشرح نظرية التعلق — الأنماط الأربعة (الآمن، القلق، المتجنب، المضطرب)، كيف تتشكّل في الطفولة، وكيف تؤثر على علاقاتنا البالغة وكيف يمكن تغييرها" },

  // الشخصية
  { slug: "الشخصية-النرجسية", title: "الشخصية النرجسية: تعرّف عليها قبل أن تتأذى", category: "الشخصية والعلاقات", related_test_slug: "اختبار-الشخصية-النرجسية", related_test_name: "اختبار الشخصية النرجسية", related_test_scale: "PNI-16", related_test_minutes: 2, topicHint: "اشرح النرجسية كسمة شخصية مقابل اضطراب الشخصية النرجسية — العلامات الحقيقية، الفرق بين الثقة بالنفس والنرجسية، وكيف تتعامل مع شخص نرجسي في حياتك" },
  { slug: "الشخصية-الخمسة-الكبار", title: "نموذج الشخصية الخمسة: أداة العلم لفهم طباعك", category: "الشخصية والعلاقات", related_test_slug: "اختبار-الشخصية-الخمسة", related_test_name: "اختبار الشخصية الخمسة", related_test_scale: "BFI-10", related_test_minutes: 3, topicHint: "اشرح نموذج الشخصية الخمسة الكبار (OCEAN) — ما كل سمة، لماذا هذا النموذج هو الأدق علمياً مقارنة بـ MBTI، وكيف تعكس هذه السمات حياتك العملية والاجتماعية" },

  // اضطرابات الأكل
  { slug: "اضطرابات-الأكل", title: "اضطرابات الأكل: أكثر من مجرد تحكم في الطعام", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-اضطراب-الأكل", related_test_name: "اختبار اضطراب الأكل", related_test_scale: "EAT-7", related_test_minutes: 2, topicHint: "اشرح اضطرابات الأكل — الأنواع الرئيسية (فقدان الشهية، الشره المرضي، الإفراط في الأكل)، العلامات التحذيرية، لماذا هي اضطرابات نفسية وليست مجرد أنماط غذائية، ومتى تطلب المساعدة" },

  // ثنائي القطب
  { slug: "ثنائي-القطب", title: "اضطراب ثنائي القطب: فهم تقلبات المزاج الشديدة", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-ثنائي-القطب", related_test_name: "اختبار ثنائي القطب", related_test_scale: "MDQ", related_test_minutes: 3, topicHint: "اشرح اضطراب ثنائي القطب — الفرق بين النوع الأول والثاني، ما هي نوبات الهوس والاكتئاب، لماذا يُشخَّص متأخراً، وأهمية الاستمرار في العلاج" },

  // ADHD
  { slug: "ADHD-عند-البالغين", title: "ADHD عند البالغين: ليس مجرد قلة تركيز", category: "التوتر والإرهاق", related_test_slug: "اختبار-ADHD-للبالغين", related_test_name: "اختبار ADHD للبالغين", related_test_scale: "ASRS-5", related_test_minutes: 2, topicHint: "اشرح ADHD عند البالغين — لماذا يُشخَّص كثيرون متأخراً، كيف يختلف عن ADHD الطفولة، أعراضه عند البالغين في العمل والعلاقات، وما الخيارات العلاجية المتاحة" },

  // الصحة النفسية العامة
  { slug: "متى-تزور-معالجاً-نفسياً", title: "متى تزور معالجاً نفسياً؟ 8 علامات لا تتجاهلها", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح متى يكون زيارة المعالج النفسي ضرورية — 8 علامات محددة، الفرق بين المعالج النفسي والطبيب النفسي والمرشد، وكيف تجد معالجاً في دول الخليج ومصر" },
  { slug: "وصمة-الصحة-النفسية", title: "وصمة الصحة النفسية في العالم العربي: لماذا نتأخر في طلب المساعدة", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح ظاهرة الوصمة الاجتماعية للصحة النفسية في السياق العربي — أسبابها الثقافية، كيف تؤخر العلاج، وكيف نتحدث عن الصحة النفسية بطريقة تكسر هذه الوصمة" },
];

function slugify(title: string, topicIndex: number): string {
  return TOPICS[topicIndex]?.slug ?? title.toLowerCase().replace(/\s+/g, "-").slice(0, 50);
}

async function getExistingArticles(): Promise<{ slug: string }[]> {
  try {
    const { data } = await supabase.from("articles").select("slug");
    return (data ?? []) as { slug: string }[];
  } catch {
    return [];
  }
}

async function pickUnusedTopic(offset = 0): Promise<{ topic: Topic; index: number }> {
  const existing = await getExistingArticles();
  const existingSlugs = new Set(existing.map((a) => a.slug));

  const dayIndex = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  for (let i = 0; i < TOPICS.length; i++) {
    const idx = (dayIndex + offset + i) % TOPICS.length;
    if (!existingSlugs.has(TOPICS[idx].slug)) {
      return { topic: TOPICS[idx], index: idx };
    }
  }

  // All topics covered — cycle from start
  const idx = (dayIndex + offset) % TOPICS.length;
  return { topic: TOPICS[idx], index: idx };
}

export async function generateAndSaveArticle(
  client?: Anthropic,
  topicOffset = 0
): Promise<string> {
  const _client = client ?? new Anthropic();
  const { topic } = await pickUnusedTopic(topicOffset);

  const response = await _client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `أنت كاتب متخصص في الصحة النفسية لموقع واعي (waaei.me) — منصة عربية للتوعية النفسية.

اكتب مقالاً تثقيفياً متعمقاً بالعربية عن هذا الموضوع:
"${topic.topicHint}"

متطلبات الأسلوب (غير قابلة للتفاوض):
- خاطب القارئ مباشرة بـ"أنت" — اجعله يشعر أنك تتحدث معه شخصياً
- افتح بجملة أو حادثة مشخّصة تشده — لا تبدأ بتعريف أكاديمي أو "في هذا المقال سنتناول"
- تفاوت بين الجمل القصيرة والطويلة — الإيقاع المتنوع علامة الكتابة الحقيقية
- لا تتردد في استخدام الفصحى المعاصرة الطبيعية — ليست صحفية رسمية ولا عامية
- ممنوع: "من الجدير بالذكر"، "تجدر الإشارة"، "في هذا السياق"، "وبناءً على ما سبق"، "وختاماً"
- لا تعيد صياغة المقدمة في الخاتمة

هيكل المقال المطلوب (بالماركداون):

[فقرة مقدمة قوية بدون عنوان — 3-4 جمل تشدّ القارئ]

## [عنوان القسم الأول — ما هو/ما هي]
[محتوى تفصيلي]

## [عنوان القسم الثاني — الأعراض أو العلامات]
[محتوى تفصيلي]

<!-- CTA -->

## [عنوان القسم الثالث — الأسباب أو الآليات]
[محتوى تفصيلي]

## [عنوان القسم الرابع — متى تطلب المساعدة أو كيف تتعامل معه]
[محتوى تفصيلي]

## المصادر
1. [اسم المصدر + الجهة](رابط URL حقيقي من WHO أو PubMed أو APA أو جمعية نفسية معترف بها)
2. [اسم المصدر الثاني](رابط URL حقيقي)

ملاحظات مهمة:
- ضع <!-- CTA --> بعد قسم الأعراض بالضبط (القسم الثاني)
- المصادر يجب أن تكون روابط حقيقية موثوقة (WHO، PubMed، APA) — لا تخترع روابط
- الطول المستهدف: 700-900 كلمة في المحتوى (بدون المصادر)

أعد فقط الماركداون بدون أي شرح أو تعليق إضافي.`,
      },
    ],
  });

  const content = response.content[0].type === "text" ? response.content[0].text.trim() : "";
  if (!content) throw new Error("Empty response from Claude");

  // Extract first line as a rough title check, estimate reading time
  const wordCount = content.split(/\s+/).length;
  const reading_minutes = Math.max(3, Math.ceil(wordCount / 200));

  // Generate meta_description from intro (first non-empty paragraph)
  const introMatch = content.match(/^([^\n#][^\n]{80,})/m);
  const meta_description = introMatch
    ? introMatch[1].slice(0, 155)
    : topic.title;

  const id = await saveArticle({
    slug: topic.slug,
    title: topic.title,
    meta_description,
    content,
    category: topic.category,
    related_test_slug: topic.related_test_slug,
    related_test_name: topic.related_test_name,
    related_test_scale: topic.related_test_scale,
    related_test_minutes: topic.related_test_minutes,
    reading_minutes,
    status: "draft",
    published_at: new Date().toISOString(),
  });

  return id;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/
git commit -m "feat: add article generation logic with 25-topic pool"
```

---

## Task 3: Vercel cron route + vercel.json

**Files:**
- Create: `app/api/cron/generate-article/route.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create `app/api/cron/generate-article/route.ts`**

```ts
import { NextResponse } from "next/server";
import { generateAndSaveArticle } from "@/lib/ai/generateArticle";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const topicOffset = parseInt(url.searchParams.get("topicOffset") ?? "0", 10);

  try {
    const id = await generateAndSaveArticle(undefined, topicOffset);
    return NextResponse.json({ ok: true, articleId: id, topicOffset });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Generation failed", message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-article",
      "schedule": "0 2 * * *"
    }
  ],
  "functions": {
    "app/api/cron/generate-article/route.ts": {
      "maxDuration": 300
    }
  }
}
```

Cron fires at 02:00 UTC daily (5am Gulf time). `maxDuration: 300` gives Claude API enough time.

- [ ] **Step 3: Test the cron manually on dev server**

Start the dev server:
```bash
npm run dev
```

In a separate terminal, trigger the cron manually:
```bash
curl -H "Authorization: Bearer 3776a62b9cd4b9d7b437c51db77982a27e56f1070d38fae24bc23e45575b20b9" "http://localhost:3000/api/cron/generate-article"
```

Expected response:
```json
{ "ok": true, "articleId": "some-uuid", "topicOffset": 0 }
```

Check Supabase dashboard → Table Editor → articles to confirm a new row was inserted with `status: draft`.

- [ ] **Step 4: Commit**

```bash
git add app/api/ vercel.json
git commit -m "feat: add Vercel cron route for daily article generation"
```

---

## Task 4: Next.js rewrites + hub index page

**Files:**
- Modify: `next.config.ts`
- Create: `app/articles/page.tsx`

- [ ] **Step 1: Add rewrites to `next.config.ts`**

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

- [ ] **Step 2: Create `app/articles/page.tsx`**

```tsx
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
                        {article.reading_minutes} دقائق للقراءة
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

- [ ] **Step 3: Verify on dev server**

Navigate to `http://localhost:3000/مقالات`. Expected: page loads, shows "لا توجد مقالات منشورة بعد." (no published articles yet). No console errors.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts app/articles/page.tsx
git commit -m "feat: add articles hub index page and URL rewrites"
```

---

## Task 5: Individual article page

**Files:**
- Create: `app/articles/[slug]/page.tsx`

- [ ] **Step 1: Create `app/articles/[slug]/page.tsx`**

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedArticles, getArticleBySlug } from "@/lib/supabase/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(decodeURIComponent(slug));
  if (!article) return {};
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
    datePublished: article.published_at,
    publisher: { "@type": "Organization", name: "واعي", url: "https://waaei.me" },
    about: { "@type": "MedicalCondition", name: article.category },
  };

  const catColor = CATEGORY_COLOR[article.category] ?? "#5e7bbf";
  const [beforeCTA, afterCTA] = article.content.split("<!-- CTA -->");

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
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>{article.reading_minutes} دقائق للقراءة</span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--waaei-mute)" }}>
              {new Date(article.published_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long" })}
            </span>
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
            {beforeCTA ?? article.content}
          </ReactMarkdown>

          {/* CTA card — only shown if <!-- CTA --> marker exists */}
          {afterCTA !== undefined && (
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
                <div style={{ color: "var(--waaei-mute)", fontSize: 12 }}>
                  {article.related_test_name} · {article.related_test_scale} · {article.related_test_minutes} دقائق · مجاني وسري
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
          {afterCTA !== undefined && (
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
```

- [ ] **Step 2: Verify with a published article**

In Supabase dashboard → Table Editor → articles, manually update the `status` of the article created in Task 3 Step 3 from `draft` to `published`.

Navigate to `http://localhost:3000/مقالات/[the-slug]`.

Expected:
- Article renders with title, category pill, content
- CTA card appears mid-article (after the symptoms section)
- Sources section renders as a numbered list with clickable links
- "اقرأ أيضاً" doesn't exist yet — that's fine

Revert article back to `draft` in Supabase.

- [ ] **Step 3: Commit**

```bash
git add app/articles/[slug]/
git commit -m "feat: add individual article page with markdown rendering and CTA injection"
```

---

## Task 6: Review page (login + article list + approve/delete)

**Files:**
- Create: `app/review/actions.ts`
- Create: `app/review/page.tsx`
- Create: `app/review/logout/route.ts`

- [ ] **Step 1: Create `app/review/actions.ts`**

```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { approveArticle as dbApprove, deleteArticle as dbDelete } from "@/lib/supabase/articles";

export async function submitReviewPassword(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.REVIEW_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("review_auth", "1", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/review");
  }
  redirect("/review?error=1");
}

export async function approveArticleAction(id: string) {
  await dbApprove(id);
  redirect("/review");
}

export async function deleteArticleAction(id: string) {
  await dbDelete(id);
  redirect("/review");
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
import { getDraftArticles, getPublishedArticles } from "@/lib/supabase/articles";
import { submitReviewPassword, approveArticleAction, deleteArticleAction } from "./actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ReviewPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("review_auth")?.value === "1";
  const { error } = await searchParams;

  if (!isAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--waaei-bg)", fontFamily: "var(--waaei-font-sans)", direction: "rtl" }}>
        <div style={{ background: "var(--waaei-surface)", border: "1px solid var(--waaei-rule)", borderRadius: 12, padding: "36px 32px", width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--waaei-ink)" }}>مراجعة المقالات</div>
          {error && (
            <div style={{ fontSize: 13, color: "#c25940", background: "#c2594018", padding: "8px 12px", borderRadius: 7 }}>
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
              style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--waaei-rule)", borderRadius: 8, fontSize: 14, background: "var(--waaei-bg)", color: "var(--waaei-ink)", outline: "none", boxSizing: "border-box" }}
            />
            <button type="submit" style={{ background: "var(--waaei-ink)", color: "var(--waaei-bg)", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" }}>
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  const [drafts, published] = await Promise.all([getDraftArticles(), getPublishedArticles()]);
  const all = [...drafts, ...published];

  return (
    <div style={{ minHeight: "100vh", background: "var(--waaei-bg)", fontFamily: "var(--waaei-font-sans)", direction: "rtl", padding: "32px 22px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--waaei-ink)" }}>مراجعة المقالات</div>
            <div style={{ fontSize: 13, color: "var(--waaei-mute)", marginTop: 4 }}>
              {drafts.length} مسودة · {published.length} منشور
            </div>
          </div>
          <a href="/review/logout" style={{ fontSize: 13, color: "var(--waaei-mute)", textDecoration: "none", border: "1px solid var(--waaei-rule)", borderRadius: 7, padding: "6px 14px" }}>
            تسجيل الخروج
          </a>
        </div>

        {/* Articles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {all.map((article) => {
            const isDraft = article.status === "draft";
            return (
              <div key={article.id}>
                {/* Status + action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: isDraft ? "#d0a23618" : "#9ec79f30", color: isDraft ? "#d0a236" : "#4a7a4a" }}>
                    {isDraft ? "مسودة" : "منشور"}
                  </span>
                  {isDraft && (
                    <form action={approveArticleAction.bind(null, article.id)}>
                      <button type="submit" style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#4a7a4a", border: "none", borderRadius: 5, padding: "4px 12px", cursor: "pointer" }}>
                        نشر ✓
                      </button>
                    </form>
                  )}
                  <form action={deleteArticleAction.bind(null, article.id)}>
                    <button type="submit" style={{ fontSize: 11, color: "#c25940", background: "#c2594018", border: "none", borderRadius: 5, padding: "4px 12px", cursor: "pointer" }}>
                      حذف
                    </button>
                  </form>
                </div>

                {/* Article content */}
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--waaei-ink)", lineHeight: 1.35, marginBottom: 16 }}>
                  {article.title}
                </h2>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--waaei-ink)", margin: "20px 0 8px" }}>{children}</h2>,
                    p: ({ children }) => <p style={{ fontSize: 14, color: "var(--waaei-ink)", lineHeight: 1.7, marginBottom: 10 }}>{children}</p>,
                    ol: ({ children }) => <ol style={{ paddingRight: 18, margin: "0 0 10px" }}>{children}</ol>,
                    li: ({ children }) => <li style={{ fontSize: 13, color: "var(--waaei-mute)", lineHeight: 1.6, marginBottom: 4 }}>{children}</li>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--waaei-mute)", textDecoration: "underline" }}>{children}</a>,
                  }}
                >
                  {article.content.replace("<!-- CTA -->", "\n\n---\n\n**[ موضع CTA ]**\n\n---\n\n")}
                </ReactMarkdown>

                <div style={{ height: 2, background: "var(--waaei-rule)", marginTop: 32, borderRadius: 1 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Test login flow on dev server**

1. Navigate to `http://localhost:3000/review` — should show password form
2. Submit wrong password — should show "كلمة المرور غير صحيحة"
3. Submit correct password — should redirect to `/review` showing all articles
4. Click "نشر ✓" on a draft — should update status in Supabase and reload
5. Navigate to `http://localhost:3000/review/logout` — should clear cookie and show login form

- [ ] **Step 5: Commit**

```bash
git add app/review/
git commit -m "feat: add password-protected review page with approve/delete buttons"
```

---

## Task 7: Header nav + sitemap + push

**Files:**
- Modify: `components/Header.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add المقالات link to `components/Header.tsx`**

In the `<nav>` block, add the new link between الاختبارات and عن الموقع:

```tsx
<nav className="flex gap-2 lg:gap-4 text-[11px] lg:text-[12px] font-semibold">
  <Link href="/اختبارات" style={{ color: "var(--waaei-ink)", textDecoration: "none" }}>
    الاختبارات
  </Link>
  <Link href="/مقالات" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
    المقالات
  </Link>
  <Link href="/عن-الموقع" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
    عن الموقع
  </Link>
  <Link href="/سياسة-الخصوصية" style={{ color: "var(--waaei-mute)", textDecoration: "none" }}>
    الخصوصية
  </Link>
</nav>
```

- [ ] **Step 2: Update `app/sitemap.ts`**

Add the import and published article entries:

```ts
import { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/supabase/articles";

const HOMEPAGE_UPDATED = new Date("2026-05-22");
const TESTS_UPDATED    = new Date("2026-05-22");
const ABOUT_UPDATED    = new Date("2026-04-01");
const PRIVACY_UPDATED  = new Date("2026-05-22");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://waaei.me";

  const testSlugs = [
    "اختبار-الاكتئاب", "اختبار-القلق", "اختبار-الإحتراق-الوظيفي", "اختبار-التوتر",
    "اختبار-الوسواس-القهري", "اختبار-ADHD-للبالغين", "اختبار-الصدمة-النفسية",
    "اختبار-الأرق", "اختبار-تقدير-الذات", "اختبار-الرهاب-الاجتماعي",
    "اختبار-الشخصية-الخمسة", "اختبار-نمط-التعلق-العاطفي", "اختبار-إدمان-الهاتف",
    "اختبار-الذكاء-العاطفي", "اختبار-الوحدة-النفسية", "اختبار-الغضب",
    "اختبار-اضطراب-الأكل", "اختبار-ثنائي-القطب", "اختبار-الاكتئاب-والقلق-والتوتر",
    "اختبار-الشخصية-النرجسية", "اختبار-جودة-النوم", "اختبار-النمو-بعد-الصدمة",
    "اختبار-أنماط-الاستهلاك",
  ];

  const publishedArticles = await getPublishedArticles();

  return [
    { url: base, lastModified: HOMEPAGE_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/عن-الموقع`, lastModified: ABOUT_UPDATED, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/اختبارات`, lastModified: TESTS_UPDATED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/سياسة-الخصوصية`, lastModified: PRIVACY_UPDATED, changeFrequency: "yearly" as const, priority: 0.3 },
    ...(publishedArticles.length > 0 ? [
      { url: `${base}/مقالات`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
      ...publishedArticles.map((a) => ({
        url: `${base}/مقالات/${a.slug}`,
        lastModified: new Date(a.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ] : []),
    ...testSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: TESTS_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
```

**Note:** `sitemap()` is now `async` because it fetches from Supabase. Next.js supports async sitemap functions.

- [ ] **Step 3: Run full typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Verify header on dev server**

Navigate to `http://localhost:3000`. Expected: header shows 4 links — الاختبارات · المقالات · عن الموقع · الخصوصية.

- [ ] **Step 5: Final commit and push**

```bash
git add components/Header.tsx app/sitemap.ts
git commit -m "feat: add المقالات header link and dynamic sitemap for articles"
git push
```

Expected: Vercel auto-deploys. Verify at `https://waaei.vercel.app/مقالات` — hub page loads, header shows المقالات link.
