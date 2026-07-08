"use client";

import { useActionState } from "react";
import { updateIklan } from "@/app/actions/iklan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Iklan = {
  id: number;
  judul: string;
  link: string;
};

export function EditIklanForm({ iklan }: { iklan: Iklan }) {
  const [state, action, pending] = useActionState(updateIklan, { error: "" });

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Iklan</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <input type="hidden" name="id" value={iklan.id} />
            <div className="space-y-2">
              <Label htmlFor="judul">Judul</Label>
              <Input id="judul" name="judul" type="text" required defaultValue={iklan.judul} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input id="link" name="link" type="url" required defaultValue={iklan.link} />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="outline" nativeButton={false} render={<a href="/admin/iklan" />}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
