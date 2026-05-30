"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { approveArticle as dbApprove, deleteArticle as dbDelete } from "@/lib/supabase/articles";

export async function submitReviewPassword(formData: FormData) {
  const reviewPassword = process.env.REVIEW_PASSWORD;
  if (!reviewPassword) {
    redirect("/review?error=1");
  }
  const password = formData.get("password") as string;
  if (password === reviewPassword) {
    const cookieStore = await cookies();
    cookieStore.set("review_auth", "1", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/review");
  }
  redirect("/review?error=1");
}

export async function approveArticleAction(id: string) {
  const cookieStore = await cookies();
  if (cookieStore.get("review_auth")?.value !== "1") redirect("/review");
  await dbApprove(id);
  redirect("/review");
}

export async function deleteArticleAction(id: string) {
  const cookieStore = await cookies();
  if (cookieStore.get("review_auth")?.value !== "1") redirect("/review");
  await dbDelete(id);
  redirect("/review");
}
