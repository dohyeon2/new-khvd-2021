import {
    searchGoogleDriveFolder,
    createGoogleDriveFolder,
    connectUploadSession,
    uploadFileToGoogleDrive,
    changeGoogleDriveFilePermission,
    getWebContentLinkFromGoogleDriveFile
} from '../utils/googleDriveProcessing';

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
        this.loading = false;
    }

    render() {
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
            this.loading = true;
        }


        uploadBtn.oninput = async (event) => {
            const file = event.currentTarget.files;
            beforeRequest(file[0]);
            const checkFolder = await searchGoogleDriveFolder("khvd_grad_30");
            let folder_id = null;
            if (checkFolder.data.files.length === 0) {
                //폴더가 없으면 폴더를 만듭니다.
                const createFolder = await createGoogleDriveFolder("khvd_grad_30");
                folder_id = createFolder.data.id;
            } else {
                folder_id = checkFolder.data.files[0].id;
            }
            const uploadSession = await connectUploadSession({
                name: file[0].name,
                mimeType: file[0].type,
                parents: [folder_id],
            });
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const dataLength = evt.total;
                const data = evt.target.result;
                const res = await uploadFileToGoogleDrive(uploadSession.headers.location, data, dataLength);
                const permission = await changeGoogleDriveFilePermission(res.data.id, {
                    role: "reader",
                    type: "anyone",
                });
                const getLink = await getWebContentLinkFromGoogleDriveFile(res.data.id);
                const src = getLink.data.webContentLink.replace(/\&?export\=.*/, "");
                const img = document.createElement("img");
                img.style.cssText = `max-width:100%;`;
                img.src = src;
                this.wrapper.replaceChildren(img);
                this.loading = false;
            };
            reader.readAsArrayBuffer(file[0]);
        };
        this.wrapper.appendChild(uploadBtn);
        return this.wrapper;
    }

    save(blockContent) {
        if (this.loading) {
            window.alert("이미지가 로딩중입니다.");
            return;
        }
        const img = blockContent.querySelector('img');
        return {
            url: img.src
        }
    }
}