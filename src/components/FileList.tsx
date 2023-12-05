import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/FileList.css";
import { FaDownload, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import useFileHandler from "../hooks/useFileHandler";
import { message } from "antd";

interface FileListProps {
  userId: number | null;
  userToken: string | null;
  fileUploaded: boolean;
}

interface File {
  naziv: string;
  datumKreiranja: string;
  odobreno: boolean;
  brojBodova: number;
  opisAktivnosti: string;
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
  const [searchQuery, setSearchQuery] = useState("");

  // Function to format the date
  const formatCreationDate = (creationDate: string) => {
    const date = new Date(creationDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
    return `${day < 10 ? "0" : ""}${day}.${
      month < 10 ? "0" : ""
    }${month}.${year}`;
  };

  // Function to handle file deletion
  const handleItemDelete = (fileId: number, userToken: string | null) => {
    // Show a confirmation dialog before deleting the file
    const confirmDelete = window.confirm(
      `Jeste li sigurni da želite obrisati datoteku?`
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
          // Removes the deleted file from the list
          setFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== fileId)
          );

          console.log("File deleted successfully");
          message.success("Datoteka uspješno obrisana");
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            message.error(error.response?.data || "Došlo je do pogreške");
          }
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
        console.log("Files:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, [userToken, fileUploaded]);

  const filteredFiles = files.filter((file) => {
    // Convert both the search query and file name to lowercase for case-insensitive search
    const searchQueryLower = searchQuery.toLowerCase();
    const fileNameLower = file.naziv.toLowerCase();

    // Check if the file name contains the search query
    return fileNameLower.includes(searchQueryLower);
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const sortedFilteredFiles = filteredFiles.slice().sort((a, b) => {
    const dateA = new Date(a.datumKreiranja);
    const dateB = new Date(b.datumKreiranja);

    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="fileContent">
      <input
        className="fileListSearch"
        type="text"
        placeholder="Pretraži datoteke"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <ul className="fileList">
        {sortedFilteredFiles.length > 0 ? (
          sortedFilteredFiles.map((file, index) => (
            <li className="fileItem" key={index}>
              <div className="fileItemDetails">
                <div className="fileItemName">{file.naziv}</div>
                <div className="fileItemDescription">
                  <br />
                  <span className="fileItemSection">
                    Kriterij: {file.opisAktivnosti}
                    <br />
                    <br />
                    Bodovi: {file.brojBodova}
                    <br />
                    Stvoreno: {formatCreationDate(file.datumKreiranja)}
                  </span>
                </div>
              </div>
              <div className="status">
                <span
                  className={file.odobreno ? "approved" : "notApproved"}
                  title={file.odobreno ? "Odobreno" : "Na čekanju"}
                >
                  {file.odobreno ? "Odobreno" : "Na čekanju"}
                </span>
              </div>
              <div className="fileItemControl">
                <button
                  className="fileButton"
                  title="Preuzmi"
                  onClick={() =>
                    handleFileDownload(file.id, userToken, file.naziv)
                  }
                >
                  <FaDownload />
                </button>
                <button
                  className="fileButton"
                  title="Obriši"
                  onClick={() => handleItemDelete(file.id, userToken)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="noResults">Nema rezultata</div>
        )}
      </ul>
    </div>
  );
};

export default FileList;
