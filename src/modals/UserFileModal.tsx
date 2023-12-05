import React, { useEffect, useState, useRef } from "react";
import { User } from "../components/UserList";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import "../css/Modal.css";
import "../css/List.css";
import useFileHandler from "../hooks/useFileHandler";
import { message } from "antd";

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
  brojBodova: number;
}

// Define a type for the checkbox states
type CheckboxStates = { [key: number]: boolean };
// Define a type for the filter status
type FilterStatus = "all" | "approved" | "not-approved";

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
  const modalRef = useRef<HTMLDivElement>(null);

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
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      });
  }, [user?.id, userToken]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    userFileId: number
  ) => {
    const isChecked = e.target.checked;

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
        message.success("Uspješno je promijenjen status datoteke", 1);
        setIsApproved(isChecked);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      });
  };

  // Handle filter status change
  const handleFilterChange = (newFilterStatus: FilterStatus) => {
    setFilterStatus(newFilterStatus);
  };

  const handleCloseModal = () => {
    onClose();
  };

  // Add an event listener to handle clicks outside the modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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

  return (
    <div className="modalBackground">
      <div className="modal" ref={modalRef}>
        <div className="modalHeader">
          <h2 className="modalTitle">Datoteke</h2>
          <button className="closeButton" onClick={handleCloseModal}>
            x
          </button>
        </div>
        <div className="modalBody">
          <div className="listContent">
            <div className="listFilter">
              <div className="filterSection">
                <>
                  <button
                    className={`filterButton ${
                      filterStatus === "all" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("all")}
                  >
                    Sve
                  </button>
                  <button
                    className={`filterButton ${
                      filterStatus === "approved" && "active"
                    }`}
                    onClick={() => handleFilterChange("approved")}
                  >
                    Odobrene
                  </button>
                  <button
                    className={`filterButton ${
                      filterStatus === "not-approved" && "active"
                    }`}
                    onClick={() => handleFilterChange("not-approved")}
                  >
                    Na čekanju
                  </button>
                </>
              </div>
            </div>

            <ul className="itemList">
              {userFiles
                .filter((userFile) => {
                  if (filterStatus === "all") {
                    return true; // Show all files
                  } else if (filterStatus === "approved") {
                    return userFile.isApproved; // Show only approved files
                  } else if (filterStatus === "not-approved") {
                    return !userFile.isApproved; // Show only not approved files
                  }
                  return false;
                })
                .map((userFile, index) => (
                  <li key={index} className="listItem">
                    <div className="listItemDetails">
                      <div className="listItemName">{userFile.naziv}</div>
                      <div className="listItemDescription">
                        <span className="listItemSectionLong">
                          Stvoreno:{" "}
                          {formatCreationDate(userFile.datumKreiranja)}
                          <br />
                          Bodovi: {userFile.brojBodova}
                        </span>
                        <br />
                      </div>
                    </div>
                    <div className="itemControlModified">
                      <label
                        key={userFile.id}
                        className={`itemLabel ${
                          checkboxStates[userFile.id] ? "active" : "inactive"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="itemControl"
                          onChange={(e) => handleCheckboxChange(e, userFile.id)}
                          checked={checkboxStates[userFile.id] || false}
                        />
                        {checkboxStates[userFile.id]
                          ? "Odobreno"
                          : "Na čekanju"}
                      </label>
                      <button
                        className="itemButton"
                        title="Preuzmi"
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
        </div>
      </div>
    </div>
    /*<div
      className={`modal-container ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className={`user-file-modal ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          /*<div className="filter-options">
            <label>
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filterStatus === "all"}
                onChange={() => handleFilterChange("all")}
              />{" "}
              Sve
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="approved"
                checked={filterStatus === "approved"}
                onChange={() => handleFilterChange("approved")}
              />{" "}
              Odobreni
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
          Zatvori
        </button>
      </div>
    </div>*/
  );
};

export default UserFileModal;
