const CLIENT_ID = localStorage.getItem("google_client_id");
const API_KEY = localStorage.getItem("google_api_key");
const SCOPES = "https://www.googleapis.com/auth/drive.file";

console.log("CLIENT_ID => ", CLIENT_ID);
console.log("API_KEY => ", API_KEY);

function handleClientLoad() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
  });
  google.accounts.id.prompt();
}

function handleCredentialResponse(response) {
  const id_token = response.credential;

  gapi.load("client:auth2", initClient);
}

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      ],
      scope: SCOPES,
    })
    .then(() => {
      startBackup();
    })
    .catch((error) => {
      console.error("Error during client initialization", error);
    });
}

function exportToJsonFile(jsonData) {
  const dataStr = JSON.stringify(jsonData);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  return dataBlob;
}

function uploadFileToDrive(blob, fileName) {
  const metadata = {
    name: fileName,
    mimeType: "application/json",
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", blob);

  gapi.client
    .request({
      path: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      method: "POST",
      body: form,
    })
    .then(
      (response) => {
        console.log("File uploaded to Google Drive:", response);
      },
      (error) => {
        console.error("Error uploading file:", error);
      }
    );
}

function startBackup() {
  const jsonData = { test: "testing the backup." }; // Your JSON data
  const blob = exportToJsonFile(jsonData);
  const fileName = "backup.json";

  if (gapi.client && gapi.client.drive) {
    uploadFileToDrive(blob, fileName);
  } else {
    console.error("Google API client is not initialized");
  }
}

document
  .getElementById("backup-btn")
  .addEventListener("click", handleClientLoad);
