import { prisma } from "@/lib/prisma";

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return `EF-${result}`;
}

export async function generateMatchCode(): Promise<string> {
  let code: string;
  let exists = true;

  do {
    code = randomCode();
    const found = await prisma.match.findUnique({
      where: { matchCode: code },
    });
    exists = !!found;
  } while (exists);

  return code;
}
