
import fs from "fs/promises"; // Use fs.promises for async
import path from "path";
import { NextResponse } from "next/server";
import mime from "mime"; // For MIME type detection

export async function GET(req) {
   const corsHeaders = {
     "Access-Control-Allow-Origin": "http://localhost:3000", // Replace with your actual frontend URL
     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
     "Access-Control-Allow-Headers": "Content-Type, Authorization",
     "Access-Control-Allow-Credentials": "true",
   };

  // Fetch directory path from environment variable
  const directoryPath = process.env.DIRECTORY_PATH;
  if (!directoryPath) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500, headers: corsHeaders }
    );
  }

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const plevel = searchParams.get("plevel");
  const fileName = searchParams.get("file");

  // Validate query parameters
  if (!department || !plevel || !fileName) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400, headers: corsHeaders }
    );
  }

  const filePath = path.join(directoryPath, department, plevel, fileName);

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Read the file asynchronously
    const fileBuffer = await fs.readFile(filePath);

    // Detect the MIME type based on file extension
    const mimeType = mime.getType(filePath) || "application/octet-stream";

    // Return the file in the response with proper headers
    const response = new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename=${fileName}`,
        "Content-Type": mimeType,
        "Content-length": fileBuffer.length, //set the content length for better perfomance
        ...corsHeaders,
      },
    });

    if (req.method === "OPTIONS") {
      return NextResponse.json({}, { status: 200, headers: corsHeaders });
    }


   // console.log("response", response);
    return response;
  } catch (error) {
    console.error("Error downloading file:", error);

    // File not found or access error
    if (error.code === "ENOENT") {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // General error
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500, headers: corsHeaders }
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
