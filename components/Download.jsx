"use client"

export default function Download({ selectedFile, department }) {
  const handleFetchFile = async () => {
    if (!selectedFile) return;
    const plevel = selectedFile.split("/")[0];
    const fileName = selectedFile.split("/")[1];
    console.log("This is Prevelege", plevel);
    console.log("This is fileName", fileName);
    // window.location.href = `/api/getFile?department=${encodeURIComponent(
    //   department
    // )}&plevel=${encodeURIComponent(plevel)}&file=${encodeURIComponent(
    //   fileName
    // )}`;
    const url = `/api/getFile?department=${encodeURIComponent(
      department
    )}&plevel=${encodeURIComponent(plevel)}&file=${encodeURIComponent(
      fileName
    )}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    link.remove();
  };

  return (
    <button
      className="download_btn"
      onClick={handleFetchFile}
      selectedFile={selectedFile}
      department={department}
    >
      Download File
    </button>
  );
}
