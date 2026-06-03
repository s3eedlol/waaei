import { cookies } from "next/headers";
import Link from "next/link";
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
          <Link href="/review/logout" prefetch={false} style={{ fontSize: 13, color: "var(--waaei-mute)", textDecoration: "none", border: "1px solid var(--waaei-rule)", borderRadius: 7, padding: "6px 14px" }}>
            تسجيل الخروج
          </Link>
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
