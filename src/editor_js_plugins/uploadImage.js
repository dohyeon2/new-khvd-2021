import {
    searchGoogleDriveFolder,
    createGoogleDriveFolder,
    connectUploadSession,
    uploadFileToGoogleDrive,
    uploadFileToGoogleDriveAsChunk,
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
            href: data.href !== undefined ? data.href : false,
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
            {
                name: 'href',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
              </svg>`
            },
        ];
    }

    deleteThisBlock() {
        const currentBlockIdx = this.api.blocks.getCurrentBlockIndex();
        this.api.blocks.delete(currentBlockIdx);
    }


    getProtocolURL(URL) {
        const reg = new RegExp(/^http/);
        if (URL.match(reg) === null) {
            return "http://" + URL;
        } else {
            return URL;
        }
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.style.cssText = "display:flex;";
        this.wrapper.style.cssText += "padding:0;";
        this.wrapper.style.cssText += "position:relative;";
        this.wrapper.classList.add("cdx-block");
        this.wrapper.classList.add("ce-paragraph");
        this.wrapper.classList.add("cdx-image-wrapper");
        this.wrapper.addEventListener('keydown', (event) => {
            if (event.target.nodeName === "INPUT") {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
                return;
            }
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
        if (this.data.src) {
            this._acceptTuneView();
            const img = document.createElement("img");
            img.src = this.data.src;
            img.style.cssText = `max-width:100%; opacity:1; position:relative;`;
            this.wrapper.replaceChildren(img);
            return this.wrapper;
        }

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

        const hrefInputContainer = document.createElement('div');
        hrefInputContainer.contentEditable = false;
        hrefInputContainer.classList.add("href-input-container");
        const hrefInput = document.createElement('input');
        hrefInput.classList.add("href-input");
        hrefInput.type = "text";
        hrefInput.placeholder = "링크 입력";
        const textBtn = document.createElement("button");
        textBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
      </svg>`;
        textBtn.onclick = (e) => {
            window.open(this.getProtocolURL(hrefInput.value));
        }

        hrefInputContainer.appendChild(hrefInput);
        hrefInputContainer.appendChild(textBtn);
        this.wrapper.appendChild(hrefInputContainer);

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-btn");
        cancelBtn.contentEditable = false;
        cancelBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>`;
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteThisBlock();
        });

        const loadingConatiner = document.createElement("div");
        loadingConatiner.classList.add("loading-container");
        loadingConatiner.style.cssText = "position:absolute; top:0; left:0; bottom:0; right:0; display:flex; align-items:center; justify-content:center; background-color:rgba(0,0,0,.5); flex-direction:column;";
        const loadingSpinner = document.createElement('div');
        loadingSpinner.classList.add("loader");
        loadingSpinner.innerHTML = "Loading...";
        const loadingProgress = document.createElement('div');
        loadingProgress.classList.add("loadingProgress");
        loadingProgress.style.cssText += "color:#fff";
        loadingProgress.innerHTML = "Loading...";
        loadingConatiner.appendChild(loadingSpinner);
        loadingConatiner.appendChild(loadingProgress);

        const beforeRequest = (file) => {
            const img = document.createElement("img");
            const src = URL.createObjectURL(file);
            img.style.cssText = `
                max-width:100%;
                opacity:0.5;
            `;
            img.src = src;
            img.classList.add("placeholder");
            uploadInput.remove();
            uploadBtn.remove();
            this.wrapper.appendChild(img);
            this.wrapper.appendChild(loadingConatiner);
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
                let flag = true;
                let res;
                let offset = 0;
                while (flag) {
                    //                     access-control-allow-credentials: "true"
                    // access-control-allow-origin: "https://2021.khvd.kr:3000"
                    // access-control-expose-headers: "Access-Control-Allow-Credentials, Access-Control-Allow-Origin, Access-Control-Expose-Headers, Content-Length, Content-Type, Date, Range, Server, Transfer-Encoding, X-GUploader-UploadID, X-Google-Trace, X-Range-MD5"
                    // content-length: "0"
                    // content-type: "text/plain; charset=utf-8"
                    // date: "Wed, 20 Oct 2021 10:55:18 GMT"
                    // range: "bytes=0-262143"
                    // server: "UploadServer"
                    // x-guploader-uploadid: "ADPycdsTwpebpulKQFaNfiShuIkends5BacjpRuXV44gVyZbKE6SZlWO9S_C81ud5lvDc4aPplcSS324XW2lx6lSzII"
                    // x-range-md5: "1dc80a4ab7b63f2a0d4c785181b14d08"
                    try {
                        res = await uploadFileToGoogleDriveAsChunk(uploadSession.headers.location, data, dataLength, offset);
                        flag = false;
                    } catch (e) {
                        res = e.response;
                        offset = res.headers.range.split("-")[1] * 1;
                        loadingProgress.innerHTML = (offset * 100 / dataLength).toFixed(2) + "%";
                    }
                }
                const permission = await changeGoogleDriveFilePermission(res.data.id, {
                    role: "reader",
                    type: "anyone",
                });
                const getLink = await getWebContentLinkFromGoogleDriveFile(res.data.id);
                const src = getLink.data.webContentLink;
                const img = document.createElement("img");
                img.style.cssText = `max-width:100%; opacity:0; position:absolute; left:0; top:0;`;
                img.src = src;
                this.wrapper.appendChild(img);
                img.onload = (event) => {
                    const parentElement = event.target.parentElement;
                    const placeholder = parentElement.querySelector('.placeholder');
                    const loadingConatiner = parentElement.querySelector('.loading-container');
                    img.style.cssText = `max-width:100%; opacity:1; position:relative;`;
                    placeholder.remove();
                    loadingConatiner.remove();
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
        const hrefInput = blockContent.querySelector('.href-input');
        console.log(hrefInput);
        return Object.assign(this.data, {
            src: image.src,
            href: hrefInput.value || false
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