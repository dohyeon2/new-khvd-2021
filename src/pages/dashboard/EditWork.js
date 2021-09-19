import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Editor from '../../components/Editor';
import Loading from '../../components/Loading';
import { apiURI } from '../../vars/api';
import axios from 'axios';

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
function DesignerSummary({ data, inSearch }) {
    return (<StyledDesignerSummary className={["designer", (inSearch && "in-search")].join(" ")}>
        <div className="name">
            <div className="korean">{data.name}</div>
            <div className="english"></div>
        </div>
        {inSearch && <div className="student-number">학번</div>}
    </StyledDesignerSummary>);
}

function EditWorkContainer({ data, SearchUserEventHandler }) {
    const initialState = {
        text_color: "#000000",
        backgorund_color: "#ffffff",
    };
    const [state, setState] = useState(initialState);
    const changeColorState = (event) => {
        setState(s => ({
            ...s,
            [event.target.name]: event.target.value,
        }));
    }
    const commonAttr = {
        style: {
            color: state.text_color,
            backgroundColor: state.backgorund_color
        }
    };
    return (<StyledEditWork {...commonAttr}>
        <div className="editor-wrap">
            <div className="work-meta">
                <div className="flex">
                    <div className="left">
                        <input className="project-title" type="text" placeholder="프로젝트 제목" {...commonAttr} />
                        <div className="flex justify-between">
                            <select name="proejct-category" id="project-category" {...commonAttr}>
                                {data?.categories?.map((x, i) => <option key={x.id} value={x.id}>{x.name}</option>)}
                            </select>
                        </div>
                        <textarea className="description" placeholder="작품 설명" {...commonAttr}></textarea>
                        <div>
                            <h2 className="desinger-section-title">Designer</h2>
                            <div className="search-designer-container">
                                <div className="designer-search-input-wrap">
                                    <input type="text" className="search-designer-input" placeholder="이름으로 검색" onInput={SearchUserEventHandler} />
                                </div>
                                <ul className="searched-list">
                                    {data?.designerSearch.data && data?.designerSearch.data.map((x, i) => <DesignerSummary inSearch={true} key={i} data={x}></DesignerSummary>)}
                                </ul>
                            </div>
                            <ul className="designer-list">
                                <li className="designer"></li>
                            </ul>
                        </div>
                    </div>
                    <div className="right">
                        <div className="thumbnail">
                            <div className="dummy" style={{
                                width: 513,
                                height: 725.67
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="colors flex">
                <div className="text-color-wrap color-selector-wrap flex">
                    <label htmlFor="text_color">텍스트 색상</label>
                    <input type="color" name="text_color" id="text_color" value={state.text_color} onInput={changeColorState} />
                    <input type="text" name="text_color" id="text_color_input" value={state.text_color} onInput={changeColorState} />
                </div>
                <div className="background-color-wrap color-selector-wrap flex">
                    <label htmlFor="backgorund_color">배경 색상</label>
                    <input type="color" name="backgorund_color" id="backgorund_color" value={state.backgorund_color} onInput={changeColorState} />
                    <input type="text" name="backgorund_color" id="text_color_input" value={state.backgorund_color} onInput={changeColorState} />
                </div>
            </div>
            <Editor {...commonAttr}></Editor>
        </div>
    </StyledEditWork >)
}

function EditWork({ data }) {
    const initialState = {
        loading: true,
        data: {
            categories: [],
            designerSearch: {
                loading: false,
                data: [],
                error: false,
            },
            designerList: [],
        },
        error: false,
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (state.loading) {
            (async () => {

                //카테고리를 불러옵니다.
                const categories = await axios.get(apiURI + "wp/v2/categories/?exclude=1&_fields=name,id");

                setState(s => ({
                    ...s,
                    loading: false,
                    data: {
                        ...s.data,
                        categories: categories.data,
                    }
                }));

            })();
        }

    }, [state.loading]);

    const SearchUserEventHandler = async (event) => {
        const query = encodeURI(event.target.value);
        if (query === "" || query === null) {
            setState(s => ({
                ...s,
                data: {
                    ...s.data,
                    designerSearch: {
                        ...s.data.designerSearch,
                        loading: false,
                        data: [],
                    }
                }
            }));
            return;
        }
        setState(s => ({
            ...s,
            data: {
                ...s.data,
                designerSearch: {
                    ...s.data.designerSearch,
                    loading: true,
                }
            }
        }));
        const users = await axios.get(apiURI + `wp/v2/users/?search=${query}&has_published_posts=false`);
        setState(s => ({
            ...s,
            data: {
                ...s.data,
                designerSearch: {
                    ...s.data.designerSearch,
                    data: users.data,
                    loading: false,
                }
            }
        }));

    }

    return (
        <>
            <EditWorkContainer data={!state.loading && state.data} SearchUserEventHandler={SearchUserEventHandler} />
            {state.loading && <Loading />}
        </>
    );
}

export default EditWork;