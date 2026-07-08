import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { EditMovieForm } from "./edit-movie-form";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(id) },
  });

  if (!movie) {
    notFound();
  }

  return <EditMovieForm movie={movie} />;
}
