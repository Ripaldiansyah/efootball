import { prisma } from "@/lib/prisma";
import { generateMatchCode } from "@/lib/matchCode";
import { ensureTbdTeam } from "./actions/generateMatches";

/**
 * Generate a power-of-2 bracket for a cup tournament.
 * Teams are seeded into the first round; bye matches are created where needed.
 */
export async function generateCupBracket(
  tournamentId: string,
  teamIds: string[]
): Promise<void> {
  const n = teamIds.length;
  // Find the smallest power of 2 >= n
  let bracketSize = 1;
  while (bracketSize < n) bracketSize *= 2;

  // Create matches from finals back to round 1 so we can link nextMatchId
  // Total rounds
  const totalRounds = Math.log2(bracketSize);

  // We'll build all rounds from the final (round = totalRounds) to first (round = 1)
  // First, create all matches as placeholders
  type MatchSlot = { id: string; teamSlot: number };
  const roundMatches: MatchSlot[][] = [];

  // Round from totalRounds (Final) down to 1
  for (let r = totalRounds; r >= 1; r--) {
    const matchCount = bracketSize / Math.pow(2, r);
    const slots: MatchSlot[] = [];
    for (let i = 0; i < matchCount; i++) {
      slots.push({ id: "", teamSlot: 0 });
    }
    roundMatches.unshift(slots); // push at beginning so index 0 = round 1
  }

  // Create matches round by round, final first so we have IDs for nextMatchId
  const createdRounds: { id: string; round: number; slot: number }[][] = [];
  const tbdId = await ensureTbdTeam();

  for (let r = totalRounds; r >= 1; r--) {
    const roundIndex = r - 1;
    const matchCount = bracketSize / Math.pow(2, r);
    const roundCreated: { id: string; round: number; slot: number }[] = [];

    for (let slot = 0; slot < matchCount; slot++) {
      let nextMatchId: string | undefined = undefined;
      let teamSlot: number | undefined = undefined;

      // Find this match's parent in the next round
      if (r < totalRounds) {
        const nextRoundIndex = r; // next round = r+1's matches = roundIndex+1
        const nextSlot = Math.floor(slot / 2);
        if (createdRounds[nextRoundIndex] && createdRounds[nextRoundIndex][nextSlot]) {
          nextMatchId = createdRounds[nextRoundIndex][nextSlot].id;
          teamSlot = slot % 2; // 0 = teamA, 1 = teamB
        }
      }

      const code = await generateMatchCode();
      const match = await prisma.match.create({
        data: {
          tournamentId,
          teamAId: tbdId, // placeholder
          teamBId: tbdId, // placeholder
          matchCode: code,
          round: r,
          nextMatchId: nextMatchId ?? null,
          teamSlot: teamSlot ?? null,
        },
      });

      roundCreated.push({ id: match.id, round: r, slot });
    }

    createdRounds[roundIndex] = roundCreated;
  }

  // Seed teams into Round 1 matches
  const round1Matches = createdRounds[0];
  for (let i = 0; i < round1Matches.length; i++) {
    const teamAIndex = i * 2;
    const teamBIndex = i * 2 + 1;

    const teamAId = teamIds[teamAIndex] ?? null;
    const teamBId = teamIds[teamBIndex] ?? null;

    if (teamAId && teamBId) {
      await prisma.match.update({
        where: { id: round1Matches[i].id },
        data: { teamAId, teamBId },
      });
    } else if (teamAId && !teamBId) {
      // Bye: auto-advance teamA against TBD dummy
      await prisma.match.update({
        where: { id: round1Matches[i].id },
        data: {
          teamAId,
          teamBId: tbdId, // TBD dummy
          scoreA: 1,
          scoreB: 0,
          isSubmitted: true,
        },
      });
      await advanceCupWinner(round1Matches[i].id);
    }
  }
}

/**
 * Advance the winner of a cup match to the next round.
 */
export async function advanceCupWinner(matchId: string): Promise<void> {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || match.scoreA === null || match.scoreB === null) return;
  if (!match.nextMatchId) return;

  const winnerId =
    match.scoreA >= match.scoreB ? match.teamAId : match.teamBId;

  const updateData =
    match.teamSlot === 0
      ? { teamAId: winnerId }
      : { teamBId: winnerId };

  await prisma.match.update({
    where: { id: match.nextMatchId },
    data: updateData,
  });
}

/**
 * Get the round name label for display
 */
export function getRoundName(round: number, totalRounds: number): string {
  const roundsFromFinal = totalRounds - round;
  if (roundsFromFinal === 0) return "Final";
  if (roundsFromFinal === 1) return "Semi Final";
  if (roundsFromFinal === 2) return "Quarter Final";
  const teamsInRound = Math.pow(2, round);
  return `Round of ${teamsInRound}`;
}
