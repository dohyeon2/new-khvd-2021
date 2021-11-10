import axios from 'axios';
import produce from 'immer';
import React, { useDebugValue, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useGlobal from '../hook/useGlobal';
import styled from 'styled-components';
import Loading from '../components/Loading';
import { apiURI } from '../vars/api';
import Footer from '../components/Footer';
import { StyledEditWork, StyledProjectContent } from './dashboard/EditWork';
import theme from '../themes';
import { getColorBrightness } from '../utils/functions';

function getProtocolURL(URL) {
    const reg = new RegExp(/^http/);
    if (URL.match(reg) === null) {
        return "http://" + URL;
    } else {
        return URL;
    }
}


function ProjectContainer({ data }) {
    const { setGlobal } = useGlobal();
    const INITIAL_STATE = {
        open: false,
        popup: false,
    }
    const [state, setState] = useState(INITIAL_STATE);
    useEffect(() => {
        setGlobal({ footer: false });
        setGlobal({ appbarStyle: 'project' });
        return () => {
            setGlobal({ footer: true });
            setGlobal({ appbarStyle: null });
        }
    }, []);

    useEffect(() => {
        console.log(getColorBrightness(data.backgorund_color));
        setGlobal({ appbarBrightness: getColorBrightness(data.backgorund_color) });
        return () => {
            setGlobal({ appbarBrightness: null });
        }
    }, [data]);

    return (
        <StyledProjectContainer className={[(state.open && "open")].join(" ")} style={{
            backgroundColor: data.backgorund_color,
            color: data.text_color,
            overflowY: ((state.popup !== false || !state.open) ? "hidden" : null)
        }}>
            <div className="project-wrap">
                <div className="work-meta">
                    <div className="flex">
                        <div className="left">
                            <h3 className="project-title">{data.title}</h3>
                            <h4 className="project-category" style={{
                                color: data.feature_color,
                            }}>{data.category_name}</h4>
                            <div className="description">
                                {data.description}
                            </div>
                            <div>
                                <h2 className="desinger-section-title" style={{
                                    color: data.feature_color,
                                }}>Designer</h2>
                                <ul className="designer-list">
                                    {data.designer_list.map((x, i) => <li>
                                        <div className="name">{x.name}</div>
                                        {/* <div className="line">{x.common.question_4.value}</div> */}
                                    </li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="right">
                            <div
                                className={["thumbnail"].join(" ")}
                                style={{ backgroundImage: `url('${data.thumbnail}')` }}
                                onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        popup: data.thumbnail,
                                    }));
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                <StyledProjectContent>
                    {data.editor_output.blocks.map((x, i) => {
                        if (x.data === false) return null;
                        switch (x.type) {
                            case "paragraph":
                                return <p dangerouslySetInnerHTML={{ __html: x.data?.text.replace(`">`, '" target="_blank">') }}></p>;
                            case "image":
                                const classList = ["cdx-image-wrapper", (x.data?.centered ? "centered" : null), (x.data?.stretched ? "stretched" : null)];
                                return <div className={classList.join(" ")}><img src={x.data?.src} onClick={() => {
                                    if (x.data?.href) {
                                        window.open(getProtocolURL(x.data?.href));
                                    } else {
                                        setState(s => ({
                                            ...s,
                                            popup: x.data?.src,
                                        }));
                                    }
                                }} /></div>;
                            case "book":
                                return <div className={"cdx-embed-wrapper"}>
                                    <div className={"iframe-wrapper"}>
                                        <iframe src={x.data.src} height="800" style={{
                                            width: "100%",
                                            maxWidth: "100%",
                                            border: 0
                                        }}></iframe>
                                    </div>
                                </div>;
                            case "embed":
                                return <div className={"cdx-embed-wrapper"}>
                                    <div className={"iframe-wrapper"} style={
                                        {
                                            width: `${x.data.width}%`
                                        }
                                    }>
                                        <iframe src={x.data.src} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>;
                            default:
                                return;
                        }
                    })}
                </StyledProjectContent>
            </div>
            <StyledProjectCover className={[(state.open && "open")].join(" ")} style={{ backgroundImage: `url(${data.thumbnail})` }}>
                <div className="title-container">
                    <h1>{data.title}</h1>
                    <h2>{data.subtitle}</h2>
                    <div className="designer-list">
                        {data.designer_list.map((x, i) => x.name).join(", ")}
                    </div>
                </div>
                <button className="open-button" onClick={() => {
                    setState(s => ({
                        ...s,
                        open: true,
                    }));
                }}>
                    <img src="/img/open-btn.png" alt="" />
                </button>
            </StyledProjectCover>
            {state.popup && <div className="image-modal">
                <button className="x-btn" onClick={() => {
                    setState(s => ({
                        ...s,
                        popup: false,
                    }));
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                        <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
                    </svg>
                </button>
                <img src={state.popup} alt="" />
            </div>}
            <Footer />
        </StyledProjectContainer >
    )
}

function Project({ match }) {
    const params = useParams();
    const initialState = {
        loading: true,
        data: null,
        post_data: null,
        error: false,
    };
    const [state, setState] = useState(initialState);
    useEffect(() => {
        if (state.loading) {
            (async () => {
                const res = await axios.get(apiURI + `khvd/v1/project/${params.id}`);
                setState(s => produce(s, draft => {
                    draft.data = res.data;
                    draft.loading = false;
                }));
            })();
        }
    }, [state.loading]);
    if (state.loading) return <Loading></Loading>
    return (
        <ProjectContainer data={state.data} />
    );
}

export default Project;

const StyledProjectCover = styled.div`
    background-size:cover;
    background-position:center;
    background-color:#000;
    display:flex;
    position:absolute;
    justify-content:center;
    align-items:center;
    top:0;
    right:0;
    left:0;
    bottom:0;
    z-index:9;
    box-sizing:border-box;
    transform:scale(1) rotateX(0deg);
    transition:transform 1s ease-in-out;
    a{
        color:unset !important;
    }
    .title-container{
        position:relative;
        text-align:center;
        display:flex;
        flex-direction: column;
        z-index:3;
        h1{
            color:#fff;
            font-size:4.5rem;
            margin-bottom:1.67rem;
            line-height: 1;
        }
        h2{
            margin-bottom:1.56rem;
            font-size:1.67rem;
            color:#fff;
        }
        .designer-list{
            font-size:1.38rem;
            color:#fff;
        }
    }
    &.open{
        transform-origin:center top;
        transform:scale(1) rotateX(-90deg);
    }
    &::before{
        content:"";
        display: block;
        background-color:rgba(0,0,0,0.5);
        position:absolute;
        left:0;
        top:0;
        bottom:0;
        right:0;
        z-index:2;
    }
    .open-button{
        cursor:pointer;
        position:absolute;
        bottom:0;
        z-index:3;
        background:transparent;
        padding:0;
        margin:0;
        border:0;
        left:50%;
        transform:translate(-50%,0);
    }
`;

const StyledProjectContainer = styled(StyledEditWork)`
    a{
        color:unset !important;
    }
    max-height:100%;
    position:relative;
    .cdx-image-wrapper{
        img{
            cursor: pointer;
        }
    }
    &.open{
        overflow-y:auto;
    }
    .image-modal{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        z-index:99;
        background-color:rgba(0,0,0,.8);
        overflow-y:auto;
        text-align:center;
        .x-btn{
            background-color:transparent;
            border:0;
            position:fixed;
            top:2rem;
            right:2rem;
            filter:drop-shadow(0px 0px 3px rgba(0,0,0.5));
            cursor:pointer;
            path{
                fill:#fff;
            }
        }
        img{
            max-width:1800px;
            width:calc(100% - 4rem);
            margin:2rem;
        }
    }
    .project-wrap{
        position:relative;
        z-index:1;
        box-sizing:border-box;
        max-width: 1280px;
        @media screen and (max-width:1440px){
            max-width: 1080px;
        }
        @media screen and (min-width:${({ theme }) => theme.breakPoints.m + 1}px){
            padding-right:4rem;
            padding-left:4rem;
        }
        padding-top: 10.5rem;
        margin:0 auto;
        margin-bottom:11.12rem;
        .work-meta{
            .left{
                margin-right:2.78rem;
                @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
                    margin-right:0;
                    padding:4rem;
                }
                .project-title{
                    border:0;
                    padding:0;
                    margin-top:0;
                }
                .description{
                    border:0;
                    margin-bottom:2.78rem;
                    height:auto;
                    white-space:pre-wrap;
                }
                .project-category{
                    font-size:1.34rem;
                }
                .desinger-section-title{
                    margin-bottom:2.78rem;
                }
                .designer-list{
                    margin:0;
                    padding:0;
                    display:flex;
                    li{
                        padding:0;
                        margin:0;
                        width:50%;
                        font-size:1.12rem;
                        line-height:1.6;
                        margin-bottom:2rem;
                        letter-spacing: ${({ theme }) => theme.font.translateLetterSpacing(20, -20)};
                        .name{
                            font-weight:800;
                        }
                        .line{

                        }
                    }
                }
            }
            .right{
                .thumbnail{
                    background-size: cover;
                    background-position:center;
                    cursor:pointer;
                    img{
                        position:absolute;
                        left:0;
                        top:0;
                        bottom:0;
                        right:0;
                        max-width:100%;
                        max-height:100%;
                        width:auto;
                        height:auto;
                    }
                }
            }
        }
    }
`;
