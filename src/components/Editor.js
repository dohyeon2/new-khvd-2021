import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { SimpleImage } from '../editor_js_plugins/uploadImage';
import { Embed } from '../editor_js_plugins/embed';
import { Book } from '../editor_js_plugins/book';
import { PrimaryBtn } from './Btns';
import Header from '@editorjs/header';

function Editor({ onSave }) {
    const editor = useRef(null);
    useEffect(() => {
        editor.current = new EditorJS({
            autofocus: true,
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Enter a header',
                    }
                },
                embed: Embed,
                image: SimpleImage,
                book: Book
            },
            placeholder: "이곳을 클릭하여 입력하세요"
        });
    }, []);

    return (
        <>
            <div id="editorjs">
            </div>
            <PrimaryBtn onClick={(event) => {
                (async () => {
                    const data = await editor.current.save();
                    console.log(data);
                    onSave && onSave(event, data);
                })();
            }}>저장</PrimaryBtn>
        </>
    );
}

export default Editor;