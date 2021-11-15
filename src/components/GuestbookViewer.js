import React, { useState } from 'react';
import { GuestbookEditorLayout } from './GuestbookEditor';
import { FrontPrimaryBtn } from './Btns';
import styled from 'styled-components';
import useGlobal from '../hook/useGlobal';
import { deleteGuestbook } from '../api/guestbook';

function GuestbookViewer(attr) {
    const { setGlobal, global } = useGlobal();
    const [state, setState] = useState({
        error: null
    });
    const closeViewer = () => {
        setGlobal({ guestbookData: null });
    }
    const openEditor = () => {
        setGlobal({ guestbookData: null, editorVisible: true, editorData: attr });
    }
    const deletePost = () => {
        const password = window.prompt("비밀번호를 입력하세요.");
        deleteGuestbook({
            ID: global.guestbookData.id,
            p_password: password
        }).then(res => {
            setGlobal({ guestbookData: null, guestbookSeed: Date.now() });
        }).catch(error => {
            setState(s => ({
                ...s,
                error: error.response.data.message
            }));
        });
    }
    return (
        <GuestbookViewerLayout
            onClick={(event) => {
                if (event.target === event.currentTarget
                    || event.target.classList.contains("editor-wrap")) {
                    closeViewer();
                }
            }}
        >
            <div className="editor-wrap">
                <div className="editor">
                    {/* <div className="title">
                        {attr.title}
                    </div> */}
                    <div className="info">
                        <div className="name">{attr.author_name}</div>
                        <div className="date">{attr.date}</div>
                    </div>
                    <hr />
                    <div className="content" dangerouslySetInnerHTML={{
                        __html: attr.content
                    }}>
                    </div>
                    <div className="error">
                        {state.error}
                    </div>
                    <div className="footer">
                        <div>
                            <FrontPrimaryBtn
                                onClick={openEditor}
                                type="button">수정</FrontPrimaryBtn>
                            <FrontPrimaryBtn
                                onClick={deletePost}
                                type="button">삭제</FrontPrimaryBtn>
                        </div>
                        <div>
                            <FrontPrimaryBtn
                                onClick={closeViewer}
                                type="button">취소</FrontPrimaryBtn>
                        </div>
                    </div>
                </div>
            </div>
        </GuestbookViewerLayout>
    );
}

export default GuestbookViewer;

const GuestbookViewerLayout = styled(GuestbookEditorLayout)`
    .editor-wrap{
        .title{
            font-size:2rem;
        }
        .editor{
            .info{
                display:flex;
                align-items:center;
                margin-bottom:1rem;
            }
            .edit{
                margin-bottom:0.8rem;
            }
            .name{
                font-size:1.2rem;
                font-weight:700;
                margin-bottom:0;
                width:unset;
                margin-right:1rem;
            }
            .date{

            }
            .content{
                line-height:1.6;
                padding:0;
                border:0;
                outline:0;
            }
        }
    }
`;