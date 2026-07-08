"use client";

import { deleteIklan } from "@/app/actions/iklan";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteIklanButton({ id }: { id: number }) {
  return (
    <form action={deleteIklan}>
      <input type="hidden" name="id" value={id} />
      <Button
        variant="destructive"
        size="sm"
        type="submit"
        onClick={(e) => {
          if (!confirm("Hapus iklan ini?")) e.preventDefault();
        }}
      >
        <Trash2 />
      </Button>
    </form>
  );
}
