// app/api/listFiles/route.js
import fs from "fs";
import path from "path"
import { NextResponse } from "next/server";
import { getServerSession , authOptions} from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(res, req) {
  // Set CORS headers
  const corsHeaders = {
"Access-Control-Allow-Origin": "http://localhost:3000/", // Replace with your actual frontend URL
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
 "Access-Control-Allow-Credentials": "true"
  }

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401, headers:corsHeaders });
  }
  console.log(session.user.name);
  const directoryPath = process.env.DIRECTORY_PATH;
  const { department, plevel } = await prisma.user.findUnique({
    where: { name: session.user.name },
    select: {
      department: true,
      plevel: true,
    },
  });

  // console.log("Department:", department);
  // console.log("Plevel:", plevel);
  const departmentFolderPath = path.join(directoryPath, department);
  // console.log(departmentFolderPath)
 
  let visibleFiles = [];

  try {
    // Read all folders in the department directory
    const foldersInDepartment = await fs.promises.readdir(departmentFolderPath, { withFileTypes: true });

    // Filter folders that are directories and match the plevel requirement
    const accessibleFolders = foldersInDepartment
      .filter(dirent => dirent.isDirectory() && !isNaN(dirent.name) && parseInt(dirent.name) >= plevel)
      .map(dirent => dirent.name);

    // Loop through each accessible folder
    for (const folder of accessibleFolders) {
      const folderPath = path.join(departmentFolderPath, folder);
    
      try {
        // Read files from the current folder 
        const filesInFolder = await fs.promises.readdir(folderPath);
      
        // Filter out files that start with a dot (hidden files)
        const visibleFilesInFolder = filesInFolder.filter(file => !file.startsWith("."));
       //console.log(visibleFilesInFolder);
        // Append only the file names to the visibleFiles array
        visibleFiles = visibleFiles.concat(visibleFilesInFolder.map(file => path.join(folder, file)));
        console.log(visibleFiles);
      } catch (err) {
        console.error(`Error reading files from folder ${folderPath}:`, err);
      }
    }
    return NextResponse.json(visibleFiles, {headers: corsHeaders});
  } catch (error) {
    console.error("Error processing accessible folders:", error);
    return NextResponse.json({error: 'Failed'}, { status: 500, headers: corsHeaders});
  }
}











    
  

 