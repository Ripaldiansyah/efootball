export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubmitForm from "./SubmitForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const match = await prisma.match.findUnique({
    where: { matchCode: code },
    include: { teamA: true, teamB: true },
  });
  if (!match) return { title: "Match Not Found" };
  return {
    title: `${match.teamA.name} vs ${match.teamB.name} | ${code}`,
    description: `Submit the score for match ${code}`,
  };
}

export default async function MatchPage({ params }: Props) {
  const { code } = await params;

  const match = await prisma.match.findUnique({
    where: { matchCode: code },
    include: { teamA: true, teamB: true, tournament: true },
  });

  if (!match) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return <SubmitForm match={match} appUrl={appUrl} />;
}
