import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { SimpleImage } from '../editor_js_plugins/uploadImage';
import { Embed } from '../editor_js_plugins/embed';
import { Book } from '../editor_js_plugins/book';
import { PrimaryBtn } from './Btns';
import Header from '@editorjs/header';
import styled from 'styled-components';

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
            <EditorContainer id="editorjs">
            </EditorContainer>
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


const EditorContainer = styled.div`
    .cdx-embed-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        form{
            order:2;
            display: flex;
            align-items: center;
            justify-content: center;
            padding:2rem;
            border:5px solid #ccc;
            background-color: #efefef;
            width: 100%;
            box-sizing:border-box;
            border-radius: 10px;
            input{
                flex-grow: 1;
            }
            input,
            button{
                padding:1rem;
            }
        }
        &.cdx-embed-embeded{
            form{
                display: none;
            }
            .iframe-preventer{
                position: absolute;
                right:1rem;
                bottom:1rem;
                z-index:2;
                padding:1rem;
                font-size:18px;
                background-color: #2EA7E0;
                color:#fff;
                border-radius:8px;
            }
        }
        .iframe-wrapper{
            position: relative;
            order:1;
            width: 100%;
            &::before{
                content: "";
                display: block;
                padding-top: 56.25%;
            }
            iframe{
                border:0;
                position: absolute;
                top:0;
                left:0;
                bottom:0;
                right:0;
                width: 100%;
                height: 100%;
            }
        }
    }
    .cdx-image-wrapper{
        position: relative;
        &.stretched{
            width: 100%;
            img{
                width: 100%;
            }
        }
        &.centered{
            justify-content: center;
        }
        .img-upload-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding:2rem;
            border:5px solid #ccc;
            background-color: #efefef;
            cursor: pointer;
            border-radius: 10px;
            font-size:22px;
            &:hover{
                opacity: 0.8;
            }
            svg{
                width:22px;
                height:22px;
            }
        }
        .cancel-btn{
            z-index:2;
            position: absolute;
            top:1rem;
            right:1rem;
            border:0;
            background-color: transparent;
            cursor: pointer;
        }
    }
    .ce-block__content, 
    .ce-toolbar__content {
        max-width: unset;  /* example value, adjust for your own use case */
        .cdx-block:focus{
            border:1px solid #2EA7E0;
        }
        .ce-paragraph{
            padding:.4rem 2rem;
        }
    }
`;