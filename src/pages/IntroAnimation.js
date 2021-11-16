import React, { useEffect, useRef, useState } from 'react';
import LottieElement from '../components/LottieElement';
import lotties from '../lotties';
import { Layout } from '../components/Layout';
import styled from 'styled-components';
import images from '../images';
import useGlobal from '../hook/useGlobal';

function IntroAnimation() {
    const { setGlobal } = useGlobal();
    const [state, setState] = useState({
        seed: 1,
        animationOn: false,
    });
    const lottieElement = useRef();
    useEffect(() => {

    }, []);
    const getLottie = (lottie) => {
        lottieElement.current = lottie;
        setTimeout(() => {
            lottie.play();
            lottie.onComplete = (e) => {
                lottie.playSegments([67, 264], true);
            }
        }, 1000);
    }
    useEffect(() => {
        const lottie = lottieElement.current;
        setTimeout(() => {
            lottie.play();
            lottie.onComplete = (e) => {
                lottie.playSegments([67, 264], true);
            }
            setState(s => ({
                animationOn: true,
            }));
        }, 1000);
    }, [global.animation]);
    return (
        <AnimationLayout>
            <div className="lottie-wrap">
                <LottieElement
                    getLottie={getLottie}
                    lottieOption={{
                        animationData: lotties['poster.json'],
                        renderer: 'canvas',
                        loop: false,
                        autoplay: false,
                        preserveAspectRatio: 'xMidYMid meet',
                    }}
                />
            </div>
            {state.animationOn && <div className="description">
                <img className="logo" src={images['unboxing.png']} alt="" />
                <div className="text-wrap">
                    <div className="text text-1">
                        경희대학교 시각디자인학과<br />
                        온·오프라인 졸업전시회<br />
                        언박싱 &lt;UNBOXING&gt;
                    </div>
                    <div className="text">
                        2021.11.<br />
                        17.WED - 22.MON
                    </div>
                </div>
                <img className="enterbtn" src={images['enter.png']} alt=""
                    onClick={() => {
                        setGlobal({ intro: false });
                    }}
                />
            </div>}
        </AnimationLayout>
    );
}

export default IntroAnimation;

const AnimationLayout = styled(Layout)`
    min-height:unset;
    display:flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .description{
        width:100%;
        position:absolute;
        right:0;
        opacity:0;
        animation:opacity 1s ease-in-out 4s forwards normal;
        display:flex;

        bottom:0;
        box-sizing: border-box;
        padding-bottom:8.8vw;
        flex-direction: column;
        align-items:flex-end;
        padding-right:6.1rem; 
        .logo{
            max-width:38.66rem;
            width:100%;
            margin-bottom:3.6rem;
            filter:drop-shadow(0px 0px 10px rgba(0,0,0,.5));
        }
        .text-wrap{
            margin-right:19.7rem;
        }
        .text{
            color:#fff;
            font-size:1.67rem;
            text-align:right;
            line-height:2.22rem;
            letter-spacing:${({ theme }) => theme.font.translateLetterSpacingRem(1.67, -20)};
            filter:drop-shadow(0px 0px 5px rgba(0,0,0,.8));
        }
        .text-1{
            margin-bottom:1.38rem;
        }
        .enterbtn{
            position:absolute;
            right:-2.7vw;
            cursor:pointer;
            bottom:8.8vw;
            width:23.6rem;
        }
        @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
            background: rgb(0,0,0);
            align-items:flex-end;
            background: linear-gradient(0deg, rgba(27,15,71,1) 0%, rgba(27,15,71,0) 100%);
            padding-right:unset;
            padding:1.5rem;
            .text-wrap{
                margin-right:unset;
                width:100%;
                .text{
                    text-align:right;
                }
            }
            .enterbtn{
                margin-top:3rem;
                position:relative;
                right:unset;
                bottom:unset;
            }
        }
    }
    .lottie-wrap{
        position:relative;
        width:1920px;
        height:100vh;
        animation:slide 1s ease-in-out 4s forwards normal;
    }
    .lottie-element{    
        flex-shrink:0;
        width:1920px;
        height:100vh;
    }
    @keyframes slide {
        0%{
            left:0;
        }
        100%{
            left:-20%;
        }
    }
    @keyframes opacity {
        0%{
            opacity:0;
        }
        100%{
            opacity:1;
        }
    }
`;