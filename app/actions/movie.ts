"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY!
);

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function saveFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from("uploads").upload(filename, file);
  if (error || !data) throw new Error(`Upload gagal: ${error?.message ?? "Unknown error"}`);
  const { data: url } = supabase.storage.from("uploads").getPublicUrl(data.path);
  return url.publicUrl;
}

export type MovieState = { error?: string };

export async function createMovie(_prevState: MovieState, formData: FormData) {
  const judul = formData.get("judul") as string;
  const file = formData.get("gambar") as File;
  const deskripsi = formData.get("deskripsi") as string;

  if (!judul || !file || !file.size) {
    return { error: "Judul dan gambar harus diisi" };
  }

  const slug = slugify(judul);

  const existing = await prisma.movie.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Movie dengan judul tersebut sudah ada" };
  }

  let gambar: string;
  try {
    gambar = await saveFile(file);
  } catch (e) {
    return { error: (e as Error).message };
  }

  await prisma.movie.create({ data: { judul, slug, gambar, deskripsi } });

  revalidatePath("/admin/movies");
  redirect("/admin/movies");
}

export async function updateMovie(
  _prevState: MovieState,
  formData: FormData
) {
  const id = parseInt(formData.get("id") as string);
  const judul = formData.get("judul") as string;
  const file = formData.get("gambar") as File;
  const deskripsi = formData.get("deskripsi") as string;

  if (!judul) {
    return { error: "Judul harus diisi" };
  }

  const slug = slugify(judul);

  const existing = await prisma.movie.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return { error: "Movie dengan judul tersebut sudah ada" };
  }

  let gambar: string | undefined;
  if (file && file.size) {
    try {
      gambar = await saveFile(file);
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  await prisma.movie.update({
    where: { id },
    data: { judul, slug, deskripsi, ...(gambar && { gambar }) },
  });

  revalidatePath("/admin/movies");
  redirect("/admin/movies");
}

export async function deleteMovie(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  await prisma.movie.delete({ where: { id } });

  revalidatePath("/admin/movies");
}
