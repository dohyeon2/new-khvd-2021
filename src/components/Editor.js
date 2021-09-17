import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import styled from 'styled-components';
import { SimpleImage } from '../editor_js_plugins/uploadImage';

const EditorStyled = styled.div`
    .ce-block__content, 
    .ce-toolbar__content {
    max-width: 1600px;  /* example value, adjust for your own use case */
    }
`;

function Editor() {
    useEffect(() => {
        const editor = new EditorJS({
            autofocus: true,
            tools: {
                image: SimpleImage
            }
        });
    }, [])
    return (
        <EditorStyled id="editorjs">
        </EditorStyled>
    );
}

export default Editor;