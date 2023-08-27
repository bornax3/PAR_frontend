import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/FileList.css";
import { FaDownload, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

interface File {
  naziv: string;
  datumKreiranja: string;
  odobreno: boolean;
}

interface FileListProps {
  userId: number | null;
  userToken: string | null;
  fileUploaded: boolean;
}

// TASK............. Send user token in the request header!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// and make user download in the place he wants to

const handleFileDownload = (fileName: string) => {
  // Construct the Azure Blob Storage URL with the dynamic file name
  const azureBlobUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager/DownloadFile?fileName=${fileName}`;

  // Make a GET request to the Azure Blob Storage URL
  axios
    .get(azureBlobUrl, {
      responseType: "blob", // Specify the response type as 'blob' to handle binary data
    })
    .then((response) => {
      // Create a temporary URL for the blob data
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element to trigger the download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName; // Set the download attribute to specify the file name
      document.body.appendChild(a);
      a.click(); // Simulate a click event to trigger the download
      window.URL.revokeObjectURL(blobUrl); // Release the blob URL
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
};

const FileList: React.FC<FileListProps> = ({
  userId,
  userToken,
  fileUploaded,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/${userId}/datoteke`;

  useEffect(() => {
    // Make an Axios API call to fetch files from Azure Blob Storage
    axios
      .get(myApiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, [fileUploaded]);

  return (
    <div className="file-list-container">
      <ul className="file-list">
        {files.map((file, index) => (
          <li className="file-item" key={index}>
            <div className="file-details">
              <span className="file-name">{file.naziv}</span>
              <br />
              <span className="file-date">Created: {file.datumKreiranja}</span>
            </div>
            <span
              className={file.odobreno ? "approved" : "not-approved"}
              title={file.odobreno ? "Approved" : "Not Approved"}
            >
              {file.odobreno ? <FaCheck /> : <FaTimes />}
            </span>
            <div className="file-options">
              <button
                className="file-download"
                title="Download"
                onClick={() => handleFileDownload(file.naziv)}
              >
                <FaDownload />
              </button>
              <button className="file-delete" title="Delete">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
