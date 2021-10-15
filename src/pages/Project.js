import axios from 'axios';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Loading from '../components/Loading';
import { apiURI } from '../vars/api';
import { StyledEditWork, StyledProjectContent } from './dashboard/EditWork';

function ProjectContainer({ data, post_data }) {
    console.log(post_data);
    const INITIAL_STATE = {
        open: false,
    }
    const [state, setState] = useState(INITIAL_STATE);
    return (
        <StyledProjectContainer className={[(state.open && "open")].join(" ")}>
            <StyledProjectCover className={[(state.open && "open")].join(" ")}>
                <div className="thumbnail-background-image-wrapper" dangerouslySetInnerHTML={{ __html: `<div class="thumbnail-background-image" style="background-image:url('${post_data.thumbnail}')" />` }}></div>
                <div className="title-container">
                    <h1>{data.title.rendered}</h1>
                    <div className="designer-list">
                        {post_data.designerList.map((x, i) => x.name).join(", ")}
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
            {state.open && <div className="project-wrap">
                <div className="work-meta">
                    <div className="flex">
                        <div className="left">
                            <h3 className="project-title">{data.title.rendered}</h3>
                            <div className="description">
                                {post_data.project_description}
                            </div>
                            <div>
                                <h2 className="desinger-section-title">Designer</h2>
                                <ul className="designer-list">
                                    {post_data.designerList.map((x, i) => <li>{x.name}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="right">
                            <div className={["thumbnail"].join(" ")} dangerouslySetInnerHTML={{ __html: `<div class="thumbnail-image" style="background-image:url('${post_data.thumbnail}')" />` }}></div>
                        </div>
                    </div>
                </div>
                <StyledProjectContent>
                    {post_data.editorOutput.blocks.map((x, i) => {
                        switch (x.type) {
                            case "paragraph":
                                return <p>{x.data?.text}</p>;
                            case "image":
                                const classList = ["cdx-image-wrapper", (x.data?.centered ? "centered" : null), (x.data?.stretched ? "stretched" : null)];
                                return <div className={classList.join(" ")} dangerouslySetInnerHTML={{ __html: `<img src='${x.data?.src}' />` }}></div>;
                            case "embed":
                                return <div className={"cdx-embed-wrapper"}>
                                    <div className={"iframe-wrapper"}>
                                        <iframe src={x.data.src} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>;
                            default:
                                return;
                        }
                    })}
                </StyledProjectContent>
            </div>}
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
                const res = await axios.get(apiURI + `wp/v2/posts/${params.id}`);
                const postData = JSON.parse(res.data.post_content_no_rendered);
                setState(s => produce(s, draft => {
                    draft.data = res.data;
                    draft.post_data = postData;
                    draft.loading = false;
                }));
            })();
        }
    }, [state.loading]);
    if (state.loading) return <Loading></Loading>
    return (
        <ProjectContainer data={state.data} post_data={state.post_data} />
    );
}

export default Project;

const StyledProjectCover = styled.div`
    background-size:cover;
    background-position:center;
    display:flex;
    position:absolute;
    justify-content:center;
    align-items:center;
    top:0;
right:0;
left:0;
bottom:0;
    z-index:2;
    box-sizing:border-box;
    transition:transform 1s ease-in-out;
    .thumbnail-background-image-wrapper{
        position:absolute;
        left:0;
        top:0;
        bottom:0;
        right:0;
        width:100%;
        height:100%;
        .thumbnail-background-image{
            position:absolute;
            left:0;
            top:0;
            bottom:0;
            right:0;
            width:100%;
            height:100%;
            background-size:cover;
        }
    }
    .title-container{
        position:relative;
        text-align:center;
        display:flex;
        flex-direction: column;
        z-index:3;
        h1{
            color:#fff;
            font-size:80px;
        }
        .designer-list{
            font-size:25px;
            color:#fff;
        }
    }
    &.open{
        transform-origin:center top;
        transform:rotateX(-90deg);
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
    max-height:100%;
    &.open{
        overflow-y:auto;
        .project-wrap{
            transform:scale(1);
        }
    }
    .project-wrap{
        transition:transform 1s ease-in-out;
        transform:scale(0.8);
        box-sizing:border-box;
        font-family: NanumSquare;
        max-width: 1280px;
        padding-top: 189px;
        margin:0 auto;
        .work-meta{
            .left{
                .project-title{
                    border:0;
                    padding:0;
                    margin-top:0;
                }
                .description{
                    border:0;
                    margin-bottom:50px;
                    height:auto;
                }
                .desinger-section-title{
                    margin-bottom:50px;
                }
            }
            .right{
                .thumbnail{
                    border:0;
                    .thumbnail-image{
                        position:absolute;
                        left:0;
                        top:0;
                        bottom:0;
                        right:0;
                        background-size: cover;
                        background-position:center;
                    }
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
