// app/api/listFiles/route.js
import fs from "fs";
import { NextResponse } from "next/server";


export async function GET() {  
 const directoryPath = process.env.DIRECTORY_PATH;
  try {
    const files = await fs.promises.readdir(directoryPath);
    const visibleFiles = files.filter((file) => !file.startsWith(".")); // Exclude hidden files
    console.log(visibleFiles);
    return NextResponse.json(visibleFiles); // Return all files for both Admin and User
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to scan files" },
      { status: 500 }
    );
  }
}



