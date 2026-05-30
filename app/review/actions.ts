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
