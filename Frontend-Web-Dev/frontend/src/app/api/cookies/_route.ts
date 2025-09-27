import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface TokenResponse {
  token: string | undefined;
}

export async function GET(): Promise<NextResponse<TokenResponse>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("_minwandev");

  return NextResponse.json({ token: token?.value || undefined });
}
