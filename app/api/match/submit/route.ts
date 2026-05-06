import { NextRequest, NextResponse } from "next/server";
import { submitScore } from "@/lib/actions/submitScore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const formData = new FormData();
  formData.append("matchCode", body.matchCode ?? "");
  formData.append("scoreA", String(body.scoreA ?? ""));
  formData.append("scoreB", String(body.scoreB ?? ""));

  const result = await submitScore(formData);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
