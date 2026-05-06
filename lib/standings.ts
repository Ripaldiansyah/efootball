import { prisma } from "@/lib/prisma";

export async function updateLeagueStandings(
  matchId: string
): Promise<void> {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || match.scoreA === null || match.scoreB === null) return;

  const { tournamentId, teamAId, teamBId, scoreA, scoreB } = match;

  const isWinA = scoreA > scoreB;
  const isWinB = scoreB > scoreA;
  const isDraw = scoreA === scoreB;

  await prisma.$transaction([
    // Upsert standing for Team A
    prisma.standing.upsert({
      where: { teamId_tournamentId: { teamId: teamAId, tournamentId } },
      create: {
        teamId: teamAId,
        tournamentId,
        played: 1,
        win: isWinA ? 1 : 0,
        draw: isDraw ? 1 : 0,
        lose: isWinB ? 1 : 0,
        goalsFor: scoreA,
        goalsAgainst: scoreB,
        points: isWinA ? 3 : isDraw ? 1 : 0,
      },
      update: {
        played: { increment: 1 },
        win: { increment: isWinA ? 1 : 0 },
        draw: { increment: isDraw ? 1 : 0 },
        lose: { increment: isWinB ? 1 : 0 },
        goalsFor: { increment: scoreA },
        goalsAgainst: { increment: scoreB },
        points: { increment: isWinA ? 3 : isDraw ? 1 : 0 },
      },
    }),
    // Upsert standing for Team B
    prisma.standing.upsert({
      where: { teamId_tournamentId: { teamId: teamBId, tournamentId } },
      create: {
        teamId: teamBId,
        tournamentId,
        played: 1,
        win: isWinB ? 1 : 0,
        draw: isDraw ? 1 : 0,
        lose: isWinA ? 1 : 0,
        goalsFor: scoreB,
        goalsAgainst: scoreA,
        points: isWinB ? 3 : isDraw ? 1 : 0,
      },
      update: {
        played: { increment: 1 },
        win: { increment: isWinB ? 1 : 0 },
        draw: { increment: isDraw ? 1 : 0 },
        lose: { increment: isWinA ? 1 : 0 },
        goalsFor: { increment: scoreB },
        goalsAgainst: { increment: scoreA },
        points: { increment: isWinB ? 3 : isDraw ? 1 : 0 },
      },
    }),
  ]);
}
