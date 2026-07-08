import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";

export const metadata: Metadata = {
  title: "Movies",
  description: "Jelajahi koleksi movie terbaru kami",
  openGraph: {
    title: "Movies",
    description: "Jelajahi koleksi movie terbaru kami",
  },
};

export default async function MoviesListPage() {
  const movies = await prisma.movie.findMany({ orderBy: { id: "desc" } });

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Daftar Movie
        </h1>

        {movies.length === 0 && (
          <p className="text-center text-zinc-400">Belum ada movie</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.slug}`}
              className="group overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] bg-zinc-100">
                <Image
                  src={movie.gambar}
                  alt={movie.judul}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="space-y-1 p-4">
                <h2 className="font-semibold">{movie.judul}</h2>
                <p className="line-clamp-2 text-sm text-zinc-500">
                  {movie.deskripsi}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
