const footerTests = [
  {
    category: "الاكتئاب والمزاج",
    tests: [
      { name: "اختبار الاكتئاب", slug: "اختبار-الاكتئاب" },
      { name: "اختبار ثنائي القطب", slug: "اختبار-ثنائي-القطب" },
      { name: "اختبار الاكتئاب والقلق والتوتر", slug: "اختبار-الاكتئاب-والقلق-والتوتر" },
      { name: "اختبار تقدير الذات", slug: "اختبار-تقدير-الذات" },
      { name: "اختبار الذكاء العاطفي", slug: "اختبار-الذكاء-العاطفي" },
      { name: "اختبار الغضب", slug: "اختبار-الغضب" },
      { name: "اختبار اضطراب الأكل", slug: "اختبار-اضطراب-الأكل" },
      { name: "اختبار النمو بعد الصدمة", slug: "اختبار-النمو-بعد-الصدمة" },
      { name: "اختبار جودة النوم", slug: "اختبار-جودة-النوم" },
      { name: "اختبار أنماط الاستهلاك", slug: "اختبار-أنماط-الاستهلاك" },
    ],
  },
  {
    category: "القلق والخوف",
    tests: [
      { name: "اختبار القلق", slug: "اختبار-القلق" },
      { name: "اختبار الرهاب الاجتماعي", slug: "اختبار-الرهاب-الاجتماعي" },
      { name: "اختبار الصدمة النفسية", slug: "اختبار-الصدمة-النفسية" },
      { name: "اختبار الوسواس القهري", slug: "اختبار-الوسواس-القهري" },
    ],
  },
  {
    category: "التوتر والإرهاق",
    tests: [
      { name: "اختبار التوتر", slug: "اختبار-التوتر" },
      { name: "اختبار الإرهاق الوظيفي", slug: "اختبار-الإرهاق-الوظيفي" },
      { name: "اختبار الأرق", slug: "اختبار-الأرق" },
      { name: "اختبار ADHD للبالغين", slug: "اختبار-ADHD-للبالغين" },
      { name: "اختبار إدمان الهاتف", slug: "اختبار-إدمان-الهاتف" },
    ],
  },
  {
    category: "الشخصية والعلاقات",
    tests: [
      { name: "اختبار الشخصية الخمسة", slug: "اختبار-الشخصية-الخمسة" },
      { name: "اختبار نمط التعلق العاطفي", slug: "اختبار-نمط-التعلق-العاطفي" },
      { name: "اختبار الوحدة النفسية", slug: "اختبار-الوحدة-النفسية" },
      { name: "اختبار الشخصية النرجسية", slug: "اختبار-الشخصية-النرجسية" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">

        {/* Test directory */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          {footerTests.map((group) => (
            <div key={group.category} className="flex flex-col gap-3">
              <p className="font-semibold text-foreground">{group.category}</p>
              <ul className="flex flex-col gap-2">
                {group.tests.map((t) => (
                  <li key={t.slug}>
                    <a
                      href={`/${t.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col gap-3 text-center">
          <p className="text-2xl font-bold text-sage-500">واعي</p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            جميع الاختبارات على هذا الموقع أدوات للتوعية الذاتية فقط ولا تعدّ تشخيصاً طبياً.
            لا تحفظ أي بيانات شخصية. إذا كنت تمر بأزمة، يرجى التواصل مع متخصص.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <a href="https://emdash.ae" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Emdash
            </a>
            {" · "}
            <a href="https://emdash.ae" target="_blank" rel="noopener noreferrer" className="hover:underline">
              emdash.ae
            </a>
            {" · "}
            <a href="/سياسة-الخصوصية" className="hover:underline">
              سياسة الخصوصية
            </a>
            {" · "}
            <a href="/عن-الموقع" className="hover:underline">
              عن الموقع
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
