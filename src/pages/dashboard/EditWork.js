import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Editor from '../../components/Editor';
import Loading from '../../components/Loading';
import { apiURI } from '../../vars/api';
import axios from 'axios';
import produce from 'immer';
import {
    searchGoogleDriveFolder,
    createGoogleDriveFolder,
    connectUploadSession,
    uploadFileToGoogleDrive,
    changeGoogleDriveFilePermission,
    getWebContentLinkFromGoogleDriveFile
} from '../../utils/googleDriveProcessing';

const StyledEditWork = styled.div`
    ul{
        list-style:none;
        padding:.5rem;
        margin:0;
        display: flex;
        flex-wrap: wrap;
        justify-content: stretch;
        li.in-search{
            flex-shrink:0;
            border:1px solid #ddd;
            border-radius: 4px;
            padding:.5rem;
            margin-right:.5rem;
            background-color: #fff;
            cursor: pointer;
            transition: filter .2s ease-in-out;
            &:hover{
                filter:brightness(90%);
            }
        }
    }
    .desinger-section-title{
        font-family: 'SBAggroB';
        font-size: 30px;
    }
    .editor-wrap{
        box-sizing:border-box;
        font-family: NanumSquare;
        max-width: 1280px;
        padding-top: 189px;
        margin:0 auto;
    }
    .flex{
        display: flex;
        &.justify-between{
            justify-content: space-between;
        }
    }
    .color-selector-wrap{
        justify-content: flex-end;
        align-items: center;
        &>*{
            margin:.2rem;
        }
    }
    .search-designer-container{
        border:1px solid #ddd;
        border-radius: 10px;
        .designer-search-input-wrap{
            padding:.5rem;
            border-bottom:1px solid #ddd;
            box-sizing:border-box;
            input{
                box-sizing:border-box;
                width:100%;
                padding:.3rem;
            }
        }
    }
    .work-meta{
        margin-bottom:200px;
        .left{
            flex-grow:1;
            padding-right: 20px;
            box-sizing:border-box;
            .project-title{
                width:100%;
                padding:1rem;
                border:2px dashed #ddd;
                border-radius: 4px;
                font-size:60px;
                font-weight: bold;
                box-sizing:border-box;
                margin-bottom: 22px;
            }
            #project-category{
                font-size:25px;
                margin-bottom:44px;
                padding:.25rem;
                border-width: 2px;
                border-color:#ddd;
                border-style: dashed;
            }
            .description{
                box-sizing:border-box;
                display: block;
                width: 100%;
                resize:none;
                height:200px;
                font-size: 20px;
                font-weight: 700;
                border-width: 2px;
                border-color:#ddd;
                border-style: dashed;
            }
        }
        .right{
            flex-grow:0;
            flex-shrink:0;
            .thumbnail{
                width:${513 * 100 / 1920}vw;
                border-radius:4px;
                overflow:hidden;
                border:1px solid #ddd;
                label{
                    cursor: pointer;
                    &.loading{
                        opacity: 0.6;
                    }
                    img{
                        max-width: 100%;
                        max-height: 100%;
                        width: auto;
                        height: auto;
                    }
                    .dummy{
                        width: 100%;
                        height:100%;
                    }
                }
                .dummy{
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23666' class='bi bi-image' viewBox='0 0 16 16'%3E%3Cpath d='M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3Cpath d='M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z'/%3E%3C/svg%3E");
                    background-size: 30%;
                    background-color: #ccc;
                    background-position: center;
                    background-repeat: no-repeat;
                }
            }
        }
    }
    #editorjs{
        border:2px dashed #ddd;
    }
    .ce-block__content, 
    .ce-toolbar__content {
        max-width: unset;  /* example value, adjust for your own use case */
        .cdx-block:focus{
            border:1px solid #2EA7E0;
        }
    }
`;
const StyledDesignerSummary = styled.li`

`;
function DesignerSummary({ data, inSearch, onClick }) {
    return (<StyledDesignerSummary className={["designer", (inSearch && "in-search")].join(" ")} onClick={(event) => {
        onClick && onClick(event, data);
    }}>
        <div className="name">
            <div className="korean">{data.name}</div>
            <div className="english"></div>
        </div>
        {inSearch && <div className="student-number">{data.meta.common && JSON.parse(data.meta.common).student_number.value}</div>}
    </StyledDesignerSummary>);
}

function EditWorkContainer({ data, loadingObj, SearchUserEventHandler, insertDesignerToList, deleteDesignerToList, uploadFileOnGoogleDrive, saveData, onInput }) {
    const commonAttr = {
        style: {
            color: data.inputs?.text_color,
            backgroundColor: data.inputs?.backgorund_color
        }
    };

    return (<StyledEditWork {...commonAttr}>
        <div className="editor-wrap">
            <div className="work-meta">
                <div className="flex">
                    <div className="left">
                        <input name="project_title" className="project-title" type="text" placeholder="프로젝트 제목" {...commonAttr} onInput={onInput} />
                        <div className="flex justify-between">
                            <select name="project_category" id="project-category" {...commonAttr} onInput={onInput}>
                                {data?.categories?.map((x, i) => <option key={x.id} value={x.id}>{x.name}</option>)}
                            </select>
                        </div>
                        <textarea className="description" name="project_description" placeholder="작품 설명" {...commonAttr} onInput={onInput}></textarea>
                        <div>
                            <h2 className="desinger-section-title">Designer</h2>
                            <div className="search-designer-container">
                                <div className="designer-search-input-wrap">
                                    <input type="text" className="search-designer-input" placeholder="이름으로 검색" onInput={SearchUserEventHandler} />
                                </div>
                                <ul className="searched-list">
                                    {data?.designerSearch
                                        && data?.designerSearch.filter(
                                            (x, i) => -1 === data.designerList.findIndex((y, j) => y.id === x.id)
                                        ).map((x, i) =>
                                            <DesignerSummary inSearch={true} key={i} data={x} onClick={insertDesignerToList}></DesignerSummary>)}
                                </ul>
                            </div>
                            <ul className="designer-list">
                                {data?.designerList && data?.designerList.map((x, i) =>
                                    <DesignerSummary inSearch={true} key={i} data={x} onClick={deleteDesignerToList}></DesignerSummary>)}
                            </ul>
                        </div>
                    </div>
                    <div className="right">
                        <div className="thumbnail">
                            <label htmlFor="thumbnail-input" className={[(loadingObj.thumbnail && "loading")].join(" ")}>
                                {data.thumbnail ? <img src={data.thumbnail} /> : <div className="dummy" style={{
                                    width: 513,
                                    height: 725.67
                                }}></div>}
                            </label>
                            <input id="thumbnail-input" type="file" style={{ display: 'none' }} onInput={(event) => {
                                uploadFileOnGoogleDrive(event);
                            }} />
                            {loadingObj.thumbnail && <Loading />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="colors flex">
                <div className="text-color-wrap color-selector-wrap flex">
                    <label htmlFor="text_color">텍스트 색상</label>
                    <input type="color" name="text_color" id="text_color" value={data.inputs?.text_color} onInput={onInput} />
                    <input type="text" name="text_color" id="text_color_input" value={data.inputs?.text_color} onInput={onInput} />
                </div>
                <div className="background-color-wrap color-selector-wrap flex">
                    <label htmlFor="backgorund_color">배경 색상</label>
                    <input type="color" name="backgorund_color" id="backgorund_color" value={data.inputs?.backgorund_color} onInput={onInput} />
                    <input type="text" name="backgorund_color" id="text_color_input" value={data.inputs?.backgorund_color} onInput={onInput} />
                </div>
            </div>
            <Editor {...commonAttr} onSave={saveData}></Editor>
        </div>
    </StyledEditWork >)
}

function EditWork({ data }) {
    const initialState = {
        loading: {
            data: true,
            designerSearch: false,
            thumbnail: false,
        },
        data: {
            categories: [],
            designerSearch: [],
            designerList: [],
            thumbnail: null,
            inputs: {
                text_color: "#000000",
                backgorund_color: "#ffffff",
            }
        },
        error: false,
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (state.loading.data) {
            (async () => {

                //카테고리를 불러옵니다.
                const categories = await axios.get(apiURI + "wp/v2/categories/?exclude=1&_fields=name,id");

                setState(produce(state, draft => {
                    draft.loading.data = false;
                    draft.data.categories = categories.data;
                }));

            })();
        }
    }, []);

    const SearchUserEventHandler = async (event) => {

        const query = encodeURI(event.target.value);

        if (query === "" || query === null) {
            setState(produce(state, draft => {
                draft.loading.designerSearch = false;
                draft.data.designerSearch = [];
            }));
            return;
        }

        setState(produce(state, draft => {
            draft.loading.designerSearch = true;
        }));

        const users = await axios.get(apiURI + `wp/v2/users/?search=${query}&exclude=1`);

        setState(produce(state, draft => {
            draft.loading.designerSearch = false;
            draft.data.designerSearch = users.data;
        }));

    };

    const insertDesignerToList = (event, data) => {
        const isExistDesigner = state.data.designerList.findIndex((element) => element.id === data.id);
        if (isExistDesigner !== -1) return;
        setState(s => ({
            ...s,
            data: {
                ...s.data,
                designerList: [
                    ...s.data.designerList,
                    data
                ]
            }
        }));
    };

    const deleteDesignerToList = (event, data) => {
        setState(s => ({
            ...s,
            data: {
                ...s.data,
                designerList: s.data.designerList.filter((x, i) => x !== data)
            }
        }));
    };

    const uploadFileOnGoogleDrive = async (event) => {
        const target = event.target;
        const file = target.files[0];
        setState(produce(state, draft => {
            draft.loading.thumbnail = true;
            draft.data.thumbnail = URL.createObjectURL(file);
        }));
        const checkFolder = await searchGoogleDriveFolder("khvd_grad_30");
        let folder_id = null;
        if (checkFolder.data.files.length === 0) {
            //폴더가 없으면 폴더를 만듭니다.
            const createFolder = await createGoogleDriveFolder("khvd_grad_30");
            folder_id = createFolder.data.id;
        } else {
            folder_id = checkFolder.data.files[0].id;
        }
        const uploadSession = await connectUploadSession({
            name: file.name,
            mimeType: file.type,
            parents: [folder_id],
        });
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const dataLength = evt.total;
            const data = evt.target.result;
            const res = await uploadFileToGoogleDrive(uploadSession.headers.location, data, dataLength);
            const permission = await changeGoogleDriveFilePermission(res.data.id, {
                role: "reader",
                type: "anyone",
            });
            const getLink = await getWebContentLinkFromGoogleDriveFile(res.data.id);
            const src = getLink.data.webContentLink.replace(/\&?export\=.*/, "");
            setState(produce(state, draft => {
                draft.loading.thumbnail = false;
                draft.data.thumbnail = src;
            }));
        };
        reader.readAsArrayBuffer(file);
    }

    const saveData = (event, outputData) => {
        console.log(outputData);
        console.log(event);
        console.log(state);
        (async () => {
            const res = await axios.post(apiURI + `wp/v2/posts`, {
                title: state.data.inputs.project_title,
                content: JSON.stringify({
                    designerList: state.data.designerList,
                    editorOutput: outputData,
                    thumbnail: state.data.thumbnail,
                    ...state.data.inputs,
                }),
                status: "publish",
                categories: state.data.inputs.project_category
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                }
            });
        })();
    };

    const onInput = (event) => {
        const target = event.target;
        setState(produce(state, draft => {
            draft.data.inputs[target.name] = target.value;
        }));
    };

    return (
        <>
            <EditWorkContainer
                data={!state.loading.data && state.data}
                loadingObj={state.loading}
                SearchUserEventHandler={SearchUserEventHandler}
                insertDesignerToList={insertDesignerToList}
                deleteDesignerToList={deleteDesignerToList}
                uploadFileOnGoogleDrive={uploadFileOnGoogleDrive}
                saveData={saveData}
                onInput={onInput}
            />
            {state.loading.data && <Loading />}
        </>
    );
}

export default EditWork;