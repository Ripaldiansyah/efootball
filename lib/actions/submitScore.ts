"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { updateLeagueStandings } from "@/lib/standings";
import { advanceCupWinner } from "@/lib/bracket";
import { z } from "zod";

const schema = z.object({
  matchCode: z.string().min(1),
  scoreA: z.coerce.number().int().min(0),
  scoreB: z.coerce.number().int().min(0),
});

export async function submitScore(formData: FormData) {
  const raw = {
    matchCode: formData.get("matchCode") as string,
    scoreA: formData.get("scoreA"),
    scoreB: formData.get("scoreB"),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { matchCode, scoreA, scoreB } = parsed.data;

  const match = await prisma.match.findUnique({
    where: { matchCode },
    include: { tournament: true },
  });

  if (!match) return { error: "Match not found" };
  if (match.isSubmitted) return { error: "Score already submitted for this match" };

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.match.update({
        where: { id: match.id },
        data: { scoreA, scoreB, isSubmitted: true },
      });
    });

    // Post-submission triggers
    if (match.tournament.type === "LEAGUE") {
      await updateLeagueStandings(match.id);
    } else if (match.tournament.type === "CUP") {
      await advanceCupWinner(match.id);
    }

    return { success: true, match: { ...match, scoreA, scoreB } };
  } catch (e) {
    console.error(e);
    return { error: "Failed to submit score" };
  }
}
