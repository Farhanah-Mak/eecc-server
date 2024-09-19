"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "./FetchFile.css"
import Download from "@/components/Download";
import SignOut from "@/components/SignOut";

export default function FetchFile() {
  const { data: session, status } = useSession(); // Use session hook from NextAuth.js
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  // console.log("This is the status", status);
  const department = session?.user?.department;
  console.log(department);


  useEffect(() => {
    // Only fetch data when the session is authenticated and session data is available
    if (status === "authenticated") {
      const fetchFiles = async () => {
        try {
          const response = await fetch("/api/ListFiles", {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const fileList = await response.json();
           console.log("response",fileList);
          if (Array.isArray(fileList)) {
            setFiles(fileList);
            
          } else {
            console.error("File list is not an array:", fileList);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchFiles();
    }
  }, [session]);

  return (
    <div className="filefetcher_container">
      <h1 className="filefetcher_title">File Fetcher</h1>
      {status === "authenticated" ? (
        <>
          <p className="filefetcher_text">
            You are logged in as {session?.user?.name}
          </p>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="dropdown"
          >
            <option value="" className="dropdown_box">
              Select a file
            </option>
            {files.map((file) => (
              <option key={file.index} value={file} id="filename">
                {file.split("/")[1]}
              </option>
            ))}
            ``
          </select>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Download selectedFile={selectedFile} department={department} />
           < SignOut />
          </div>
        </>) : (<p>Loading....</p>)
      }
    </div>
  );
}




//`window.location.href`: This property sets or returns the complete URL of the current page. When you assign a new URL to it, the browser navigates to that new URL.
//`/api/getFile`: This is your API endpoint that handles file retrieval.
//`file=${encodeURIComponent(selectedFile)}`: This part appends a query parameter named `file` to the URL. The `encodeURIComponent` function is used to encode the `selectedFile` variable, ensuring that any special characters in the filename (such as spaces or special symbols) are properly encoded for inclusion in a URL.


/*  const url =`/api/getFile?department=${encodeURIComponent(
      department
    )}&plevel=${encodeURIComponent(plevel)}&file=${encodeURIComponent(
      fileName
       )}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();  */



  

  
  