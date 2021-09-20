import axios from "axios";
export const searchGoogleDriveFolder = (query) => new Promise((resolve) => {
    const res = axios.get(`https://www.googleapis.com/drive/v3/files?q=name%3D%27${query}%27%20and%20mimeType%3D%27application%2Fvnd.google-apps.folder%27`,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("google_access_token"),
                "Content-Type": "application/json",
            }
        });
    resolve(res);
})
export const createGoogleDriveFolder = (name) => new Promise((resolve) => {
    const res = axios.post("https://www.googleapis.com/drive/v3/files", JSON.stringify({
        name: name,
        mimeType: "application/vnd.google-apps.folder",
    }), {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("google_access_token"),
            "Content-Type": "application/json",
        }
    });
    resolve(res);
});

export const connectUploadSession = (data) => new Promise((resolve) => {
    const res = axios.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", JSON.stringify(data), {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("google_access_token"),
            "Content-Type": "application/json",
        }
    });
    resolve(res);
});

export const uploadFileToGoogleDrive = (sessionUrl, data, dataLength) => new Promise((resolve) => {
    const res = axios({
        method: "PUT",
        url: sessionUrl,
        data: data,
        headers: {
            'Content-Range': "bytes 0-" + (dataLength - 1) + "/" + dataLength,
        }
    });
    resolve(res);
});

export const changeGoogleDriveFilePermission = (fileId, roleAndType) => new Promise((resolve) => {
    const res = axios.post(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, roleAndType, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("google_access_token"),
            "Content-Type": "application/json",
        }
    });
    resolve(res);
});

export const getWebContentLinkFromGoogleDriveFile = (fileId) => new Promise((resolve) => {
    const res = axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=webContentLink`, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("google_access_token"),
            "Content-Type": "application/json",
        }
    });
    resolve(res);
});