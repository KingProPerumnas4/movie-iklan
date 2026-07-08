"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";

export type LoginState = { error: string };

export async function login(_prevState: LoginState, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) {
    return { error: "Username atau password salah" };
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return { error: "Username atau password salah" };
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
