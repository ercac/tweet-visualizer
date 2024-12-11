import React, { useState } from "react";

function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onFileUpload(json);
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

export default FileUpload;
