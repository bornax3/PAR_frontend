import React, { useEffect, useState } from "react";
import { User } from "../components/UserList";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import "../css/UserFileModal.css";

interface UserFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToken: string | null;
  user: User | null;
}

interface UserFile {
  id: number;
  naziv: string;
  aktivnostId: number;
  odobreno: boolean;
  datumKreiranja: string;
  aktivan: boolean;
  korisnikEmail: string;
}

const UserFileModal: React.FC<UserFileModalProps> = ({
  isOpen,
  onClose,
  userToken,
  user,
}) => {
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);

  // Fetch user files
  useEffect(() => {
    // Promijeni na user?.id da bi se dohvatili samo datoteke od trenutnog korisnika
    //const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove/${user?.id}/datoteke`;
    const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove/datoteke`;
    axios
      .get(myApiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user files: ", error);
      });
  }, []);

  // Function to handle file download
  const handleFileDownload = (fileName: string, userToken: string | null) => {
    // Construct the Azure Blob Storage URL with the dynamic file name
    const azureBlobUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager/DownloadFile?fileName=${fileName}`;
    //console.log(fileName);
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

  return (
    <div
      className={`modal-container ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className={`user-file-modal ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <ul className="file-list">
            {userFiles.map((userFile, index) => (
              <li key={index} className="file-item">
                <div className="file-details">
                  <div className="file-name">{userFile.naziv}</div>
                  <div>
                    <span className="file-date">{userFile.datumKreiranja}</span>
                  </div>
                </div>
                <div className="file-button">
                  <input
                    type="checkbox"
                    className="item-check"
                    onClick={() => {
                      // TODO: Implement approving files
                    }}
                  />
                  <button
                    className="file-download"
                    title="Download"
                    onClick={() =>
                      handleFileDownload(userFile.naziv, userToken)
                    }
                  >
                    <FaDownload />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button className="submit-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserFileModal;
