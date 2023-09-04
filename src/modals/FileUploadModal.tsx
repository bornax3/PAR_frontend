import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";
import "../css/FileUploadModal.css";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToken: string | null;
  onUploadSuccess: () => void;
}

interface Activity {
  id: number;
  opis: string;
  value: number;
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

  const handleActivityChange = (selectedOption: Activity | null) => {
    setSelectedActivity(selectedOption);
    console.log(`Option selected:`, selectedOption);
    console.log(`Option opis:`, selectedOption?.opis);
  };

  // Fetch activities for the dropdown
  useEffect(() => {
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/aktivnosti"
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
    const apiUrl =
      "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager";

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      if (file && selectedActivity) {
        formData.append(`fileName`, file);
        formData.append("aktivnostId", selectedActivity.value.toString());
        console.log("File:", file);
      } else {
        console.error("Error: file or activity is undefined");
      }
    });

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Files uploaded successfully");

        onUploadSuccess();
        setSelectedFiles([]);
      } else {
        console.error("File upload failed. Server returned:", response.status);
      }
    } catch (error) {
      console.error("An error occurred during file upload:", error);
    }
  };

  return (
    <div
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
        <h2>Upload File</h2>
        <div
          className={`drop-area ${isDragActive ? "active" : ""}`}
          onClick={handleBrowseClick}
        >
          <p>
            Drag and drop files here <br /> or <br /> click to browse
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        {selectedFiles.length > 0 && (
          <div className="dropdown">
            <Select
              options={activities.map((activity) => ({
                value: activity.id,
                label: activity.opis,
              }))}
              value={
                selectedActivity
                  ? {
                      value: selectedActivity.id,
                      label: selectedActivity.opis,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                handleActivityChange(selectedOption as Activity | null)
              }
              isSearchable
              placeholder="Please select activity"
            />
          </div>
        )}
        <div className="file-preview">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-preview-item">
              <span>{file.name}</span>
              <button
                className="remove-button"
                onClick={() => handleFileRemove(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <button
          className="submit-button"
          type="button"
          onClick={handleFileSubmit}
          disabled={selectedActivity === null || selectedFiles.length === 0}
        >
          Submit
        </button>
        <button className="submit-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FileUploadModal;
