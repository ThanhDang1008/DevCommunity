import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// ${process.env.CLIENT_URL}/api/revalidate?secret=${process.env.SECRET_KEY}&tag=${tag}
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const tag = req.nextUrl.searchParams.get("tag");
  if (secret !== process.env.SECRET_KEY) {
    return NextResponse.json(
      { message: "Invalid Secret Key", status: "REVALIDATE_ERROR" },
      { status: 401 }
    );
  }

  if (!tag) {
    return NextResponse.json(
      { message: "Tag NotFound", status: "REVALIDATE_ERROR" },
      { status: 400 }
    );
  }

  revalidateTag(tag);

  return NextResponse.json(
    {
      message: "Revalidate Success",
    },
    { status: 200 }
  );
}
