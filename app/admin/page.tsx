import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film } from "lucide-react";
import { prisma } from "@/app/lib/prisma";

export default async function AdminPage() {
  const movieCount = await prisma.movie.count();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movie</CardTitle>
            <Film className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{movieCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
