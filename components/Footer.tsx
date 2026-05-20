export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-4 text-center">
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
        </p>
      </div>
    </footer>
  );
}
