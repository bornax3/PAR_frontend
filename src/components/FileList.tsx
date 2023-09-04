import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/FileList.css";
import { FaDownload, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

interface FileListProps {
  userId: number | null;
  userToken: string | null;
  fileUploaded: boolean;
}

interface File {
  naziv: string;
  datumKreiranja: string;
  odobreno: boolean;
  id: number;
}

const FileList: React.FC<FileListProps> = ({
  userId,
  userToken,
  fileUploaded,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/${userId}/datoteke`;

  // Function to handle file download
  const handleFileDownload = (fileName: string, userToken: string | null) => {
    // Construct the Azure Blob Storage URL with the dynamic file name
    const azureBlobUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager/DownloadFile?fileName=${fileName}`;

    // Make a GET request to the Azure Blob Storage URL
    axios
      .get(azureBlobUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
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

  // Function to handle file deletion
  const handleItemDelete = (fileName: string, userToken: string | null) => {
    // Show a confirmation dialog before deleting the file
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this file?`
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager/DeleteFile?fileName=${fileName}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then(() => {
          // Remove the deleted file from the list
          setFiles((prevFiles) =>
            prevFiles.filter((file) => file.naziv !== fileName)
          );

          console.log("File deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
        });
    }
  };

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
        //console.log("Files:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, [fileUploaded]);

  return (
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
              onClick={() => handleFileDownload(file.naziv, userToken)}
            >
              <FaDownload />
            </button>
            <button
              className="file-delete"
              title="Delete"
              onClick={() => handleItemDelete(file.naziv, userToken)}
            >
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FileList;
