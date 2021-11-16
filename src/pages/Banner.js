import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import Swiper from 'swiper';
import styled from 'styled-components';
import useGlobal from '../hook/useGlobal';
import images from '../images';
import { uploadFile } from '../api/file';
import { getBanner } from '../api/banner';

function Banner() {
    const { setGlobal } = useGlobal();
    const swiperRef = useRef(null);
    const sideItem = useRef();
    const sideItemDegree = useRef(0);
    const activeIndex = useRef();
    const INITIAL_STATE = {
        loading: true,
        data: null,
        error: null,
    };
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        if (state.loading) {
            getBanner({
                post__not_in: state.data?.posts.map(x => x.ID).join(","),
                orderby: "rand"
            }).then(res => {
                setState(s => ({
                    ...s,
                    loading: false,
                    data: {
                        ...s.data,
                        ...res.data,
                        posts: [
                            ...(s.data?.posts || []),
                            ...res.data.posts,
                        ],
                    },
                }));
                swiperRef.current.update();
                swiperRef.current.slideTo(activeIndex.current);
            }).catch(error => {
                setState(s => ({
                    ...s,
                    loading: false,
                    error: error,
                }));
            });
        }
    }, [state.loading]);

    useEffect(() => {
        if (swiperRef.current === null && !state.loading) {
            const option = {
                direction: 'horizontal',
                slidesPerView: "auto",
                spaceBetween: 50,
                centeredSlides: true,
                grabCursor:true,
                on: {
                    activeIndexChange: (swiper) => {
                        activeIndex.current = swiper.activeIndex;
                        sideItemDegree.current += 20;
                        const deg = sideItemDegree.current;
                        sideItem.current.style.transform = `rotate(${deg}deg)`;
                    },
                    reachEnd: () => {
                        setState(s => ({
                            ...s,
                            loading: true,
                        }));
                    }
                }
            };
            swiperRef.current = new Swiper("#banner-swiper", option);
        }
    }, [state.loading]);

    useEffect(() => {
        setGlobal({
            pageTitle: "Banner Zone",
        });
        return () => {
            setGlobal({
                pageTitle: null,
            });
        }
    }, []);
    const submitImage = () => {
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
            form.append("for", "banner");
            uploadFile(form).then(res => {
                const image = new Image;
                image.src = res.data.url;
                image.onload = () => {
                    setState(s => ({
                        ...s,
                        data: {
                            ...s.data,
                            posts: [
                                { ID: res.data.id, src: res.data.url },
                                ...(s.data?.posts || []),
                            ]
                        }
                    }));
                    swiperRef.current.update();
                    swiperRef.current.slideTo(0);
                    image.remove();
                }
            }).catch(error => {
                if (error.response?.data?.message) {
                    window.alert(error.response?.data?.message);
                }
            });
            input.remove();
        };
    }
    return (
        <BannerLayout>
            <div className="side-item">
                <img ref={sideItem} src={images['banner-side-item.png']} alt="" />
            </div>
            <div className="projector">
                <img src={images['banner-icon.png']} alt="" />
            </div>
            <button className="submit-btn" onClick={submitImage}>
                응원 배너를 등록하여<br />
                졸업하는 친구를 응원해주세요!
                <div>
                    등록하기 ▶
                </div>
            </button>
            <div id="banner-swiper">
                <div className="swiper-wrapper">
                    {state.data?.posts.map(x => <div className="swiper-slide">
                        <img key={x.ID} src={x.src} />
                    </div>)}
                </div>
            </div>
        </BannerLayout>
    );
}

export default Banner;


const BannerLayout = styled(Layout)`
    height:100%;
    display:flex;
    flex-direction: column;
    .submit-btn{
        position:absolute;
        left:calc(5rem + 3vw);
        top:calc(5rem + 3vw);
        z-index:4;
        background-color:${({ theme }) => theme.colors.primary};
        border:0;
        color:#fff;
        padding:1rem;
        cursor: pointer;
        text-align: left;
        line-height:1.4;
        filter:drop-shadow(1px 1px 5px rgba(0,0,0,.5));
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
            left:4rem;
            top:8rem;
        }
        &>div{
            margin-top:1rem;
            text-align:right;
        }
    }
    .projector{
        z-index:3;
        position:absolute;
        bottom:-1rem;
        left:10vw;
        width:15rem;
        filter:drop-shadow(-5rem 5rem 1rem rgba(0,0,0,.5));
        @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
            left:-3rem;
        }
        img{
            width:100%;
        }
    }
    .side-item{
        z-index:2;
        position:absolute;
        top:50%;
        left:0;
        height:100vh;
        transform:translate(-50%,-50%);
        filter:drop-shadow(0px 1rem 1rem rgba(0,0,0,.5));
        @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
            display:none;
        }
        img{
            transition:transform .2s ease-in-out;
            height:100%;
        }
    }
    &::before{
        content:"";
        flex-grow:1;
    }
    &::after{
        content:"";
        flex-grow:1;
    }
    #banner-swiper{
        display:flex;
        height:66vh;
        flex-direction:column;
        background-image: url(${images["banner-bg.png"]});
        background-repeat:repeat-x;
        background-size: auto 100%;
        padding-left:10vw;
        @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
            padding-left:0;
        }
        .swiper-wrapper{
            height:100%;
            padding:8vh 2rem;
            box-sizing:border-box;
            .swiper-slide{
                max-width:100vw;
                width:fit-content;
                height:100%;
                display:flex;
                align-items:center;
                border:1px solid ${({ theme }) => theme.colors.primary};
                background-color:#000;
                img{
                    max-width:100%;
                    max-height:100%;
                }
            }
        }
    }
`;
