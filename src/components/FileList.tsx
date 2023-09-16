import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/FileList.css";
import { FaDownload, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import useFileHandler from "../hooks/useFileHandler";

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
  const handleFileDownload = useFileHandler();

  // Function to handle file deletion
  const handleItemDelete = (fileId: number, userToken: string | null) => {
    // Show a confirmation dialog before deleting the file
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this file?`
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager/DeleteFile/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then(() => {
          // Remove the deleted file from the list
          setFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== fileId)
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
  }, [userToken, fileUploaded]);

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
              onClick={() => handleFileDownload(file.id, userToken, file.naziv)}
            >
              <FaDownload />
            </button>
            <button
              className="file-delete"
              title="Delete"
              onClick={() => handleItemDelete(file.id, userToken)}
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
