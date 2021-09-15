import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';

function Editor() {
    useEffect(() => {
        const editor = new EditorJS('editorjs');
    }, [])
    return (
        <div id="editorjs">
        </div>
    );
}

export default Editor;