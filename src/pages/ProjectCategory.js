import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ArtAndDesignHall from '../components/ArtAndDesignHall';
import axios from 'axios';
import { apiURI } from '../vars/api';
import { Layout } from './Main';
import { parseObjectToQuery } from '../utils/functions';
import Swiper from 'swiper';
import theme from '../themes';
import 'swiper/swiper.min.css';

function ProjectCategory({ selectCategory }) {
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
                featurePost: null,
            },
            {
                id: 3,
                label: "DESIGN BUSINESS",
                featurePost: null,
            },
            {
                id: 4,
                label: "UXUI / NEW MEDIA",
                featurePost: null,
            }
        ],
        currentThumbnail: null,
        allFeatureLoaded: false,
    };
    const backEffectRef = useRef(null);
    const idxRef = useRef(0);
    const overRef = useRef(false);
    const intervalRef = useRef(null);
    const mouseStokerRef = useRef();
    const swiperRef = useRef(null);
    const currentThumbnailExist = useRef(false);
    const wrapperRef = useRef();
    const thumbnailRef = useRef({});
    const [state, setState] = useState(INITIAL_STATE);
    const stokerExpandingSize = '22.3rem';

    const getFeaturePostByCategory = async (categoryId) => {
        const queries = {
            cat: categoryId,
            posts_per_page: 1,
            orderby: "rand",
            nopaging: 0,
            thumbSize: 788
        };
        const categoryFeaturePost = await axios.get(apiURI + "khvd/v1/project" + "?" + parseObjectToQuery(queries));
        setState(s => ({
            ...s,
            categories: s.categories.map(x => {
                if (x.id === categoryId) {
                    return {
                        ...x,
                        thumbnail: categoryFeaturePost.data.posts[0].thumbnail_small
                    };
                } else {
                    return x;
                }
            }),
        }));
        return categoryFeaturePost.data.posts[0];
    }

    const handleResizeEvent = (event) => {
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
        backEffectRef.current.style.width = stokerExpandingSize;
        backEffectRef.current.style.height = stokerExpandingSize;
        const currSlide = swiper.slides[swiper.activeIndex];
        const currCategory = state.categories.find(x => x.id === currSlide.dataset?.catidx * 1);
        setThumbnailImage(currCategory?.thumbnail);
    }
    const handleSwiper = () => {
        if (!state.allFeatureLoaded) return;
        if (swiperRef.current === null) {
            const option = {
                direction: 'horizontal',
                loop: true,
                slidesPerView: "auto",
                centeredSlides: true,
                on: {
                    slideChangeTransitionStart,
                    slideChangeTransitionEnd
                }
            };
            swiperRef.current = new Swiper(".categories", option);
        }
    }

    const setThumbnailImage = (src) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            setState(s => ({
                ...s,
                currentThumbnail: src,
            }));
        }
    }

    useEffect(() => {
        handleResizeEvent();
        window.addEventListener("resize", handleResizeEvent);
        return () => {
            window.removeEventListener('resize', handleResizeEvent);
        }
    }, [state.allFeatureLoaded]);

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
    }, []);

    useEffect(() => {
        // 그래픽 디자인 2, 디자인 비즈니스 3, 뉴미디어 4
        state.categories.forEach((x, i, arr) => {
            const curr = getFeaturePostByCategory(x.id).then((post) => {
                const image = new Image();
                image.src = post.thumbnail_small;
                image.onload = () => {
                    if (!currentThumbnailExist.current) {
                        setState(s => ({
                            ...s,
                            currentThumbnail: post.thumbnail_small,
                        }));
                    }
                }
            });
        });
    }, []);

    useEffect(() => {
        const filter = state.categories.filter(x => !x.thumbnail);
        if (filter.length === 0) {
            setState(s => ({
                ...s,
                allFeatureLoaded: true,
            }));
        }
    }, [state.categories]);

    useEffect(() => {
        if (intervalRef.current === null && state.allFeatureLoaded) {
            intervalRef.current = setInterval(() => {
                idxRef.current++;
                const thumb = state.categories[idxRef.current % state.categories.length].thumbnail;
                if (!overRef.current) {
                    setState(s => ({
                        ...s,
                        currentThumbnail: thumb,
                    }));
                }
            }, 8000);
        }
    }, [state.allFeatureLoaded]);

    return (
        <ProjectCategoryLayout ref={wrapperRef}>
            <div className="page-title">
                <div className="bold">PROJECTS</div>
                <div>전시작품</div>
            </div>
            <ArtAndDesignHall image={state.currentThumbnail} />
            <div className="categories-container">
                <div className="categories">
                    <div className="swiper-wrapper category-btn-wrap">
                        {state.categories
                            .map((x) => <CategoriesBtn
                                className="swiper-slide"
                                data-catidx={x.id}
                                onClick={() => {
                                    selectCategory(x.id);
                                }}
                                onMouseEnter={() => {
                                    if (swiperRef.current !== null) return;
                                    overRef.current = true;
                                    mouseStokerRef.current.style.width = stokerExpandingSize;
                                    mouseStokerRef.current.style.height = stokerExpandingSize;
                                    setThumbnailImage(x.thumbnail);
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
            <div id="mouse-stoker" ref={mouseStokerRef} />
        </ProjectCategoryLayout>
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