import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { Layout } from "./Main";
import images from '../images';
import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";
import { useHistory, useParams } from "react-router";
import { HorizontalScrollAnimation } from '../components/ScrollAnimation';
import useGlobal from "../hook/useGlobal";
import { getSubFramePercent } from '../utils/functions';
import { LoadingSpinner } from '../components/Loading';
import LottieElement from "../components/LottieElement";
import lotties from '../lotties';
import { isTouchDevice } from "../utils/functions";

function ProjectList({
    slug: slugAttr
}) {
    const history = useHistory();
    const { setGlobal, goTo } = useGlobal();
    const params = useParams();
    const INITIAL_STATE = {
        category: null,
        authors: null,
        projects: [],
        projectLoading: true,
        frames: {
            current: 0,
            maxFrame: 0.1,
            minFrame: 0,
            accFrame: null,
        },
        projectEnd: false,
        projectThumbWidth: null,
        currentProjectIdx: -1,
    };
    const [state, setState] = useState(INITIAL_STATE);
    const INITIAL_QUERIES = {
        paged: 1,
        nopaging: 0,
        thumbSize: 830,
        orderby: "rand",
    };
    const weightRef = useRef();
    const slug = slugAttr || params.categorySlug;
    const [queries, setQueries] = useState(INITIAL_QUERIES);
    const coverFrame = 200;
    const posts = state.projects || [];
    const frameRef = useRef();
    const { currentProjectIdx } = state;
    const { current: frame, minFrame, maxFrame, accFrame } = state.frames;
    const scrollingRef = useRef(false);
    const wholeProjectWithFrameRef = useRef();
    const ProjectThumbWidth = useRef();

    const handleResize = () => {
        if (state.projects.length > 1) {
            const el = document.querySelector(".project-group");
            if (el) {
                const { width: elWidth } = el.getBoundingClientRect();
                wholeProjectWithFrameRef.current = elWidth + (window.innerWidth - elWidth/state.projects.length) / 2;
                setState(s => ({
                    ...s,
                    frames: {
                        ...s.frames,
                        maxFrame: wholeProjectWithFrameRef.current,
                    }
                }));
            }
            const project = document.querySelector('.thumbwrap');
            if (project) {
                const { width: projectWidth } = project.getBoundingClientRect();
                ProjectThumbWidth.current = projectWidth;
            }
        }
    }

    const getTargetPos = (target) => {
        return ProjectThumbWidth.current * target + (window.innerWidth - ProjectThumbWidth.current) / 2
    }

    useEffect(() => {
        axios.get(`${apiURI}khvd/v1/category/${slug}`).then(res => {
            setState(s => ({
                ...s,
                category: res.data,
            }));
            setQueries(s => ({
                ...s,
                cat: res.data.term_id
            }));
        });
    }, []);

    useEffect(() => {
        if (state.category !== null) {
            const author_query = {
                cat: state.category.term_id,
            }
            axios.get(`${apiURI}khvd/v1/author?${parseObjectToQuery(author_query)}`).then(res => {
                setState(s => ({
                    ...s,
                    authors: res.data.authors
                }));
            });
        }
    }, [state.category]);

    useEffect(() => {
        if (state.category !== null && state.projectLoading) {
            axios.get(`${apiURI}khvd/v1/project?${parseObjectToQuery({
                cat: state.category.term_id,
                ...queries,
            })}`).then(res => {
                if (res.data.posts.length > 0) {
                    setState(s => ({
                        ...s,
                        projects: [...s.projects, ...res.data.posts],
                        projectLoading: false,
                    }));
                } else {
                    setState(s => ({
                        ...s,
                        projectEnd: true,
                        projectLoading: false,
                    }));
                }
            });
        }
    }, [state.category, state.projectLoading]);

    useEffect(() => {
        setGlobal({ footer: false });
        setGlobal({ pageTitle: "Project" });
        document.querySelector("#root").style.overflow = 'hidden';
        return () => {
            setGlobal({ footer: true });
            setGlobal({ pageTitle: false });
            document.querySelector("#root").style.overflow = null;
        }
    }, []);

    useEffect(() => {
        handleResize();
    }, [state.projects]);

    useEffect(() => {
        if (wholeProjectWithFrameRef.current) {
            if (wholeProjectWithFrameRef.current * 0.8 < frameRef.current && !state.projectEnd && !state.projectLoading
            ) {
                setQueries(s => ({
                    ...s,
                    paged: s.paged + 1,
                    post__not_in: state.projects.map(x => x.id).join(",")
                }));
                setState(s => ({
                    ...s,
                    projectLoading: true,
                }));
            }
        }
    }, [state.frames.current, state.projects, state.projectLoading, state.projectEnd]);

    useEffect(() => {
        const handleResizeEvent = () => {
            handleResize();
        };
        window.addEventListener("resize", handleResizeEvent);
        return () => {
            window.removeEventListener("resize", handleResizeEvent);
        }
    }, []);
    let categoryTitleHeight = 0;
    if (document.querySelector('.category-title')) {
        categoryTitleHeight = document.querySelector('.category-title').getBoundingClientRect().height;
    }
    const getFramePerPixel = (frame) => {
        return frame;
    }
    return (
        <HorizontalScrollAnimation
            maxFrame={maxFrame}
            minFrame={minFrame}
            accframe={accFrame}
            setScrolling={(scrolling) => {
                if (scrolling !== scrollingRef.current) {
                    scrollingRef.current = scrolling;
                }
            }}
            getFrame={(frame, weight) => {
                frame = frame.toFixed(4);
                frameRef.current = frame;
                weightRef.current = weight;
                setState(s => ({
                    ...s,
                    weight: weight,
                    frames: {
                        ...s.frames,
                        current: Math.min(maxFrame, frame)
                    }
                }));
            }}
        >
            <ProjectListLayout
                style={{
                    backgroundImage: `url(${images['project-background.png']}`
                }}
            >
                <img className="category-sticker" src={images['graphic-design-sticker.png']} style={{
                    transform: `rotate(${frame / 4}deg)`
                }}
                    onClick={() => {
                        setState(s => ({
                            ...s,
                            frames: {
                                ...s.frames,
                                accFrame: getTargetPos(9)
                            }
                        }));
                    }}

                />
                <div className="animation-wrap">

                    <div className="cover">
                        <div className="category-title"
                            style={{
                                transform: `translateY(${- categoryTitleHeight + (categoryTitleHeight * getSubFramePercent(frame, 0, coverFrame, 1))}px)`,
                                opacity: `${1 - (1 * getSubFramePercent(frame, 0, coverFrame, 1))}`
                            }}
                        >
                            {state.category?.meta.english_label}
                        </div>
                        <div className="category-title border"
                            style={{
                                opacity: `${(1 * getSubFramePercent(frame, 0, coverFrame, 1))}`,
                                transform: `translateY(${- categoryTitleHeight + (categoryTitleHeight * getSubFramePercent(frame, 0, coverFrame, 1))}px)`
                            }}
                        >
                            {state.category?.meta.english_label}
                        </div>
                        <div className="author-list"
                            style={{
                                opacity: `${1 - getSubFramePercent(frame, 0, coverFrame, 1)}`
                            }}
                        >
                            {state.authors?.reduce((b, c) => {
                                if (b.find(x => x.ID === c.ID)) {
                                    return b;
                                }
                                const result = [...b, c];
                                result.sort((a, b) => {
                                    if (a.display_name < b.display_name) {
                                        return -1;
                                    }
                                    if (a.display_name > b.display_name) {
                                        return 1;
                                    }
                                    return 0;
                                });
                                return result;
                            }, []).map(x => <div
                                className="author-name"
                                key={x.ID}
                            >
                                {x.display_name.split(" ")[0]}
                            </div>)}
                        </div>
                    </div>

                    <div className="project-group"
                        style={{
                            left: `calc(${window.innerWidth}px - ${getFramePerPixel(frame)}px)`,
                        }}
                    >
                        {posts.map((x, i) => {
                            const el = document.querySelector("#thumb_" + x.id);
                            const weight = (window.innerWidth > 600) ? 0.6 : 0.8;
                            let percent = 1;
                            if (el) {
                                const { width, height, x: left, y: top } = el.getBoundingClientRect();
                                const pos = left + width / 2;
                                percent = weight + getSubFramePercent(pos, window.innerWidth * 0.1, window.innerWidth * 0.4, 1 - weight);
                                percent -= getSubFramePercent(pos, window.innerWidth * 0.6, window.innerWidth * 0.9, 1 - weight);
                                if (window.innerWidth * 0.3 < pos && pos < window.innerWidth * 0.7) {
                                    if (currentProjectIdx !== i) {
                                        setState(s => ({
                                            ...s,
                                            currentProjectIdx: i,
                                        }));
                                    }
                                    el.classList.add("active");
                                } else {
                                    el.classList.remove("active");
                                }
                            }
                            return <div className="thumbwrap">
                                <ProjectThumb
                                    key={x.id}
                                    id={"thumb_" + x.id}
                                    onClick={() => {
                                        goTo(`/project/${slug}/${x.id}`);
                                    }}
                                    thumbnailImage={x.thumbnail_small}
                                    title={x.title}
                                    author={x.designer_list?.map(x => x.name.split(" ")[0]).join(" ")}
                                    infoStyle={{
                                        opacity: (getSubFramePercent(percent, 0.6, 1, 1))
                                    }}
                                    thumbStyle={{
                                        transform: `scale(${percent})`
                                    }}
                                />
                            </div>
                        }
                        )}
                    </div>

                </div>
                <div className="state">
                    <div className={"end-of-list" + ((state.projectEnd && currentProjectIdx >= state.projects.length - 1) ? " active" : "")}
                        onClick={() => {
                            goTo('/project');
                        }}
                    >
                        더 이상 불러올 작품이 없습니다.<br />
                        <small>다른 카테고리 보러 가기</small>
                    </div>
                    <LoadingSpinner
                        className={"loading-spinner" + (state.projectLoading ? " active" : "")}
                        scale={1.5}
                    />
                    {(!state.projectLoading && (state.frames.current < coverFrame)) && <LottieElement
                        lottieOption={{
                            animationData: (isTouchDevice() ? lotties['swipe.json'] : lotties['scroll.json']),
                            initialSegment: (isTouchDevice() && [60, 121])
                        }}
                    />}
                </div>
            </ProjectListLayout>
        </HorizontalScrollAnimation>
    );
}

function ProjectThumb({
    thumbnailImage,
    title,
    author,
    infoStyle,
    thumbStyle,
    onClick,
    id,
}) {
    const INITIAL_STATE = {
        imageLoading: true,
    };
    const [state, setState] = useState(INITIAL_STATE);
    useEffect(() => {
        const image = new Image();
        try {
            image.src = thumbnailImage;
            image.onload = () => {
                setState(s => ({
                    ...s,
                    imageLoading: false,
                }))
            }
        } catch (e) {

        }
        return () => {
            if (image) {
                image.onload = null;
            }
        }
    }, [thumbnailImage]);
    const classList = ["project-thumb"];
    if (state.imageLoading) {
        classList.push("loading");
    }
    return (
        <StyledProjectThumb
            id={id}
            onClick={onClick}
            className={classList.join(" ")}
            style={{
                backgroundImage: !state.imageLoading && `url(${thumbnailImage})`,
                ...thumbStyle
            }}
        >
            <div className="info" style={infoStyle}>
                <div className={"project-title" + (title ? "" : " loading")}>
                    {title}
                </div>
                <div className={"project-author" + (author ? "" : " loading")}>
                    {author}
                </div>
            </div>
        </StyledProjectThumb>
    );
}

export default ProjectList;

const ProjectListLayout = styled(Layout)`
    width:100%;
    height:100%;
    overflow:hidden;
    .thumbwrap{
        box-sizing:border-box;
        padding:0 10vw;
    }
    .category-sticker{
        position:absolute;
        top:4.16rem;
        z-index:2;
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
            top:unset;
            width:15rem;
            bottom:0;
            right:0;
        }
    }
    .state{
        position:fixed;
        bottom:0;
        width: 100%;
        display:flex;
        justify-content:center;
        padding:1rem;
        .end-of-list{
            cursor:pointer;
            line-height: 1.4;
            text-align:center;
            color: #fff;
            animation:shimmer 0.7s ease-in-out alternate infinite;
            display:none;
            @keyframes shimmer{
                0%{
                    opacity:0.3;
                }
                100%{
                    opacity:1;
                }
            }
            &.active{
                display:block;
            }
        }
        .lottie-element{
            height:3.34rem;
        }
        .loading-spinner{
            opacity:0;
            transition:opacity .2s ease-in-out;
            position:absolute;
            bottom:1rem;
            left:50%;
            transform:translateX(-50%);
            &.active{
                opacity:1;
            }
        }
    }
    .test{
        position:fixed;
        top:0;
        left:0;
        background-color: rgba(0,0,0,.5);
        color: #fff;
        padding:1rem;
    }
    .animation-wrap{
        overflow:hidden;
        width:100%;
        height:100%;
        position:sticky;
        top:0;
    }
    .project-group{
        display:flex;
        position: absolute;
        z-index:2;
        height:100%;
        width:auto;
        top:0;
        align-items:center;
    }
    .cover{
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        color:#fff;
        justify-content:center;
        align-items:center;
        position:relative;
        .category-title{
            position:absolute;
            font-size:4.45rem;
            max-width:100vw;
            text-align:center;
            word-break:keep-all;
            font-family:${({ theme }) => theme.font.family.englishBold};
            top:50%;
            &.border{
                color:#fff;
                opacity:0.6;
                @supports (-webkit-text-stroke:2px #fff) {
                    color:transparent;
                    opacity:1;
                    -webkit-text-stroke:2px #fff; 
                }
            }
        }
        .author-list{
            position: relative;
            top:6.62rem;
            max-width:44.4rem;
            width:100vw;
            margin:0 2rem;
            display:flex;
            flex-direction:row;
            font-size:1.12rem;
            justify-content:center;
            flex-wrap:wrap;
            .author-name{
                line-height:2.3rem;
                margin:0.2rem;
            }
        }
    }
`;

const StyledProjectThumb = styled.div`
    position: relative;
    max-width:578px;
    width:30vw;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
        width:50vw;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
        width:70vw;
    }
    background-size:cover;
    background-color: #000;
    background-position:center;
    cursor:pointer;
    &.loading{
        content:"loading";
        display:flex;
        justify-content: center;
        align-items:center;
        animation:loadingPlaceholder ease-in-out infinite alternate 1s;
        background-size: 100%;
    }
    &:after{
        content:"";
        display:block;
        padding-top:143%;
    }
    .info{
        opacity: 0;
        position:absolute;
        bottom:0;
        left:calc(100% + 2.62rem);
        width:100%;
        max-width:16rem;
        color: #fff;
        font-size:1.2rem;
        word-break:keep-all;
        display:flex;
        flex-direction: column;
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
            left:0;
            bottom:unset;
            top:calc(100% + 1.2rem);
        }
        .project-title{
            width:100%;
            margin-bottom:0.278rem;
            font-weight: 700;
        }
        &>div.loading{
            width:300px;
            height:1.12rem;
            animation:loadingPlaceholder ease-in-out infinite alternate 1s; 
        }
        
    }
    @keyframes loadingPlaceholder{
        0%{
            background-color: #999;
        }
        100%{
            background-color: #333;
        }
    }
`;