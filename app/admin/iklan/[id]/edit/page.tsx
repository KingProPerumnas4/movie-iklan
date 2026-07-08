import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { EditIklanForm } from "./edit-iklan-form";

export default async function EditIklanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const iklan = await prisma.iklan.findUnique({
    where: { id: parseInt(id) },
  });

  if (!iklan) {
    notFound();
  }

  return <EditIklanForm iklan={iklan} />;
}
