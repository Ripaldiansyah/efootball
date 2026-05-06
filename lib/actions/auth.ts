"use server";

import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const res = await login(username, password);
  if (res.error) {
    return { error: res.error };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
