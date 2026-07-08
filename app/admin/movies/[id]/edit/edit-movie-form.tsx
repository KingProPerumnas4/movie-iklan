"use client";

import { useActionState, useRef } from "react";
import Image from "next/image";
import { updateMovie } from "@/app/actions/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";

type Movie = {
  id: number;
  judul: string;
  slug: string;
  gambar: string;
  deskripsi: string;
};

export function EditMovieForm({ movie }: { movie: Movie }) {
  const [state, action, pending] = useActionState(updateMovie, { error: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Movie</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <input type="hidden" name="id" value={movie.id} />
            <div className="space-y-2">
              <Label htmlFor="judul">Judul</Label>
              <Input
                id="judul"
                name="judul"
                type="text"
                required
                defaultValue={movie.judul}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gambar">Gambar (biarkan kosong jika tidak diganti)</Label>
              {movie.gambar && (
                <Image
                  src={movie.gambar}
                  alt={movie.judul}
                  width={200}
                  height={120}
                  className="rounded object-cover"
                />
              )}
              <div
                className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="size-4" />
                <span>Klik untuk upload gambar</span>
              </div>
              <input
                ref={fileRef}
                id="gambar"
                name="gambar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const label = e.currentTarget
                    .closest(".space-y-2")
                    ?.querySelector("span:last-child");
                  if (label && e.target.files?.[0]) {
                    label.textContent = e.target.files[0].name;
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                defaultValue={movie.deskripsi}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="outline" nativeButton={false} render={<a href="/admin/movies" />}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
