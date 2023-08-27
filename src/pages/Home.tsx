import { useState, useContext, useEffect } from "react";
import "../css/Home.css";
import { Link, useLocation } from "react-router-dom";
import FileUploadModal from "../modals/FileUploadModal";
import FileList from "../components/FileList";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const location = useLocation();
  const { userToken, userId } = useAuth();

  const toggleFileUploadModal = () => {
    setIsFileUploadModalOpen(!isFileUploadModalOpen);
  };

  // State to track whether a file was uploaded
  const [fileUploaded, setFileUploaded] = useState(false);

  // Function to handle file upload success
  const handleFileUploadSuccess = () => {
    console.log("File upload success");
    setFileUploaded(true);
  };

  // Effect to reset the file upload flag when it's triggered
  useEffect(() => {
    //console.log("fileUploaded value:", fileUploaded); // Log the value
    if (fileUploaded) {
      // setFileUploaded(false); // Comment out this line
    }
  }, [fileUploaded]);

  return (
    <div>
      <FileList
        userId={userId}
        userToken={userToken}
        fileUploaded={fileUploaded}
      />
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={() => setIsFileUploadModalOpen(false)}
        userToken={userToken}
        onUploadSuccess={handleFileUploadSuccess} // Pass the success callback
      />

      <button
        type="button"
        className="toggle-button"
        onClick={toggleFileUploadModal}
      >
        Upload File
      </button>
    </div>
  );
};

export default Home;

// need to resolve rendering files issue when uploading and need to finnish download and delete files
// also need to specifically add the funcionality of approving files to the admin user.
// push on git

// new comment to test github
