import { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/supabase/articles";

// Update these dates when content meaningfully changes.
// Never use new Date() here — that tells GSC every page changed on every build.
const HOMEPAGE_UPDATED = new Date("2026-05-22");
const TESTS_UPDATED    = new Date("2026-05-22");
const ABOUT_UPDATED    = new Date("2026-04-01");
const PRIVACY_UPDATED  = new Date("2026-05-22");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        lastModified: new Date(a.published_at ?? new Date()),
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
