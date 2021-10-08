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
            title: '이미지',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        };
    }

    constructor({ data, api }) {
        this.data = {
            src: data.src || "",
            centered: data.centered !== undefined ? data.centered : true,
            stretched: data.stretched !== undefined ? data.stretched : true,
        };
        this.wrapper = undefined;
        this.state = undefined;
        this.loading = false;
        this.api = api;
        this.settings = [
            {
                name: 'centered',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-align-center" viewBox="0 0 16 16">
                <path d="M8 1a.5.5 0 0 1 .5.5V6h-1V1.5A.5.5 0 0 1 8 1zm0 14a.5.5 0 0 1-.5-.5V10h1v4.5a.5.5 0 0 1-.5.5zM2 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z"/></svg>`
            },
            {
                name: 'stretched',
                icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
            },
        ];
    }

    deleteThisBlock() {
        const currentBlockIdx = this.api.blocks.getCurrentBlockIndex();
        this.api.blocks.delete(currentBlockIdx);
    }

    render() {
        this.wrapper = document.createElement('div');
        const uploadInputId = "upload_btn_" + this.api.blocks.getCurrentBlockIndex();

        const uploadBtn = document.createElement("label");
        uploadBtn.classList.add("img-upload-btn");
        uploadBtn.contentEditable = false;
        uploadBtn.setAttribute("for", uploadInputId);
        uploadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
        <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/></svg>&nbsp;&nbsp;이미지 업로드`;

        const uploadInput = document.createElement('input');
        uploadInput.accept = "image/png, image/jpeg, image/jpg, image/gif";
        uploadInput.value = "파일 업로드 to Google Drive";
        uploadInput.type = "file";
        uploadInput.contentEditable = false;
        uploadInput.style.display = "none";
        uploadInput.id = uploadInputId;

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-btn");
        cancelBtn.contentEditable = false;
        cancelBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>`;
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteThisBlock();
        });

        this.wrapper.style.cssText = "display:flex;";
        this.wrapper.style.cssText += "padding:0;";
        this.wrapper.contentEditable = true;
        this.wrapper.classList.add("cdx-block");
        this.wrapper.classList.add("ce-paragraph");
        this.wrapper.classList.add("cdx-image-wrapper");
        this.wrapper.addEventListener('keydown', (event) => {
            event.preventDefault();
            if (event.keyCode == 8) {
                event.preventDefault();
                this.deleteThisBlock();
            }
            if (event.keyCode == 46) {
                event.preventDefault();
                this.deleteThisBlock();
            }
        });

        const beforeRequest = (file) => {
            const img = document.createElement("img");
            const src = URL.createObjectURL(file);
            img.style.cssText = `
                max-width:100%;
                opacity:0.5;
            `;
            img.src = src;
            img.classList.add("placeholder");
            this.wrapper.replaceChildren(img);
            this.loading = true;
        }

        uploadInput.addEventListener('input', async (event) => {
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
                img.style.cssText = `max-width:100%; opacity:0; position:absolute; left:0; top:0;`;
                img.src = src;
                this.wrapper.appendChild(img);
                img.onload = (event) => {
                    const parentElement = event.target.parentElement;
                    const placeholder = parentElement.querySelector('.placeholder');
                    img.style.cssText = `max-width:100%; opacity:1; position:relative;`;
                    placeholder.remove();
                }
                this.loading = false;
            };
            reader.readAsArrayBuffer(file[0]);
        });
        this.wrapper.appendChild(uploadInput);
        this.wrapper.appendChild(uploadBtn);
        this.wrapper.appendChild(cancelBtn);
        this._acceptTuneView();
        return this.wrapper;
    }

    save(blockContent) {
        if (this.loading) {
            window.alert("이미지가 로딩중입니다.");
            return;
        }
        const image = blockContent.querySelector('img');
        return Object.assign(this.data, {
            src: image.src,
        });
    }

    renderSettings() {
        const wrapper = document.createElement('div');
        this.settings.forEach(tune => {
            let button = document.createElement('div');
            button.classList.add('cdx-settings-button');
            button.classList.toggle('cdx-settings-button--active', this.data[tune.name]);
            button.innerHTML = tune.icon;
            wrapper.appendChild(button);
            button.addEventListener('click', () => {
                this._toggleTune(tune.name);
                button.classList.toggle('cdx-settings-button--active', this.data[tune.name]);
            });
        });

        return wrapper;
    }

    _toggleTune(tune) {
        this.data[tune] = !this.data[tune];
        this._acceptTuneView();
    }

    _acceptTuneView() {
        this.settings.forEach(tune => {
            this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
        });
    }
}