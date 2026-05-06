import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const teams = await prisma.team.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || body.name.trim().length < 2) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  const team = await prisma.team.create({ data: { name: body.name.trim() } });
  return NextResponse.json(team, { status: 201 });
}
