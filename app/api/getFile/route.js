
// app/api/getFile/route.js
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req) {
  const directoryPath = process.env.DIRECTORY_PATH;
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");
  console.log(fileName);
  if (!fileName) {
    return NextResponse.json({ error: "No file specified" }, { status: 400 });
  }

  const filePath = path.join(directoryPath, fileName);

  
  try {
    // Read file synchronously
    const fileBuffer = fs.readFileSync(filePath);
    const response = new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename=${fileName}`,
        "Content-Type": "application/octet-stream",
      },
    });

    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}

