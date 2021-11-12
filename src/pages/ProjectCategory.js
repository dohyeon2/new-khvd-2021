import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ArtAndDesignHall from '../components/ArtAndDesignHall';
import axios from 'axios';
import { apiURI } from '../vars/api';
import { Layout } from './Main';
import { parseObjectToQuery } from '../utils/functions';
import Swiper from 'swiper';
import theme from '../themes';
import 'swiper/swiper.min.css';
import useGlobal from '../hook/useGlobal';
import { useHistory } from 'react-router';

function ProjectCategory() {
    const history = useHistory();
    const { goTo } = useGlobal();
    const INITIAL_STATE = {
        eventBinded: false,
        mouseStokerSize: {
            width: 0,
            height: 0,
        },
        mouseStokerPosition: {
            x: 0,
            y: 0,
        },
        categories: [
            {
                id: 2,
                label: "GRAPHIC DESIGN",
                slug: "graphic-design",
            },
            {
                id: 3,
                label: "DESIGN BUSINESS",
                slug: "design-business"
            },
            {
                id: 4,
                label: "UXUI / NEW MEDIA",
                slug: "uxui-newmedia"
            }
        ],
        projectEndOfList: false,
        currentThumbnail: null,
        thumbnailList: [],
        currentThumbnailIndex: 0,
        seed: 0,
    };
    const INITIAL_THUMBNAIL_COUNT = 1;
    const STOKER_EXPAND_SIZE = '22.3rem';
    const THUMBNAIL_LOOPING_TERM = 4000;
    const backEffectRef = useRef(null);
    const swiperRef = useRef(null);
    const overRef = useRef(false);
    const mouseStokerRef = useRef();
    const wrapperRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);

    const selectCategory = (slug) => {
        goTo(history.location.pathname + "/" + slug);
    }

    /**
     * 섬네일과 함께 프로젝트를 가져오는 함수
     * @param {int} count : 가져올 개수
     */
    const getProjectsWithThumbnail = useCallback(async (count = 1) => {
        const queries = {
            posts_per_page: count,
            orderby: "rand",
            nopaging: 0,
            category__not_in:5,
            post__not_in: state.thumbnailList.map(x => x.ID).join(","),
            thumbSize: 788,
            fields: "thumbnail"
        };
        const posts = await axios.get(apiURI + "khvd/v1/project" + "?" + parseObjectToQuery(queries));
        if (posts.data.posts.length === 0)
            setState(s => ({
                ...s,
                projectEndOfList: true,
            }));
        return posts;
    }, [state.thumbnailList]);

    //윈도우 리사이즈 이벤트 핸들러
    const handleResizeEvent = () => {
        if (window.innerWidth < theme.breakPoints.m) {
            backEffectRef.current.style.display = "block";
            handleSwiper();
        } else {
            backEffectRef.current.style.display = "none";
            if (swiperRef.current) {
                swiperRef.current.destroy();
                swiperRef.current = null;
            }
        }
    }

    const slideChangeTransitionStart = () => {
        backEffectRef.current.style.width = '0px';
        backEffectRef.current.style.height = '0px';
    }
    const slideChangeTransitionEnd = (swiper) => {
        backEffectRef.current.style.width = STOKER_EXPAND_SIZE;
        backEffectRef.current.style.height = STOKER_EXPAND_SIZE;
    }

    const swiperEvents = {
        slideChangeTransitionStart,
        slideChangeTransitionEnd,
    }

    /**
     * 스와이퍼 init하고 조정하는 함수
     */
    const handleSwiper = () => {
        if (swiperRef.current === null) {
            const option = {
                direction: 'horizontal',
                loop: true,
                slidesPerView: "auto",
                centeredSlides: true,
                on: swiperEvents,
            };
            swiperRef.current = new Swiper(".categories", option);
            const buttons = document.getElementsByClassName('swiper-slide-duplicate');
            for (let i = 0, len = buttons.length; i < len; i++) {
                buttons[i].addEventListener("click", (event) => {
                    goTo("/project/" + event.currentTarget.dataset.catslug);
                });
            }
        }
    }

    /**
     * 섬네일 이미지를 loading하고, 완료되면 상태에 적용하는 함수
     * @param {string} src : 섬네일 이미지 주소;
     */
    const setThumbnailImage = (src) => new Promise((resolve) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            resolve(src, image);
        }
    });

    //윈도우 리사이즈 이벤트 핸들러
    useEffect(() => {
        handleResizeEvent();
        window.addEventListener("resize", handleResizeEvent);
        return () => {
            window.removeEventListener('resize', handleResizeEvent);
        }
    }, []);

    //마우스 스토커 위치 조정 이벤트 핸들러
    useEffect(() => {
        if (state.eventBinded === false) {
            wrapperRef.current.addEventListener('mousemove', (e) => {
                if (swiperRef.current !== null) return;
                mouseStokerRef.current.style.left = e.x + "px";
                mouseStokerRef.current.style.top = e.y + "px";
            });
            setState(s => ({
                ...s,
                eventBinded: true
            }));
        }
    }, [state.eventBinded]);

    //최초 로딩 시 thumbnail 불러오기
    useEffect(() => {
        if (state.thumbnailList.length !== 0) return;
        getProjectsWithThumbnail(INITIAL_THUMBNAIL_COUNT).then((res) => {
            const { posts } = res.data;
            setState((s) => ({
                ...s,
                thumbnailList: [...s.thumbnailList, ...posts]
            }));
        });
    }, []);

    //섬네일 루핑 핸들러
    useEffect(() => {
        if (state.thumbnailList.length === 0) return;
        const thumbnailList = [...state.thumbnailList];
        const thumbnail = thumbnailList.pop();
        thumbnailList.unshift(thumbnail);
        const src = thumbnail.thumbnail;
        setThumbnailImage(src).then((src, image) => {
            setState(s => {
                return {
                    ...s,
                    currentThumbnail: src,
                }
            });
            setTimeout(() => {
                if(state.projectEndOfList){
                    setState(s=>({
                        ...s,
                        seed:s.seed + 1
                    }));
                }else{
                    const posts = getProjectsWithThumbnail(1).then((posts) => {
                        setState(s => {
                            return {
                                ...s,
                                thumbnailList: [...thumbnailList, ...posts.data.posts]
                            }
                        });
                    });
                }
            }, THUMBNAIL_LOOPING_TERM);
        });
    }, [state.thumbnailList, state.seed, state.projectEndOfList]);

    const { currentThumbnail, categories } = state;
    return (
        <ProjectCategoryLayout ref={wrapperRef}>
            <div className="page-title">
                <div className="bold">PROJECTS</div>
                <div>전시작품</div>
            </div>
            <ArtAndDesignHall image={currentThumbnail} />
            <div className="categories-container">
                <div className="categories">
                    <div className="swiper-wrapper category-btn-wrap">
                        {categories
                            .map((x) => <CategoriesBtn
                                className="swiper-slide"
                                data-catidx={x.id}
                                data-catslug={x.slug}
                                onClick={() => {
                                    selectCategory(x.slug);
                                }}
                                onMouseEnter={() => {
                                    if (swiperRef.current !== null) return;
                                    overRef.current = true;
                                    mouseStokerRef.current.style.width = STOKER_EXPAND_SIZE;
                                    mouseStokerRef.current.style.height = STOKER_EXPAND_SIZE;
                                }}
                                onMouseLeave={() => {
                                    if (swiperRef.current !== null) return;
                                    overRef.current = false;
                                    mouseStokerRef.current.style.width = '0';
                                    mouseStokerRef.current.style.height = '0';
                                }}
                                key={x.id}>
                                {x.label}
                            </CategoriesBtn>)}
                    </div>
                </div>
                <div id="back-effect" ref={backEffectRef}></div>
            </div>
            <div id="mouse-stoker" ref={mouseStokerRef} style={{ width: 0, height: 0 }} />
        </ProjectCategoryLayout >
    );
}

export default ProjectCategory;

const ProjectCategoryLayout = styled(Layout)`
    display:flex;
    align-items:center;
    padding:4rem;
    box-sizing:border-box;
    justify-content:center;
    .categories-container{
        position:relative;
        flex-shrink:0;
        flex-grow:0;
    }
    #back-effect,
    #mouse-stoker{
        position:absolute;
        transition:width 0.2s ease-in-out, height 0.2s ease-in-out;
        background-color:${({ theme }) => theme.colors.primary};
        border-radius:999rem;
        transform:translate(-50%,-50%);
        pointer-events:none;
    }
    #back-effect{
        z-index:1;
        left:50%;
        top:50%;
    }
    .swiper-wrapper{
        position:relative;
        z-index:2;
        display:flex;
        flex-direction:column;
        margin:-3.5rem 0;
        margin-left:3.9rem;
    }
    .page-title{
        display:none;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
        flex-wrap:wrap;
        flex-direction:column;
        .page-title{
            display:block;
            position:absolute;
            top:9.7rem;
            right:2.5rem;
            text-align: right;
            color:#fff;
            font-size:1.8rem;
            z-index:3;
            .bold{
                font-family: ${({ theme }) => theme.font.family.englishBold};
            }
        }
        .categories-container{
            width:100%;
        }
        .andhall-wrap{
            width:100%;
            z-index:2;
            margin-bottom:4rem;
        }
        .swiper-wrapper{
            flex-direction:row;
            margin:0;
        }
        .swiper-slide{
            text-align:center;
            width:65vw;
            &.swiper-slide-active{
                color: #fff;
                -webkit-text-stroke:unset;
            }
        }
    }
`;

const CategoriesBtn = styled.button`
    margin:3.5rem 0;
    border:0;
    padding:0;
    outline:0;
    background-color:transparent;
    font-size:2.23rem;
    text-align:left;
    white-space:nowrap;
    font-family: ${({ theme }) => theme.font.family.englishBold};
    color:#fff;
    opacity:0.6;
    cursor:pointer;
    @supports (-webkit-text-stroke:2px #fff) {
        color:transparent;
        opacity:1;
        -webkit-text-stroke:2px #fff; 
    }
    &:hover{
        color:#fff;
        opacity:1;
        -webkit-text-stroke:0px #fff; 
    }
`;