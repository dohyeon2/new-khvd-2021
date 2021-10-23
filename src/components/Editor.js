import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { SimpleImage } from '../editor_js_plugins/uploadImage';
import { Embed } from '../editor_js_plugins/embed';
import { Book } from '../editor_js_plugins/book';
import { PrimaryBtn } from './Btns';
import Header from '@editorjs/header';

function Editor({ onSave, data }) {
    const editor = useRef(null);
    useEffect(() => {
        editor.current = new EditorJS({
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
            data: data,
            placeholder: "이곳을 클릭하여 입력하세요"
        });
        return () => {
            editor.current.destroy();
        }
    }, []);

    return (
        <>
            <div id="editorjs">
            </div>
            <PrimaryBtn onClick={(event) => {
                (async () => {
                    editor.current.save().then((outputData) => {
                        onSave && onSave(event, outputData);
                    }).catch((error) => {
                        window.alert('Saving failed: ', error);
                    });

                })();
            }}>저장</PrimaryBtn>
        </>
    );
}

export default Editor;