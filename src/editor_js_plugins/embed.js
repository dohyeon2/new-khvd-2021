class Embed {
    constructor({ data, api }) {
        if (data === false) {
            this.deleteThisBlock();
        }
        this.data = {
            src: data.src || "",
        };
        this.wrapper = undefined;
        this.state = undefined;
        this.loading = false;
        this.api = api;
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

        return this.wrapper;
    }

    save(blockContent) {
        const iframe = blockContent.querySelector('iframe');
        if (iframe) {
            return {
                src: iframe?.src,
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

}

export { Embed };