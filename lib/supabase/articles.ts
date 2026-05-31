import { unstable_cache, updateTag } from "next/cache";
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
  published_at: string | null;
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
    published_at:        row.published_at as string | null,
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
  { revalidate: 3600, tags: ["published-articles"] }
);

export const getArticleBySlug = unstable_cache(
  _getArticleBySlug,
  ["article-by-slug"],
  { revalidate: 3600, tags: ["article-by-slug"] }
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
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`Supabase update failed: ${error.message}`);
  updateTag("published-articles");
  updateTag("article-by-slug");
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  updateTag("published-articles");
  updateTag("article-by-slug");
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
