import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import { SimpleImage } from '../editor_js_plugins/uploadImage';

function Editor() {
    useEffect(() => {
        const editor = new EditorJS({
            autofocus: true,
            tools: {
                image: SimpleImage
            },
            placeholder:"이곳을 클릭하여 입력하세요"
        });
    }, [])
    return (
        <div id="editorjs">
        </div>
    );
}

export default Editor;