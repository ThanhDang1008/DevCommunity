import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenStatus } from "@/app/test/toeic/VerifyToken";
import type { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";

  //console.log("req.headers:", req.headers);

  const result = await verifyToken<JwtPayload>(token.trim());

  return NextResponse.json(result, {
    status: result.status === TokenStatus.TOKEN_VALID ? 200 : 401,
  });
}
