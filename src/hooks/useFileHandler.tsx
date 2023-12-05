import axios from "axios";
import { message } from "antd";

const useFileHandler = () => {
  // === Function to handle file download ===
  const handleFileDownload = (
    idDatoteke: number,
    userToken: string | null,
    fileName: string
  ) => {
    message.info("Preuzimanje datoteke u tijeku...");

    // Construct the Azure Blob Storage URL with the dynamic file name
    const azureBlobUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/filemanager/DownloadFile/${idDatoteke}`;
    // Make a GET request to the Azure Blob Storage URL
    axios
      .get(azureBlobUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        message.success("Datoteka uspješno preuzeta");
        // Create a temporary URL for the blob data
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        console.log(response.data);
        // Create an anchor element to trigger the download
        const a = document.createElement("a");

        a.href = blobUrl;
        //a.download = idDatoteke.toString(); // Set the download attribute to specify the file name
        a.download = fileName;
        console.log(a.download);
        document.body.appendChild(a);
        a.click(); // Simulate a click event to trigger the download
        window.URL.revokeObjectURL(blobUrl); // Release the blob URL
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      });
  };

  return handleFileDownload;
};

export default useFileHandler;
