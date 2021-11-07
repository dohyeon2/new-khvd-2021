class Embed {
    constructor({ data, api }) {
        if (data === false) {
            this.deleteThisBlock();
        }
        this.data = {
            src: data.src || "",
            width: data.width || 100,
        };
        this.wrapper = undefined;
        this.state = undefined;
        this.loading = false;
        this.api = api;
        this.settings = [
            {
                name: 'width',
                icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
            },
        ];
    }

    static get toolbox() {
        return {
            title: '영상',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn-fill" viewBox="0 0 16 16">
            <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
          </svg>`
        };
    }

    deleteThisBlock() {
        const currentBlockIdx = this.api.blocks.getCurrentBlockIndex();
        this.api.blocks.delete(currentBlockIdx);
    }

    render() {

        //초기화
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add("cdx-embed-wrapper");
        const form = document.createElement("form");

        const input = document.createElement("input");
        input.classList.add("embed-input");
        input.type = "text";
        input.placeholder = "유튜브 링크";

        const submitButton = document.createElement("button");
        submitButton.classList.add("embed-btn");
        submitButton.innerHTML = "임베드";
        submitButton.type = "submit";

        //폼태그에 삽입
        form.appendChild(input);
        form.appendChild(submitButton);

        //폼태그 이벤트 정의
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const currentFormElement = event.currentTarget;
            const childInputText = currentFormElement.querySelector('input');
            const src = childInputText.value;
            this.data.src = src;
            this._toggleWrapperClass();
            if (!src) return;
            const iframe = this.wrapper.querySelector("iframe");
            if (!iframe) {
                this.appendIframe(src);
            } else {
                iframe.src = this.parseYoutubeSrc(src);
            }
        });

        this.wrapper.appendChild(form);
        if (this.data.src) {
            this.wrapper.innerHTML = "";
            const src = this.data.src;
            this.appendIframe(src);
        }
        if (this.data.width) {
            const widthInputContainer = document.createElement('div');
            widthInputContainer.style.cssText = `
                display:flex;
                algin-items:center;
                justify-content:flex-start;
                background-color:#333;
                color:#fff;
                padding:1rem;
                width:100%;
                box-sizing:border-box;
            `;
            widthInputContainer.contentEditable = false;
            widthInputContainer.classList.add("width-input-container");
            const label = document.createElement("label");
            label.innerHTML = "영상 가로사이즈(%)";
            label.style.cssText = `margin-right:0.5rem`;
            const widthInput = document.createElement('input');
            widthInput.value = this.data.width;
            widthInput.min = 10;
            widthInput.max = 100;
            widthInput.classList.add("width-input");
            widthInput.type = "number";
            widthInput.placeholder = "%";
            widthInputContainer.appendChild(label);
            widthInputContainer.appendChild(widthInput);
            widthInput.oninput = (e) => {
                const widthValue = e.target.value;
                const wrapper = this.wrapper.querySelector('.iframe-wrapper');
                wrapper.style.width = `${widthValue}%`;
            }
            this.wrapper.appendChild(widthInputContainer);
        }
        this._acceptTuneView();

        return this.wrapper;
    }

    save(blockContent) {
        const iframe = blockContent.querySelector('iframe');
        const width = blockContent.querySelector('.width-input');
        if (iframe) {
            return {
                src: iframe?.src,
                width: width.value * 1,
            };
        } else {
            return false;
        }

    }

    appendIframe(src) {
        const result = this.getYoutubeIframe(src);
        result.addEventListener("click", (e) => {
            e.preventDefault();
        });
        const iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add("iframe-wrapper");
        iframeWrapper.appendChild(result);
        const iframePreventer = document.createElement('div');
        iframePreventer.innerHTML = "메뉴보기";
        iframePreventer.classList.add("iframe-preventer");
        iframeWrapper.appendChild(iframePreventer);
        this.wrapper.appendChild(iframeWrapper);
    }

    parseYoutubeSrc(src) {
        const SOURCE_ID_REGEX = new RegExp(/\?v=(.*)/, "g");
        const SOURCE_ID_REGEX_2 = new RegExp(/\/embed\/(.*)/, "g");
        const SOURCE_ID_REGEX_3 = new RegExp(/youtu.be\/(.*)/, "g");
        const SOURCE_URI = "https://www.youtube.com/embed/";
        let match = [...src.matchAll(SOURCE_ID_REGEX)];
        if (match[0] === undefined) {
            match = [...src.matchAll(SOURCE_ID_REGEX_2)];
        }
        if (match[0] === undefined) {
            match = [...src.matchAll(SOURCE_ID_REGEX_3)];
        }
        const sourceId = [...match][0][1];
        return SOURCE_URI + sourceId;
    }
    getYoutubeIframe(src) {
        const iframe = document.createElement('iframe');
        iframe.src = this.parseYoutubeSrc(src);
        iframe.frameborder = 0;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowfullscreen = true;
        return iframe;
    }

    _toggleWrapperClass() {
        this.wrapper.classList.toggle("cdx-embed-embeded", this.data.src);
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

export { Embed };