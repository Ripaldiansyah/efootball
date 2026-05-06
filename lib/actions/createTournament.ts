"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Tournament name must be at least 2 characters"),
  type: z.enum(["LEAGUE", "CUP"]),
});

export async function createTournament(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
  };
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const tournament = await prisma.tournament.create({
      data: { name: parsed.data.name, type: parsed.data.type },
    });
    revalidatePath("/admin/tournaments");
    return { success: true, tournament };
  } catch {
    return { error: "Failed to create tournament" };
  }
}

export async function deleteTournament(id: string) {
  try {
    await prisma.tournament.delete({ where: { id } });
    revalidatePath("/admin/tournaments");
    return { success: true };
  } catch {
    return { error: "Failed to delete tournament" };
  }
}
