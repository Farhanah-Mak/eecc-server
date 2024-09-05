
"use client";


import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import "./FetchFile.css"


export default function FetchFile() {
  const { data: session } = useSession(); // Use session hook from NextAuth.js
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch("/api/ListFiles");
      const fileList = await response.json();  
      // console.log(fileList);
      if (Array.isArray(fileList)) {
        setFiles(fileList);
      } else {
        console.error("File list is not an array:", fileList);
      }
    };

    fetchFiles();
    console.log(session);
  }, []);

  const handleFetchFile = async () => {
    if (!selectedFile) return; 
      window.location.href = `/api/getFile?file=${encodeURIComponent(
        selectedFile
      )}`;
    
  };

  return (
    <div className="filefetcher_container">
      <h1 className="filefetcher_title">File Fetcher</h1>
      <p className="filefetcher_text">You are logged in as { session?.user?.name }</p>
      <select
        value={selectedFile}
        onChange={(e) => setSelectedFile(e.target.value)}
        className="dropdown"
      >
        <option value="" className="dropdown_box">Select a file</option>
        {files.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}``
      </select>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            className="download_btn"
            onClick={handleFetchFile}
            // disabled={session.user.role !== "admin"} // Disable button if not admin
          >
            Download File
          </button>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="signout_btn"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}




//`window.location.href`: This property sets or returns the complete URL of the current page. When you assign a new URL to it, the browser navigates to that new URL.
//`/api/getFile`: This is your API endpoint that handles file retrieval.
//`file=${encodeURIComponent(selectedFile)}`: This part appends a query parameter named `file` to the URL. The `encodeURIComponent` function is used to encode the `selectedFile` variable, ensuring that any special characters in the filename (such as spaces or special symbols) are properly encoded for inclusion in a URL.


