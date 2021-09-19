import axios from 'axios';

export class SimpleImage {
    static get toolbox() {
        return {
            title: 'Image',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        };
    }

    constructor({ data }) {
        this.data = data;
        this.wrapper = undefined;
        this.state = undefined;
    }

    render() {
        const thisClass = this;
        this.wrapper = document.createElement('div');
        const uploadBtn = document.createElement('input');
        uploadBtn.value = "파일 업로드 to Google Drive";
        uploadBtn.type = "file";

        const beforeRequest = (file) => {
            const img = document.createElement("img");
            const src = URL.createObjectURL(file);
            img.style.cssText = `
                max-width:100%;
                opacity:0.5;
            `;
            img.src = src;
            this.wrapper.replaceChildren(img);
        }

        uploadBtn.oninput = async (event) => {
            const file = event.currentTarget.files;
            beforeRequest(file[0]);
            console.log("khvd grad 30폴더가 있는지 확인합니다.");
            const checkFolder = await axios.get("https://www.googleapis.com/drive/v3/files?q=name%3D%27khvd_grad_30%27%20and%20mimeType%3D%27application%2Fvnd.google-apps.folder%27",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("google_access_token"),
                        "Content-Type": "application/json",
                    }
                });
            let folder_id = null;
            if (checkFolder.data.files.length === 0) {
                //폴더가 없으면 폴더를 만듭니다.
                console.log("폴더가 없습니다. 폴더를 만듭니다.", checkFolder.data.files);
                const createFolder = await axios.post("https://www.googleapis.com/drive/v3/files", JSON.stringify({
                    name: "khvd_grad_30",
                    mimeType: "application/vnd.google-apps.folder",
                }), {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("google_access_token"),
                        "Content-Type": "application/json",
                    }
                });
                console.log(createFolder.data.id);
                folder_id = createFolder.data.id;
            } else {
                folder_id = checkFolder.data.files[0].id;
            }
            const uploadSession = await axios.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", JSON.stringify({
                name: file[0].name,
                mimeType: file[0].type,
                parents: [folder_id],
            }), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("google_access_token"),
                    "Content-Type": "application/json",
                }
            })
            const reader = new FileReader();
            console.log(uploadSession);
            reader.onload = function (evt) {
                console.log(evt);
                const dataLength = evt.total;
                const data = evt.target.result;
                axios({
                    method: "PUT",
                    url: uploadSession.headers.location,
                    data: data,
                    headers: {
                        'Content-Range': "bytes 0-" + (dataLength - 1) + "/" + dataLength,
                    }
                }).then(async ({ data }) => {
                    const permission = await axios.post(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
                        role: "reader",
                        type: "anyone",
                    }, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("google_access_token"),
                            "Content-Type": "application/json",
                        }
                    });
                    const getLink = await axios.get(`https://www.googleapis.com/drive/v3/files/${data.id}?fields=webContentLink`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("google_access_token"),
                            "Content-Type": "application/json",
                        }
                    });
                    const src = getLink.data.webContentLink.replace(/\&?export\=.*/, "");
                    console.log(src);
                    const img = document.createElement("img");
                    img.style.cssText = `max-width:100%;`;
                    img.src = src;
                    thisClass.wrapper.replaceChildren(img);
                });
            };
            reader.readAsArrayBuffer(file[0]);
        };
        this.wrapper.appendChild(uploadBtn);
        return this.wrapper;
    }

    save(blockContent) {
        return {
            url: blockContent.value
        }
    }
}