"use client";

import { deleteMovie } from "@/app/actions/movie";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteMovieButton({ id }: { id: number }) {
  return (
    <form action={deleteMovie}>
      <input type="hidden" name="id" value={id} />
      <Button
        variant="destructive"
        size="sm"
        type="submit"
        onClick={(e) => {
          if (!confirm("Hapus movie ini?")) e.preventDefault();
        }}
      >
        <Trash2 />
      </Button>
    </form>
  );
}
