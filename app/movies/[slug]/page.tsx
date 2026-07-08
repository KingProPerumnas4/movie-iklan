import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { RedirectIklan } from "./redirect-iklan";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const movie = await prisma.movie.findUnique({ where: { slug } });
  if (!movie) return { title: "Movie Tidak Ditemukan" };
  return {
    title: movie.judul,
    description: movie.deskripsi?.slice(0, 160) ?? undefined,
    openGraph: {
      title: movie.judul,
      description: movie.deskripsi?.slice(0, 160) ?? undefined,
      images: [{ url: movie.gambar, width: 1200, height: 630, alt: movie.judul }],
    },
    twitter: {
      card: "summary_large_image",
      title: movie.judul,
      description: movie.deskripsi?.slice(0, 160) ?? undefined,
      images: [movie.gambar],
    },
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await prisma.movie.findUnique({ where: { slug } });
  const [iklan] = await prisma.$queryRawUnsafe<Array<{ link: string }>>(
    'SELECT link FROM "Iklan" ORDER BY RANDOM() LIMIT 1'
  );

  if (!movie) notFound();

  return (
    <div className="min-h-dvh bg-white">
      {iklan && <RedirectIklan link={iklan.link} />}

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/movies"
          className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="relative aspect-[2/1] bg-zinc-100">
            <Image
              src={movie.gambar}
              alt={movie.judul}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {movie.judul}
            </h1>
            <p className="leading-relaxed text-zinc-600">
              {movie.deskripsi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
