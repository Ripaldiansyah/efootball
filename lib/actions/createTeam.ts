"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
});

export async function createTeam(formData: FormData) {
  const raw = { name: formData.get("name") as string };
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const team = await prisma.team.create({ data: { name: parsed.data.name } });
    revalidatePath("/admin/teams");
    return { success: true, team };
  } catch {
    return { error: "Failed to create team" };
  }
}

export async function deleteTeam(id: string) {
  try {
    await prisma.team.delete({ where: { id } });
    revalidatePath("/admin/teams");
    return { success: true };
  } catch {
    return { error: "Failed to delete team" };
  }
}
