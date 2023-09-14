import React, { useEffect, useState } from "react";
import { User } from "../components/UserList";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import "../css/UserFileModal.css";
import useFileHandler from "../hooks/useFileHandler";

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
  isApproved: boolean;
}

// Define a type for the checkbox states
type CheckboxStates = { [key: number]: boolean };
// Define a type for the filter status
type FilterStatus = "all" | "approved";

const UserFileModal: React.FC<UserFileModalProps> = ({
  isOpen,
  onClose,
  userToken,
  user,
}) => {
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const handleFileDownload = useFileHandler();
  const [isApproved, setIsApproved] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Fetch user files
  useEffect(() => {
    const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/${user?.id}/datoteke`;
    //fetch all files
    //const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove/datoteke`;
    axios
      .get(myApiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const filesWithInitialApprovalState = response.data.map(
          (file: UserFile) => ({
            ...file,
            isApproved: file.odobreno,
          })
        );
        setUserFiles(filesWithInitialApprovalState);

        // Initialize checkbox states based on 'odobreno'
        const initialCheckboxStates = filesWithInitialApprovalState.reduce(
          (checkboxStates: CheckboxStates, file: UserFile) => ({
            ...checkboxStates,
            [file.id]: file.odobreno,
          }),
          {}
        );
        setCheckboxStates(initialCheckboxStates);
      })
      .catch((error) => {
        console.error("Error fetching user files: ", error);
      });
  }, [user?.id, userToken]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    userFileId: number
  ) => {
    const isChecked = e.target.checked;
    console.log("isApproved state: ", isChecked);
    console.log("userFileId: ", userFileId);
    console.log("userToken: ", userToken);

    // Update the checkbox state for the specific file
    setCheckboxStates((prevState) => ({
      ...prevState,
      [userFileId]: isChecked,
    }));

    axios
      .put(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/datoteka/odobri?idDatoteke=${userFileId}&odobreno=${isChecked}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Success! Response data: ", response.data);
        setIsApproved(isChecked);
      })
      .catch((error) => {
        console.error("Error approving user file: ", error);
      });
  };

  // Handle filter status change
  const handleFilterChange = (newFilterStatus: FilterStatus) => {
    setFilterStatus(newFilterStatus);
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
          {/* Filter options */}
          <div className="filter-options">
            <label>
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filterStatus === "all"}
                onChange={() => handleFilterChange("all")}
              />{" "}
              Show All
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="approved"
                checked={filterStatus === "approved"}
                onChange={() => handleFilterChange("approved")}
              />{" "}
              Show Approved Only
            </label>
          </div>
          <ul className="file-list">
            {userFiles
              .filter((userFile) => {
                if (filterStatus === "all") {
                  return true; // Show all files
                } else if (filterStatus === "approved") {
                  return userFile.isApproved; // Show only approved files
                }
                return false;
              })
              .map((userFile, index) => (
                <li key={index} className="file-item">
                  <div className="file-details">
                    <div className="file-name">{userFile.naziv}</div>
                    <div>
                      <span className="file-date">
                        {userFile.datumKreiranja}
                      </span>
                    </div>
                  </div>
                  <div className="file-button">
                    <input
                      type="checkbox"
                      className="item-check"
                      onChange={(e) => handleCheckboxChange(e, userFile.id)}
                      checked={checkboxStates[userFile.id] || false}
                    />
                    <button
                      className="file-download"
                      title="Download"
                      onClick={() =>
                        handleFileDownload(
                          userFile.id,
                          userToken,
                          userFile.naziv
                        )
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
