import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { uploadFile } from '../api/file';
import { writeGuestbook } from '../api/guestbook';
import useGlobal from '../hook/useGlobal';
import images from '../images';
import { FrontPrimaryBtn, FrontSecondaryBtn } from './Btns';

function GuestbookEditor({ title, author_name, content, id, relate_post_id }) {
    const INITIAL_STATE = {
        input: {
            id: 0,
            title: '',
            name: '',
            content: '',
            pwd: ''
        },
        error: null,
    };
    const { setGlobal } = useGlobal();
    const contentRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);
    const closeEditor = (cancel = true) => {
        if (cancel) {
            setGlobal({ editorVisible: false, editorData: null, editorCancel: true });
        } else {
            setGlobal({ editorVisible: false, editorData: null });
        }
    };
    const onSubmit = (event) => {
        event.preventDefault();
        const { name, content, pwd, id } = state.input;
        writeGuestbook({
            ID: id,
            post_content: content,
            author_name: name,
            // post_title: title,
            p_password: pwd,
        }).then(res => {
            setState(s => ({
                ...s,
                error: null
            }));
            closeEditor(false);
            setGlobal({ guestbookSeed: Date.now() });
            scrollToList();
        }).catch(error => {
            setState(s => ({
                ...s,
                error: error.response.data.message
            }));
        });
    }
    const escapeByEsc = (e) => {
        const { key } = e;
        if (key === "Escape") {
            closeEditor();
        }
    };
    useEffect(() => {
        setState(s => ({
            ...s,
            input: {
                ...s.input,
                title: title,
                name: author_name,
                content: content,
                relate_post_id:relate_post_id,
                id: id,
            }
        }));
    }, [title, author_name, content, id]);
    
    useEffect(() => {
        return () => {
            setGlobal({ editorData: null });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keyup', escapeByEsc);
        return () => {
            window.removeEventListener('keyup', escapeByEsc);
        }
    }, []);

    const inputCommonAttrs = {
        onInput: (event) => {
            const target = event.target;
            const name = target.classList[0];
            const value = name === "content" ? target.innerHTML : target.value;
            setState(s => ({
                ...s,
                input: {
                    ...s.input,
                    [name]: value,
                }
            }));
        }
    }
    const scrollToList = () => {
        const container = document.getElementById("root");
        const list = document.querySelector('.guestbook-list-wrap');
        const { top } = list.getBoundingClientRect();
        container.scrollTo({ left: 0, top: top + container.scrollTop, behavior: "smooth" });
    }
    const appendImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.cssText = "display:none";
        input.accept = "image/*";
        input.multiple = false;
        input.click();
        input.onchange = event => {
            const file = input.files[0];
            const form = new FormData();
            form.append("file", file);
            uploadFile(form).then(res => {
                const image = new Image;
                image.src = res.data.url;
                contentRef.current.appendChild(image);
                setState(s => ({
                    ...s,
                    input: {
                        ...s.input,
                        content: contentRef.current.innerHTML,
                    }
                }));
                form.remove();
                image.remove();
            }).catch(error => {
                setState(s => ({
                    ...s,
                    error: error.response?.data?.message,
                }));
            });
            input.remove();
        };
    }
    const { error } = state;
    return (
        <GuestbookEditorLayout
            onClick={(event) => {
                if (event.target === event.currentTarget
                    || event.target.classList.contains("editor-wrap")) {
                    closeEditor();
                }
            }}
        >
            <div className="editor-wrap">
                <div className="editor">
                    <form onSubmit={onSubmit}>
                        <div className="head">
                            <input className="name" type="text" name="name" placeholder="이름" {...inputCommonAttrs} value={state.input.name} />
                            <input className="pwd" type="password" name="pwd" placeholder="비밀번호"{...inputCommonAttrs} />
                            {/* <input className="title" type="text" name="title" placeholder="제목"{...inputCommonAttrs} value={state.input.title} /> */}
                        </div>
                        <div className="body">
                            <div contentEditable="true" ref={contentRef} className="content" name="content" placeholder="2021년, 언박싱을 위한 한마디를 적어주세요." {...inputCommonAttrs} dangerouslySetInnerHTML={{ __html: content }}>
                            </div>
                        </div>
                        <div className="error">{error}</div>
                        <div className="footer">
                            <div>
                                <FrontPrimaryBtn
                                    type="button"
                                    id="camera-btn"
                                    onClick={appendImage}
                                >
                                    <img src={images['camera-icon.png']} />
                                </FrontPrimaryBtn>
                            </div>
                            <div>
                                <FrontPrimaryBtn
                                    onClick={() => {
                                        closeEditor();
                                    }}
                                    type="button">취소</FrontPrimaryBtn>
                                <FrontPrimaryBtn>작성</FrontPrimaryBtn>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestbookEditorLayout>
    );
}

export function GuestbookInlineEditor({ relatePostId }) {
    const INITIAL_STATE = {
        input: {
            id: 0,
            title: '',
            name: '',
            content: '',
            pwd: ''
        },
        error: null,
    };
    const { setGlobal } = useGlobal();
    const contentRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);
    const closeEditor = (cancel = true) => {
        if (cancel) {
            setGlobal({ editorVisible: false, editorData: null, editorCancel: true });
        } else {
            setGlobal({ editorVisible: false, editorData: null });
        }
    };
    const onSubmit = (event) => {
        event.preventDefault();
        const { name, content, title, pwd, id } = state.input;
        writeGuestbook({
            ID: id,
            post_content: content,
            author_name: name,
            // post_title: title,
            relate_post_id: relatePostId,
            p_password: pwd,
        }).then(res => {
            setState(s => ({
                ...s,
                error: null,
                input: INITIAL_STATE.input,
            }));
            closeEditor(false);
            setGlobal({ guestbookSeed: Date.now() });
            contentRef.current.innerHTML = "";
        }).catch(error => {
            setState(s => ({
                ...s,
                error: error.response.data.message
            }));
        });
    }
    const escapeByEsc = (e) => {
        const { key } = e;
        if (key === "Escape") {
            closeEditor();
        }
    };
    useEffect(() => {
        return () => {
            setGlobal({ editorData: null });
        }
    }, []);
    useEffect(() => {
        window.addEventListener('keyup', escapeByEsc);
        return () => {
            window.removeEventListener('keyup', escapeByEsc);
        }
    }, []);

    const inputCommonAttrs = {
        onInput: (event) => {
            const target = event.target;
            const name = target.classList[0];
            const value = name === "content" ? target.innerHTML : target.value;
            setState(s => ({
                ...s,
                input: {
                    ...s.input,
                    [name]: value,
                }
            }));
        }
    }
    const appendImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.cssText = "display:none";
        input.accept = "image/*";
        input.multiple = false;
        input.click();
        input.onchange = event => {
            const file = input.files[0];
            const form = new FormData();
            form.append("file", file);
            uploadFile(form).then(res => {
                const image = new Image;
                image.src = res.data.url;
                contentRef.current.appendChild(image);
                setState(s => ({
                    ...s,
                    input: {
                        ...s.input,
                        content: contentRef.current.innerHTML,
                    }
                }));
                form.remove();
                image.remove();
            }).catch(error => {
                setState(s => ({
                    ...s,
                    error: error.response?.data?.message,
                }));
            });
            input.remove();
        };
    }
    const { error } = state;
    return (<GuestbookInlineEditorLayout>
        <form onSubmit={onSubmit}>
            <div className="head">
                <input className="name" type="text" name="name" placeholder="이름" {...inputCommonAttrs} value={state.input.name} />
                <input className="pwd" type="password" name="pwd" placeholder="비밀번호"{...inputCommonAttrs} value={state.input.pwd} />
                {/* <input className="title" type="text" name="title" placeholder="제목"{...inputCommonAttrs} value={state.input.title} /> */}
            </div>
            <div className="body">
                <div contentEditable="true" ref={contentRef} className="content" name="content" placeholder="2021년, 언박싱을 위한 한마디를 적어주세요." {...inputCommonAttrs}>
                </div>
            </div>
            <div className="error">{error}</div>
            <div className="footer">
                <div>
                    <FrontSecondaryBtn
                        type="button"
                        id="camera-btn"
                        onClick={appendImage}
                    >
                        <img src={images['camera-icon.png']} />
                    </FrontSecondaryBtn>
                </div>
                <div>
                    <FrontSecondaryBtn>작성</FrontSecondaryBtn>
                </div>
            </div>
        </form>
    </GuestbookInlineEditorLayout>);
}

export default GuestbookEditor;

const GuestbookInlineEditorLayout = styled.div`
    box-sizing: border-box;
    padding:1.44rem;
    max-width:1280px;
    margin:0 auto;
    width:100vw;
    .error{
        color:${({ theme }) => theme.colors.secondary};
    }
    .content,
    input{
        box-sizing: border-box;
        border:1px solid #707070;
        padding:1rem;
        resize:none;
        &:focus{
            outline:1px solid ${({ theme }) => theme.colors.secondary};
            box-shadow:0px 0px 10px ${({ theme }) => theme.colors.secondary};
        }
    }
    .head{
        width:100%;
        margin-left:-1.11rem;
        input{
            margin-left:1.11rem;
        }
    }
    .footer{
        display:flex;
        justify-content: space-between;
        margin-top:1.11rem;
        margin-right:-1.11rem;
        align-items:stretch;
        button{
            margin-right: 1.11rem;
            height:100%;
        }
        #camera-btn{
            img{
                height:1.4rem;
            }
        }
    }
    .name,
    .pwd{
        max-width:11.66rem;
        width:100%;
        margin-bottom:1.11rem;
    }
    .title{
        width:100%;
        box-sizing:border-box;
        margin-bottom:1.11rem;
    }
    .content{
        color:#000;
        background-color: #fff;
        overflow-y:auto;
        width:100%;
        height:100vh;
        max-height:10rem;
        box-sizing:border-box;
        img{
            max-width:100%;
        }
    }
`;

export const GuestbookEditorLayout = styled.div`
    position:fixed;
    inset:0;
    z-index:9;
    background-color:rgba(0,0,0,.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .editor-wrap{
        width:100%;
        align-items:center;
        height:100%;
        display:flex;
        flex-direction:column;
        padding:5rem 2rem;
        overflow-y: auto;
        box-sizing:border-box;
        &::after,
        &::before{
            content:"";
            flex-grow:1;
            display:block;
        }
        .editor{
            box-sizing: border-box;
            padding:1.44rem;
            background-color: #fff;
            border:1px solid #707070;
            max-width:34.56rem;
            width:100%;
            .error{
                color:${({ theme }) => theme.colors.primary};
            }
            .content,
            input{
                box-sizing: border-box;
                border:1px solid #707070;
                padding:1rem;
                resize:none;
                &:focus{
                    outline:1px solid ${({ theme }) => theme.colors.primary};
                    box-shadow:0px 0px 10px ${({ theme }) => theme.colors.primary};
                }
            }
            .head{
                width:100%;
                margin-left:-1.11rem;
                input{
                    margin-left:1.11rem;
                }
            }
            .footer{
                display:flex;
                justify-content: space-between;
                margin-top:1.11rem;
                margin-right:-1.11rem;
                align-items:stretch;
                button{
                    margin-right: 1.11rem;
                    height:100%;
                }
                #camera-btn{
                    img{
                        height:1.4rem;
                    }
                }
            }
            .name,
            .pwd{
                max-width:11.66rem;
                width:100%;
                margin-bottom:1.11rem;
            }
            .title{
                width:100%;
                box-sizing:border-box;
                margin-bottom:1.11rem;
            }
            .content{
                overflow-y:auto;
                width:100%;
                height:100vh;
                max-height:20rem;
                box-sizing:border-box;
                img{
                    max-width:100%;
                }
            }
        }
    }
`;