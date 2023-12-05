import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../css/Modal.css";
import { message } from "antd";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToken: string | null;
  onUploadSuccess: () => void;
}

interface Activity {
  id: number;
  opis: string;
  //value: number;
  datumKreiranja: String;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  userToken,
  onUploadSuccess,
}) => {
  // Upload Box
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Dropdown
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    onClose();
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fetch activities for the dropdown
  useEffect(() => {
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/aktivnosti",
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((response) => {
        setActivities(response.data);
        console.log("Activities:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  // Send files to backend
  const handleFileSubmit = async () => {
    console.log("Selected files:", selectedFiles);
    console.log("Selected activity:", selectedActivityId);

    if (selectedFiles.length === 0 || selectedActivityId === "") {
      message.error("Molimo odaberite datoteku i kategoriju");
      return;
    }
    const apiUrl =
      "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager";

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
      formData.append("aktivnostId", selectedActivityId);
    });

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        message.success("Datoteka je uspješno učitana");
        console.log("Files uploaded successfully");

        onUploadSuccess();
        setSelectedFiles([]);
        onClose();
      } else {
        console.error("File upload failed. Server returned:", response.status);
        message.error("Greška pri učitavanju datoteke");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Došlo je do pogreške");
      }
    }
  };

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

  const [selectedActivityId, setSelectedActivityId] = useState("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedActivityId(selectedId);
  };

  return (
    <div className="modalBackground">
      <div
        className="modal"
        ref={modalRef}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="modalBodyShort" onClick={(e) => e.stopPropagation()}>
          <div
            className={`modalDropArea ${isDragActive ? "active" : ""}`}
            onClick={handleBrowseClick}
          >
            <p>
              Povuci i ispusti datoteke ovdje <br /> ili <br /> Klikni za
              pretraživanje
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <div className="filePreviewContainer">
            {selectedFiles.map((file, index) => (
              <div key={index} className="filePreviewItem">
                <span>{file.name}</span>
                <button
                  className="itemButton"
                  onClick={() => handleFileRemove(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="dropdown">
            <select
              className="inputField"
              defaultValue=""
              title="Odaberite kategoriju datoteke"
              required
              onChange={handleSelectChange}
            >
              <option value="" disabled>
                Odaberite kategoriju
              </option>
              {activities.map((activity: any) => (
                <option key={activity.id} value={activity.id}>
                  {activity.opis}
                </option>
              ))}
            </select>
          </div>

          <div className="modalFooterBottom">
            <button className="cancelButton" type="button" onClick={onClose}>
              Odustani
            </button>
            <button
              className="actionButton"
              type="button"
              onClick={handleFileSubmit}
            >
              Spremi
            </button>
          </div>
        </div>
      </div>
    </div>
    /*<div
      className={`file-upload-modal ${isOpen ? "open" : ""}`}
      onClick={onClose}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className={`modal-content ${isDragActive ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`drop-area ${isDragActive ? "active" : ""}`}
          onClick={handleBrowseClick}
        >
          <p>
            Povuci i ispusti datoteke ovdje <br /> ili <br /> Klikni za
            pretraživanje
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        {selectedFiles.length > 0 && (
          // <div className="dropdown">
          //   <Select
          //     options={activities.map((activity) => ({
          //       value: activity.id,
          //       label: activity.opis,
          //     }))}
          //     value={
          //       selectedActivity
          //         ? {
          //             value: selectedActivity.id,
          //             label: selectedActivity.opis,
          //           }
          //         : null
          //     }
          //     onChange={(selectedOption) =>
          //       handleActivityChange(selectedOption as Activity | null)
          //     }
          //     isSearchable
          //     placeholder="Please select activity"
          //   />
          // </div>
          <div className="inputContainer">
            <select
              className="inputField"
              //value={napredovanje}
              //onChange={(e) => setNapredovanje(e.target.value)}
              title="Odaberite kategoriju datoteke"
              required
              /*onInvalid={(e) => {
                e.currentTarget.setCustomValidity("Molimo odaberite zvanje.");
              }}
              onInput={(e) => {
                e.currentTarget.setCustomValidity("");
              }}*/
    /*>
              <option value="" disabled>
                Kategorija
              </option>
              {activities.map((activity: any) => (
                <option key={activity.id} value={activity.id}>
                  {activity.opis}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="file-preview">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-preview-item">
              <span>{file.name}</span>
              <button
                className="itemButton"
                onClick={() => handleFileRemove(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="modalFooter">
          <button className="cancelButton" type="button" onClick={onClose}>
            Odustani
          </button>
          <button
            className="actionButton"
            type="button"
            onClick={handleFileSubmit}
            disabled={selectedActivity === null || selectedFiles.length === 0}
          >
            Spremi
          </button>
        </div>
      </div>
    </div>*/
  );
};

export default FileUploadModal;
