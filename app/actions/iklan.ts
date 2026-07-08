"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";

export type IklanState = { error?: string };

export async function createIklan(_prevState: IklanState, formData: FormData) {
  const judul = formData.get("judul") as string;
  const link = formData.get("link") as string;

  if (!judul || !link) {
    return { error: "Semua field harus diisi" };
  }

  await prisma.iklan.create({ data: { judul, link } });

  revalidatePath("/admin/iklan");
  redirect("/admin/iklan");
}

export async function updateIklan(_prevState: IklanState, formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const judul = formData.get("judul") as string;
  const link = formData.get("link") as string;

  if (!judul || !link) {
    return { error: "Semua field harus diisi" };
  }

  await prisma.iklan.update({
    where: { id },
    data: { judul, link },
  });

  revalidatePath("/admin/iklan");
  redirect("/admin/iklan");
}

export async function deleteIklan(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  await prisma.iklan.delete({ where: { id } });

  revalidatePath("/admin/iklan");
}
