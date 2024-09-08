
// app/api/getFile/route.js
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  // const session = await getServerSession({ authOptions, req });
  const directoryPath = process.env.DIRECTORY_PATH;
  if (!directoryPath) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department"); // Get the department
  const plevel = searchParams.get("plevel"); // Get the plevel
  const fileName = searchParams.get("file"); // Get the file name

  if (!department || !plevel || !fileName) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  console.log(fileName);
  if (!fileName) {
    return NextResponse.json({ error: "No file specified" }, { status: 400 });
  }

   const filePath = path.join(directoryPath, department, plevel, fileName);

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


/*

  // Ensure safe directory and file names to prevent directory traversal attacks
  const safeDepartment = path.basename(department);
  const safePlevel = path.basename(plevel);
  const safeFileName = path.basename(fileName);

  // Construct the full path to the file
  const filePath = path.join(
    directoryPath,
    safeDepartment,
    safePlevel,
    safeFileName
  );

*/