"use server";

import { prisma } from "@/lib/prisma";
import { generateMatchCode } from "@/lib/matchCode";
import { generateCupBracket } from "@/lib/bracket";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  tournamentId: z.string().min(1),
  teamIds: z.array(z.string()).min(2),
});

export async function ensureTbdTeam(): Promise<string> {
  let tbd = await prisma.team.findFirst({ where: { name: "TBD" } });
  if (!tbd) {
    tbd = await prisma.team.create({ data: { name: "TBD" } });
  }
  return tbd.id;
}

export async function generateMatches(formData: FormData) {
  const tournamentId = formData.get("tournamentId") as string;
  const teamIds = formData.getAll("teamIds") as string[];

  const parsed = schema.safeParse({ tournamentId, teamIds });
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) return { error: "Tournament not found" };

    // Delete existing matches for this tournament
    await prisma.match.deleteMany({ where: { tournamentId } });

    if (tournament.type === "LEAGUE") {
      let scheduleTeams = [...teamIds];
      
      // If odd, add TBD team for BYE
      if (scheduleTeams.length % 2 !== 0) {
        const tbdId = await ensureTbdTeam();
        scheduleTeams.push(tbdId);
      }

      const numTeams = scheduleTeams.length;
      const numRounds = numTeams - 1;
      const halfSize = numTeams / 2;

      for (let round = 0; round < numRounds; round++) {
        for (let i = 0; i < halfSize; i++) {
          const teamAId = scheduleTeams[i];
          const teamBId = scheduleTeams[numTeams - 1 - i];

          // If either is TBD, it's a BYE match. We still record it so they know it's a rest day, 
          // or we can just skip generating the match. It's better to skip it so it doesn't clutter.
          // But wait, if we skip it, players don't know they have a BYE. We can record it as TBD.
          const code = await generateMatchCode();
          await prisma.match.create({
            data: {
              tournamentId,
              teamAId,
              teamBId,
              matchCode: code,
              round: round + 1,
              isSubmitted: teamAId === await ensureTbdTeam() || teamBId === await ensureTbdTeam(),
              scoreA: teamAId === await ensureTbdTeam() ? 0 : teamBId === await ensureTbdTeam() ? 1 : null,
              scoreB: teamBId === await ensureTbdTeam() ? 0 : teamAId === await ensureTbdTeam() ? 1 : null,
            },
          });
        }
        
        // Rotate array: keep first element fixed, rotate the rest
        const first = scheduleTeams[0];
        const last = scheduleTeams.pop()!;
        scheduleTeams = [first, last, ...scheduleTeams.slice(1)];
      }

      // Initialize standings for all real teams
      for (const teamId of teamIds) {
        await prisma.standing.upsert({
          where: { teamId_tournamentId: { teamId, tournamentId } },
          create: { teamId, tournamentId },
          update: {},
        });
      }
    } else if (tournament.type === "CUP") {
      await generateCupBracket(tournamentId, teamIds);
    }

    revalidatePath("/admin/matches");
    revalidatePath("/admin/standings");
    revalidatePath("/admin/bracket");
    revalidatePath("/matches");
    revalidatePath("/standings");
    revalidatePath("/bracket");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate matches" };
  }
}
