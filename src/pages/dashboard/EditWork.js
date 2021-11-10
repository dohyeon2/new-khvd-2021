import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Editor from '../../components/Editor';
import Loading, { PageLoading } from '../../components/Loading';
import { apiURI } from '../../vars/api';
import axios from 'axios';
import produce from 'immer';
import { Prompt, useParams } from 'react-router'
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import {
    searchGoogleDriveFolder,
    createGoogleDriveFolder,
    connectUploadSession,
    uploadFileToGoogleDrive,
    changeGoogleDriveFilePermission,
    getWebContentLinkFromGoogleDriveFile
} from '../../utils/googleDriveProcessing';
import useUser from '../../hook/useUser';

export function DesignerSummary({ data, inSearch, onClick }) {
    return (<StyledDesignerSummary className={["designer", (inSearch && "in-search")].join(" ")} onClick={(event) => {
        onClick && onClick(event, data);
    }}>
        <div className="name">
            <div className="korean">{data.name}</div>
            <div className="english"></div>
        </div>
        {inSearch && <div className="student-number">{data.common ? data.common['1_student_number']?.value : (data.meta?.common && JSON.parse(data.meta?.common)['1_student_number']?.value)}</div>}
    </StyledDesignerSummary>);
}

function EditWorkContainer({ data, loadingObj, SearchUserEventHandler, insertDesignerToList, deleteDesignerToList, uploadFileOnGoogleDrive, saveData, onInput }) {
    const commonAttr = {
        style: {
            color: data.inputs?.text_color,
            backgroundColor: data.inputs?.backgorund_color
        }
    };
    const INITIAL_STATE = {
        loading: false,
        data: null,
        error: false,
    }
    const [projects, setProjects] = useState(INITIAL_STATE);
    const { user } = useSelector(s => s);
    useEffect(() => {
        if (data.inputs.project_category * 1 === 5) {
            (async () => {
                const projectListData = await axios.get(apiURI + `khvd/v1/project?author=${user.data.wordpressData.id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                    }
                });
                setProjects(s => ({
                    ...s,
                    loading: false,
                    data: projectListData.data,
                }));
            })();
        }
    }, [data.inputs.project_category]);
    return (<StyledEditWork {...commonAttr}>
        <div className="editor-wrap">
            <div className="work-meta">
                <div className="flex">
                    <div className="left">
                        <input name="project_title" className="project-title" type="text" placeholder="프로젝트 제목" {...commonAttr} onInput={onInput} value={data.inputs.project_title} />
                        <input type="text" name="subtitle" className="project-subtitle" placeholder="프로젝트 한줄 설명" {...commonAttr} onInput={onInput} value={data.inputs.subtitle} />
                        <div className="flex justify-between" style={{
                            color: data.inputs?.feature_color,
                        }}>
                            <select name="project_category" id="project-category" {...commonAttr} onInput={onInput} style={{
                                color: data.inputs?.feature_color,
                            }}>
                                {!data.inputs.project_category && <option selected disabled hidden style={{
                                    color: data.inputs?.feature_color,
                                }}>카테고리 선택</option>}
                                {data?.categories?.map((x, i) => <option key={x.id} style={{
                                    color: data.inputs?.feature_color,
                                }} value={x.id} selected={data.inputs.project_category === x.id}>{x.name}</option>)}
                            </select>
                            {data.inputs.project_category * 1 === 5 && <select name="related_project" id="related-project" {...commonAttr} onInput={onInput} style={{
                                color: data.inputs?.feature_color,
                            }}>
                                {!data.inputs.related_project && <option selected disabled hidden style={{
                                    color: data.inputs?.feature_color,
                                }}>연관 작품 선택</option>}
                                <option vlaue="-" style={{
                                    color: data.inputs?.feature_color,
                                }}>없음</option>
                                {projects?.data?.posts.map((x, i) => <option key={x.id} style={{
                                    color: data.inputs?.feature_color,
                                }} value={x.id} selected={data.inputs.related_project === x.title}>{x.title}</option>)}
                            </select>}
                        </div>
                        <textarea className="description" name="project_description" placeholder="작품 설명" {...commonAttr} onInput={onInput} value={data.inputs.project_description}></textarea>
                        <div>
                            <h2 className="desinger-section-title" style={{
                                color: data.inputs?.feature_color,
                            }}>Designer</h2>
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
                            <label
                                htmlFor="thumbnail-input"
                                className={[(loadingObj.thumbnail && "loading")].join(" ")}
                                style={{
                                    backgroundImage: `url(${data.thumbnail})`,
                                }}
                            >
                                {data.thumbnail === null && <div className="dummy"></div>}
                            </label>
                            <input id="thumbnail-input" type="file" style={{ display: 'none' }} accept="image/*" onInput={(event) => {
                                uploadFileOnGoogleDrive(event);
                            }} />
                            {loadingObj.thumbnail && <Loading />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="colors flex" style={{
                flexWrap: "wrap"
            }}>
                <div className="text-color-wrap color-selector-wrap flex">
                    <label htmlFor="text_color">텍스트 색상</label>
                    <input type="color" name="text_color" id="text_color" value={data.inputs?.text_color} onInput={onInput} value={data.inputs.text_color} />
                    <input type="text" name="text_color" id="text_color_input" value={data.inputs?.text_color} onInput={onInput} value={data.inputs.text_color} />
                </div>
                <div className="background-color-wrap color-selector-wrap flex">
                    <label htmlFor="backgorund_color">배경 색상</label>
                    <input type="color" name="backgorund_color" id="backgorund_color" value={data.inputs?.backgorund_color} onInput={onInput} value={data.inputs.backgorund_color} />
                    <input type="text" name="backgorund_color" id="backgorund_color_input" value={data.inputs?.backgorund_color} onInput={onInput} value={data.inputs.backgorund_color} />
                </div>
                <div className="feature-color-wrap color-selector-wrap flex">
                    <label htmlFor="feature_color">포인트 색상</label>
                    <input type="color" name="feature_color" id="feature_color" value={data.inputs?.feature_color} onInput={onInput} value={data.inputs.feature_color} />
                    <input type="text" name="feature_color" id="feature_color_input" value={data.inputs?.feature_color} onInput={onInput} value={data.inputs.feature_color} />
                </div>
            </div>
            <StyledProjectContent>
                <Editor {...commonAttr} onSave={saveData} data={data.editor_outupt}></Editor>
            </StyledProjectContent>
        </div>
    </StyledEditWork >)
}

function EditWork({ data }) {
    const params = useParams();
    const history = useHistory();
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
            editor_outupt: null,
            inputs: {
                text_color: "#000000",
                backgorund_color: "#ffffff",
                feature_color: "#FF358E",
                project_title: null,
                subtitle: null,
                project_category: null,
                project_description: null,
            }
        },
        error: false,
        saved: false,
    };
    const [state, setState] = useState(initialState);
    useEffect(() => {
        if (state.loading.data) {
            (async () => {
                let projectData = false;
                //카테고리를 불러옵니다.
                const categories = await axios.get(apiURI + "wp/v2/categories/?exclude=1,6&_fields=name,id");

                //아이디가 있으면 불러온다
                if (params.id) {
                    projectData = await axios.get(apiURI + `khvd/v1/project/${params.id}`);
                }


                setState(produce(state, draft => {
                    draft.loading.data = false;
                    draft.data.categories = categories.data;
                    if (projectData) {
                        draft.data.inputs.project_category = projectData.data.category;
                        draft.data.designerList = projectData.data.designer_list;
                        draft.data.editor_outupt = projectData.data.editor_output;
                        draft.data.thumbnail = projectData.data.thumbnail;
                        draft.data.inputs.project_title = projectData.data.title;
                        draft.data.inputs.project_description = projectData.data.description;
                        draft.data.inputs.subtitle = projectData.data.subtitle;
                        draft.data.inputs.backgorund_color = projectData.data.backgorund_color;
                        draft.data.inputs.text_color = projectData.data.text_color;
                        draft.data.inputs.feature_color = projectData.data.feature_color;
                        draft.data.inputs.related_project = projectData.data.related_project;
                    }
                }));

            })();
        }
        window.onbeforeunload = (e) => {
            if (state.saved) e.preventDefault();
            else e.returnValue = "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
        }
        return () => {
            window.onbeforeunload = null;
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
        const isExistDesigner = state.data.designerList.findIndex((element) => element.id === data);
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
            const src = getLink.data.webContentLink;
            setState(produce(state, draft => {
                draft.loading.thumbnail = false;
                draft.data.thumbnail = src;
            }));
        };
        reader.readAsArrayBuffer(file);
    }

    const isUndefined = (value) => {
        return (value === [] || value === undefined || value === null);
    }

    const validateInputs = () => {
        const except = ["related_project"];
        const inputs = Object.keys(state.data.inputs).filter(x => !except.includes(x)).map(x => state.data.inputs[x]);
        const required = [...inputs, state.data.thumbnail, state.data.designerList];
        return !required.map(x => isUndefined(x)).includes(true);
    }

    const saveData = (event, outputData) => {
        let loading = false;
        outputData.blocks.map(x => {
            if (x.data === "uploading") loading = true;
        }
        );
        if (loading) return;
        const designerList = state.data.designerList.map(x => x.id);
        if (designerList.length < 1) {
            window.alert("디자이너를 입력해주세요.");
            return;
        }
        const idx = Object.values(state.loading).findIndex((x, i) => x);

        if (idx !== -1) {
            window.alert(Object.keys(state.loading)[idx] + "가 로딩중입니다");
            return;
        }
        if (!validateInputs()) {
            window.alert("모든 항목을 입력해주세요.");
            return;
        }

        (async () => {
            try {
                const res = await axios.post(apiURI + `khvd/v1/project`, {
                    post_id: params.id || 0,
                    title: state.data.inputs.project_title,
                    content: state.data.inputs.project_description,
                    meta: {
                        thumbnail: state.data.thumbnail,
                        designerList: designerList,
                        editorOutput: outputData,
                        subtitle: state.data.inputs.subtitle,
                        text_color: state.data.inputs.text_color,
                        backgorund_color: state.data.inputs.backgorund_color,
                        feature_color: state.data.inputs.feature_color,
                        related_project: (state.data.inputs.project_category * 1 === 5 ? state.data.inputs.related_project : null)
                    },
                    status: "publish",
                    categories: state.data.inputs.project_category
                }, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                    }
                });
                setState(s => ({
                    ...s,
                    saved: true,
                }));
                window.alert("저장이 완료 되었습니다!");
                history.push("/my-dashboard/projects");
            } catch (e) {
                e?.response?.data?.message && window.alert(e.response.data.message);
            }
        })();
    };

    const onInput = (event) => {
        const target = event.target;
        setState(produce(state, draft => {
            draft.data.inputs[target.name] = target.value;
        }));
    };
    if (state.loading.data) return <PageLoading></PageLoading>
    return (
        <>
            <Prompt
                when={!state.saved}
                message='저장되지 않은 데이터가 있습니다. 정말 나가시겠습니까?'
            />
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

export const StyledEditWork = styled.div`
    .codex-editor--narrow .codex-editor__redactor{
        margin-right: 0;
    }
    .iframe-preventer{
        position: absolute;
        right:1rem;
        bottom:1rem;
        z-index:2;
        padding:1rem;
        font-size:1rem;
        background-color: #2EA7E0;
        color:#fff;
        border-radius:8px;
    }
    .href-input-container{
        display:none;
        position:absolute;
        top:1rem;
        left:4rem;
        align-items:center;
        z-index:3;
    }
    .cdx-image-wrapper{
        &.href{
            .href-input-container{
                display: flex;
            }
        }
    }
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
        font-size: 1.67rem;
    }
    .editor-wrap{
        padding: 10.5rem 0rem;
        box-sizing:border-box;
        max-width: 1280px;
        @media screen and (max-width:1440px){
            max-width: 1080px;
        }
        width:100%;
        margin:0 auto;
        .ce-toolbar__plus{
            left:0;
        }
        .ce-toolbar__actions{
            right:5px;
        }
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
        margin-bottom:11.12rem;
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
            margin-bottom:5rem;
        }
        .left{
            flex-grow:1;
            padding-right: 1.12rem;
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
            .project-subtitle{
                width:100%;
                padding:1rem;
                border:2px dashed #ddd;
                border-radius: 4px;
                font-size:1.34rem;
                font-weight: bold;
                box-sizing:border-box;
                margin-bottom: 22px;
            }
            #related-project{
                display: block;
                flex-shrink: 1;
                max-width: 200px;
                min-width: unset;
                white-space: wrap;
            }
            #related-project,
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
                font-size: 1.2rem;
                font-weight: 400;
                border-width: 2px;
                border-color:#ddd;
                border-style: dashed;
                line-height: 1.8;
                word-break:keep-all;
            }
        }
        .right{
            flex-grow:0;
            flex-shrink:0;
            .thumbnail{
                width:${513 * 100 / 1920}vw;
                border-radius:4px;
                overflow:hidden;
                position: relative;
                border:1px solid #ddd;
                &::before{
                    content: "";
                    display: block;
                    padding-top: 140%;
                }
                label{
                    position: absolute;
                    left:0;
                    right: 0;
                    top:0;
                    bottom:0;
                    cursor: pointer;
                    background-size:cover;
                    background-position: center;
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
                    position: absolute;
                    left:0;
                    right: 0;
                    top:0;
                    bottom:0;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23666' class='bi bi-image' viewBox='0 0 16 16'%3E%3Cpath d='M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3Cpath d='M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z'/%3E%3C/svg%3E");
                    background-size: 30%;
                    background-color: #ccc;
                    background-position: center;
                    background-repeat: no-repeat;
                }
            }
        }
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
            .flex{
                flex-wrap: wrap;
            }
            .right{
                order:1;
                width:100%;
                padding:4rem;
                box-sizing:border-box;
                .thumbnail{
                    width:100%;
                    filter:drop-shadow(0px 0px 5px rgba(0,0,0,.2));
                }
            }
            .left{
                width:100%;
                order: 2;
                padding:3rem;
                .project-title{
                    font-size: 3.334rem;
                }
                .project-subtitle{
                    font-size: 1.34rem;
                }
                #related-project,
                #project-category{
                    font-size: 1.389rem;
                }
                .description{
                    font-size: 1.2rem;
                    line-height: 1.6;
                    letter-spacing:${({ theme }) => theme.font.translateLetterSpacing(-20)}
                }
            }
        }
    }
    #editorjs{
        border:1px solid #ddd;
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
const StyledDesignerSummary = styled.li`
    color:#000;
`;


export const StyledProjectContent = styled.div`
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
        display:flex;
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
            color:#000;
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
            left:1rem;
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