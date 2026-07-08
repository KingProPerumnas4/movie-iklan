import Link from "next/link";
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
import { DeleteIklanButton } from "@/components/DeleteIklanButton";
import { Plus, Pencil, Search } from "lucide-react";

export default async function IklanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const iklans = await prisma.iklan.findMany({
    where: q
      ? { judul: { contains: q } }
      : undefined,
    orderBy: { id: "desc" },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Iklan</h1>
        <Button nativeButton={false} render={<Link href="/admin/iklan/create" />}>
          <Plus />
          Tambah Iklan
        </Button>
      </div>

      <form>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            name="q"
            type="text"
            placeholder="Cari iklan..."
            defaultValue={q}
            className="pl-9"
          />
        </div>
      </form>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {iklans.map((iklan) => (
              <TableRow key={iklan.id}>
                <TableCell className="font-medium">{iklan.judul}</TableCell>
                <TableCell className="max-w-[300px] truncate text-zinc-500">
                  {iklan.link}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/admin/iklan/${iklan.id}/edit`} />}
                    >
                      <Pencil />
                    </Button>
                    <DeleteIklanButton id={iklan.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {iklans.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-zinc-400"
                >
                  Belum ada iklan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
