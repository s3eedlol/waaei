import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-foreground">سياسة الخصوصية</h1>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">لا نجمع أي بيانات شخصية</h2>
          <p className="text-muted-foreground leading-relaxed">
            واعي لا يطلب أي معلومات شخصية — لا اسم، لا بريد إلكتروني، ولا تسجيل.
            يمكنك استخدام جميع الاختبارات بشكل مجهول تام.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">نتائج الاختبارات تبقى في متصفحك</h2>
          <p className="text-muted-foreground leading-relaxed">
            جميع إجاباتك ونتائجك تُعالَج محلياً في متصفحك فقط ولا تُرسل إلى خوادمنا أبداً.
            عند إغلاق الصفحة تُحذف تلقائياً — لا توجد قاعدة بيانات تحتفظ بأي شيء.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">التحليلات</h2>
          <p className="text-muted-foreground leading-relaxed">
            نستخدم Vercel Analytics لقياس عدد الزيارات بشكل مجمّع وإجمالي فقط — دون تتبع أفراد،
            ودون ملفات تعريف الارتباط (Cookies)، ودون ربط أي بيانات بهويتك.
            لا نستخدم أي شبكات إعلانية أو أدوات تتبع من أطراف ثالثة.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">ملفات تعريف الارتباط</h2>
          <p className="text-muted-foreground leading-relaxed">
            لا يضع الموقع أي ملفات تعريف ارتباط (Cookies) على جهازك لأغراض التتبع أو التسويق.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">الجهة المشغّلة</h2>
          <p className="text-muted-foreground leading-relaxed">
            واعي تابع لشركة{" "}
            <a
              href="https://emdash.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-500 hover:underline"
            >
              Emdash
            </a>
            ، شركة محتوى رقمي مرخّصة في أبوظبي، الإمارات العربية المتحدة.
            لأي استفسار يتعلق بالخصوصية، تواصل معنا على{" "}
            <a
              href="mailto:contact@emdash.ae"
              className="text-sage-500 hover:underline"
            >
              contact@emdash.ae
            </a>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          آخر تحديث: مايو ٢٠٢٦
        </p>
      </main>

      <Footer />
    </div>
  );
}
