import {
    searchGoogleDriveFolder,
    createGoogleDriveFolder,
    connectUploadSession,
    uploadFileToGoogleDrive,
    uploadFileToGoogleDriveAsChunk,
    changeGoogleDriveFilePermission,
    getWebContentLinkFromGoogleDriveFile
} from '../utils/googleDriveProcessing';
import { writeErrorLog } from '../api/error';

export class Book {
    static get toolbox() {
        return {
            title: 'pdf 업로드',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book-fill" viewBox="0 0 16 16"><path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/></svg>'
        };
    }

    constructor({ data, api }) {
        if (data === false) {
            this.deleteThisBlock();
        }
        this.data = {
            src: data.src || "",
            centered: data.centered !== undefined ? data.centered : true,
            stretched: data.stretched !== undefined ? data.stretched : true,
        };
        this.wrapper = undefined;
        this.state = undefined;
        this.loading = false;
        this.api = api;
        this.settings = [];
        this.pdfjsLib = window.pdfjsLib;
    }

    deleteThisBlock() {
        const currentBlockIdx = this.api.blocks.getCurrentBlockIndex();
        this.api.blocks.delete(currentBlockIdx);
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.style.cssText = "display:flex;";
        this.wrapper.style.cssText += "padding:0;";
        this.wrapper.classList.add("cdx-block");
        this.wrapper.classList.add("ce-paragraph");
        this.wrapper.classList.add("cdx-image-wrapper");
        this.iframe = document.createElement("iframe");
        this.iframe.height = "800";
        this.iframe.style.cssText = "width:100%; max-width:100%; border:0;";
        // this.wrapper.addEventListener('keydown', (event) => {
        //     event.preventDefault();
        //     if (event.keyCode == 8) {
        //         event.preventDefault();
        //         this.deleteThisBlock();
        //     }
        //     if (event.keyCode == 46) {
        //         event.preventDefault();
        //         this.deleteThisBlock();
        //     }
        // });

        const uploadInputId = "upload_btn_" + this.api.blocks.getCurrentBlockIndex();

        const uploadBtn = document.createElement("label");
        uploadBtn.classList.add("img-upload-btn");
        uploadBtn.contentEditable = false;
        uploadBtn.setAttribute("for", uploadInputId);
        uploadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
        <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/></svg>&nbsp;&nbsp;pdf 업로드`;

        const uploadInput = document.createElement('input');
        uploadInput.accept = "application/pdf";
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

        const beforeRequest = (file) => {
            this.loading = true;
            this.wrapper.querySelector('.img-upload-btn').for = "";
            this.wrapper.querySelector('.img-upload-btn').style.pointerEvents = "none";
            uploadInput.readOnly = true;
            uploadBtn.innerHTML = "업로드중...";
        }

        uploadInput.addEventListener('input', async (event) => {
            const file = event.currentTarget.files;
            if (!file[0]) return;
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
                let flag = true;
                let res;
                let offset = 0;
                while (flag) {
                    try {
                        res = await uploadFileToGoogleDriveAsChunk(uploadSession.headers.location, data, dataLength, offset);
                        flag = false;
                    } catch (e) {
                        res = e.response;
                        offset = res.headers.range.split("-")[1] * 1;
                        if (e.response.status !== 308) {
                            writeErrorLog({ content: e.response });
                            window.alert('문제가 발생했습니다!');
                        }
                    }
                }
                const permission = await changeGoogleDriveFilePermission(res.data.id, {
                    role: "reader",
                    type: "anyone",
                });
                await this.processingPdfReader(res.data.id);
                this.wrapper.appendChild(cancelBtn);
                this.loading = false;
            };
            reader.readAsArrayBuffer(file[0]);
        });
        this.wrapper.appendChild(uploadInput);
        this.wrapper.appendChild(uploadBtn);
        if (this.data.src) {
            this._acceptTuneView();
            this.iframe.src = this.data.src;
            this.wrapper.replaceChildren(this.iframe);
            this.wrapper.appendChild(cancelBtn);
            return this.wrapper;
        }
        this._acceptTuneView();
        return this.wrapper;
    }

    save(blockContent) {
        const iframe = blockContent.querySelector('iframe');
        if(this.loading){
            window.alert("업로드중인 pdf가 있습니다. 업로드가 완료 될 때까지 기다려주세요.");
            return 'uploading';
        }
        if (iframe) {
            return {
                src: iframe?.src,
            };
        } else {
            return false;
        }
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

    async processingPdfReader(id) {
        const iframe = this.iframe;
        iframe.src = `https://drive.google.com/file/d/${id}/preview`;
        this.wrapper.replaceChildren(iframe);
    }
}