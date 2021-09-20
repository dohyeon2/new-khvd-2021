import React, { useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { SimpleImage } from '../editor_js_plugins/uploadImage';
import { PrimaryBtn } from './Btns';

function Editor({ onSave }) {

    const initialState = {
        editor: null
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!state.editor) {
            const editor = new EditorJS({
                autofocus: true,
                tools: {
                    image: SimpleImage
                },
                placeholder: "이곳을 클릭하여 입력하세요"
            });
            setState(s => ({
                ...s,
                editor: editor,
            }));
        }
    }, []);

    return (
        <>
            <div id="editorjs">
            </div>
            <PrimaryBtn onClick={(event) => {
                state.editor.save().then((outputData) => {
                    onSave && onSave(event, outputData);
                }).catch((error) => {
                    console.log(error);
                });
            }}>저장</PrimaryBtn>
        </>
    );
}

export default Editor;