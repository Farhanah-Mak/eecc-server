// app/api/listFiles/route.js
import fs from "fs";
import path from "path"
import { NextResponse } from "next/server";
import { getServerSession , authOptions} from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
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
    return NextResponse.json(visibleFiles);
    console.log("Visible files the user can access:", visibleFiles);
  } catch (error) {
    console.error("Error processing accessible folders:", error);
  }
}


