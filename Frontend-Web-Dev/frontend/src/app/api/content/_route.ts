// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// const readData = (filePath: string) => {
//   if (!fs.existsSync(filePath)) {
//     console.log("/api/content - readData error: File not found!!!");
//     return null;
//   }
//   const jsonData = fs.readFileSync(filePath, "utf8");
//   try {
//     return JSON.parse(jsonData);
//   } catch (error) {
//     console.log("/api/content - readData error: Invalid JSON format!!!", error);
//     return null;
//   }
// };

// async function writeData(filePath: string, data: any) {
//   try {
//     await fs.promises
//       .writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
//       .catch((error) => {
//         console.log("/api/content - writeData error: ", error);
//       });

//     return true;
//   } catch (error) {
//     console.log("/api/content - writeData error: ", error);
//     return false;
//   }
// }

// // ${process.env.CLIENT_URL}/api/content (GET)
// export async function GET(req: NextRequest) {
//   try {
//     const filePath = path.join(process.cwd(), "public", "content.json");
//     const data = readData(filePath);
//     if (!data) {
//       return NextResponse.json(
//         { message: "Data Not Found", status: "GET_CONTENT_ERROR" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.log("/api/content - GET error: ", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", status: "GET_CONTENT_ERROR" },
//       { status: 500 }
//     );
//   }
// }

// // ${process.env.CLIENT_URL}/api/content?secret=${process.env.SECRET_KEY} (POST)
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json(); // Thử parse body
//     const secret = req.nextUrl.searchParams.get("secret");
//     if (secret !== process.env.SECRET_KEY) {
//       return NextResponse.json(
//         { message: "Invalid Secret Key", status: "UPDATE_CONTENT_ERROR" },
//         { status: 401 }
//       );
//     }
//     if (!body) {
//       return NextResponse.json(
//         { message: "Body Not Found", status: "UPDATE_CONTENT_ERROR" },
//         { status: 400 }
//       );
//     }
//     const filePath = path.join(process.cwd(), "public", "content.json");
//     const success = await writeData(filePath, body);
//     if (!success) {
//       return NextResponse.json(
//         { message: "Update content error", status: "UPDATE_CONTENT_ERROR" },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json({ message: "Update Success", data: body });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal Server Error", status: "UPDATE_CONTENT_ERROR" },
//       { status: 500 }
//     );
//   }
// }
