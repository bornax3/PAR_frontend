import { useState, useContext, useEffect } from "react";
import "../css/Home.css";
import FileUploadModal from "../modals/FileUploadModal";
import FileList from "../components/FileList";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
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
    if (fileUploaded) {
      setFileUploaded(false);
    }
  }, [fileUploaded]);

  return (
    <main className="main">
      <FileList
        userId={userId}
        userToken={userToken}
        fileUploaded={fileUploaded}
      />
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={() => setIsFileUploadModalOpen(false)}
        userToken={userToken}
        onUploadSuccess={handleFileUploadSuccess}
      />

      <button
        type="button"
        className="toggle-button"
        onClick={toggleFileUploadModal}
      >
        Upload File
      </button>
    </main>
  );
};

export default Home;
