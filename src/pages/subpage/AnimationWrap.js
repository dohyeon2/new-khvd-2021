import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useGlobal from '../../hook/useGlobal';
import images from '../../images';
import { getSubFramePercent } from '../../utils/functions';

function AnimationWrap() {
    const {setGlobal} = useGlobal();
    const WrapperRef = useRef();
    const maxFrame = 2200;
    const frameRef = useRef(0);
    const INITIAL_STATE = {
        frame: 0,
        end: false,
    }
    const [state, setState] = useState(INITIAL_STATE);
    const setFrameHadler = (frame) => {
        frameRef.current = frame;
        setState(s => ({
            ...s,
            frame: frame,
        }));
    }
    useEffect(() => {
        const container = document.getElementById("root");
        setFrameHadler(0);
        const scrollHandler = () => {
            if (frameRef.current >= maxFrame) {
                return;
            }
            const scrollTop = container.scrollTop;
            const maxScrollTop = WrapperRef.current.scrollHeight;
            const scrollFraction = scrollTop / maxScrollTop;
            const frameIndex = Math.min(
                maxFrame,
                scrollFraction * maxFrame
            );
            if (scrollFraction > 1) {
                setGlobal({
                    pageTitle: "POPUP-STORE",
                });
            }
            setFrameHadler(frameIndex);
        };
        container.addEventListener('scroll', scrollHandler);
        return ()=>{
            container.removeEventListener('scroll',scrollHandler)
        }
    }, []);
    const { frame, end } = state;
    if (end) return null;
    return (
        <ScrollAnimationSticky ref={WrapperRef}>
            <div className="animationwrap">
                <div className="text-animations-wrap">
                    <div className="title border sequence"
                        style={(() => {
                            const value = getSubFramePercent(frame, 0, 200, 1);
                            const value2 = getSubFramePercent(frame, 400, 600, 1);
                            const fontSize = 10.67 - (4.47 * value);
                            return {
                                position: 'absolute',
                                top: `calc(50% - ${fontSize * 0.75}vw - ${value * fontSize}vw - ${fontSize * value2}vw)`,
                                opacity: 1 - (value2),
                                fontSize: fontSize + "vw",
                            }
                        })()}
                    >
                        UNBOXING
                    </div>
                    <div className="open sequence"
                        style={(() => {
                            const value = getSubFramePercent(frame, 0, 200, 1);
                            const value2 = getSubFramePercent(frame, 400, 600, 1);
                            const value3 = getSubFramePercent(frame, 1000, 1200, 1);
                            const fontSize = 4.22 + (2.4 * (value - value2));
                            return {
                                position: 'absolute',
                                opacity: 1 - (value3),
                                top: `calc(50% + ${fontSize}vw - ${(9 * (value))}vw - ${fontSize * 0.75 * value2}rem)`,
                                fontSize: fontSize + "vw",
                            }
                        })()}
                    >
                        POP-UP STORE OPEN
                    </div>
                    <div className="description"
                        style={(() => {
                            const value = getSubFramePercent(frame, 400, 600, 1);
                            const value2 = getSubFramePercent(frame, 1000, 1200, 1);
                            return {
                                position: 'absolute',
                                opacity: value - (value2),
                                top: `calc(50% - ${4 * value}rem)`,
                            }
                        })()}
                    >
                        경희대학교 시각디자인학과 30번째 졸업전시회 &lt;UNBOXING&gt; 을 즐기는 또다른 방법, 오프라인 팝업스토어!<br />
                        오프라인 팝업스토어에서는 경희대학교 시각디자인학과 학생들이 만든 특별한 굿즈들은 물론
                        온라인 전시에서는 볼 수 없었던 형태의 작품들까지 경험할 수 있는 공간입니다.
                    </div>
                    <div className="map-container"
                        style={(() => {
                            const value = getSubFramePercent(frame, 1000, 1200, 1);
                            return {
                                opacity: value,
                            }
                        })()}
                    >
                        <div className="map-image-wrap">
                            <img src={images['map.png']} />
                        </div>
                        <div className="info">
                            <div className="head">오프라인 팝업스토어 위치</div>
                            <div className="body">경기도 수원시 영통구 영통동 1024-14</div>
                        </div>
                    </div>
                </div>
                <img className="light" src={images['light.png']} />
            </div>
        </ScrollAnimationSticky >
    );
}

export default AnimationWrap;


const ScrollAnimationSticky = styled.div`
    position:relative;
    height:800%;
    z-index:3;
    top:0;
    .test{
        position: fixed;
        left:0;
        bottom:0;
        z-index: 999999;
        background-color: #000;
        color:#fff;
        font-size:2rem;
        padding:20px;
    }
    .animationwrap{
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height:100vh;
        .text-animations-wrap{
            width:100%;
            height:100%;
            display:flex;
            align-items: center;
            justify-content: center;
            position:relative;
            z-index:2;
        }
        .light{
            width:70vw;
            max-width:38.2rem;
            position:absolute;
        }
    }
    .title{
        font-size:6.67rem;
        font-family:${({ theme }) => theme.font.family.englishBold};
        text-align:center;
    }
    .open{
        text-align:center;
        font-size:2.22rem;
        color:#fff;
        font-family:${({ theme }) => theme.font.family.englishBold};
    }
    .border{
        color:#fff;
        @supports (-webkit-text-stroke:2px #fff) {
            color:transparent;
            opacity:1;
            -webkit-text-stroke:2px #fff; 
        }
    }
    .sequence{
        position:absolute;
    }
    .description{
        width:100vw;
        font-size:1.389rem;
        max-width:70rem;
        color:#fff;
        word-break:keep-all;
        letter-spacing: ${({ theme }) => theme.font.translateLetterSpacingRem(1.389, -50)};
        line-height:1.6;
        font-weight:700;
        padding:2rem;
        box-sizing:border-box;
        text-align:center;
        white-space:pre-wrap;
    }
    .map-container{
        display: flex;
        align-items: flex-end;
        padding:2rem;
        .head{
            color:#fff;
            font-size:2.22rem;
            font-weight: 700;
            margin-bottom:2.22rem;
        }
        .body{
            color:#fff;
            font-weight: 700;
            font-size:1.38rem;
        }
        .info{
            flex-shrink:0;
        }
        img{
            max-width:43.33rem;
            width:100%;
        }
        .map-image-wrap{
            flex-shrink:1;
            display: flex;
            margin-right:2rem;
        }
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
            flex-direction: column;
            .map-image-wrap{
                margin-right: 0;
                margin-bottom:2rem;
            }
            .info{
                width:100%;
            }
        }
    }
`;
