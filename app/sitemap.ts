import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://waaei.me";

  const testSlugs = [
    "اختبار-الاكتئاب",
    "اختبار-القلق",
    "اختبار-الإرهاق-الوظيفي",
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

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/عن-الموقع`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...testSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
