import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { Plus, Pencil, Search } from "lucide-react";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const movies = await prisma.movie.findMany({
    where: q
      ? { judul: { contains: q } }
      : undefined,
    orderBy: { id: "desc" },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Movie</h1>
        <Button nativeButton={false} render={<Link href="/admin/movies/create" />}>
          <Plus />
          Tambah Movie
        </Button>
      </div>

      <form>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            name="q"
            type="text"
            placeholder="Cari movie..."
            defaultValue={q}
            className="pl-9"
          />
        </div>
      </form>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Gambar</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id} className="group cursor-pointer">
                <TableCell>
                  <a href={`/movies/${movie.slug}`} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={movie.gambar}
                      alt={movie.judul}
                      width={48}
                      height={48}
                      className="size-12 rounded object-cover"
                    />
                  </a>
                </TableCell>
                <TableCell>
                  <a
                    href={`/movies/${movie.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-red-600"
                  >
                    {movie.judul}
                  </a>
                </TableCell>
                <TableCell>
                  <a
                    href={`/movies/${movie.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-zinc-500 hover:text-red-600"
                  >
                    {movie.slug}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/admin/movies/${movie.id}/edit`} />}
                    >
                      <Pencil />
                    </Button>
                    <DeleteMovieButton id={movie.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {movies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-zinc-400"
                >
                  Belum ada movie
                </TableCell>
              </TableRow>
            )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
