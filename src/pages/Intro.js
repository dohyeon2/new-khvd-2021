import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import useGlobal from '../hook/useGlobal';
import images from '../images';
import theme from '../themes';
import { getSubFramePercent, setCookie } from '../utils/functions'
import { ChevronBtn } from '../components/Btns';
import { ScrollDown } from '../components/Icon';

function Intro() {
    const { setGlobal } = useGlobal();
    const maxFrame = 960;
    const WrapperRef = useRef();
    const frameRef = useRef(0);
    const followingLightInterval = useRef(null);
    const mousePos = useRef({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });
    const openAnimationDuration = 40;
    const openingInterval = useRef(null);
    const [frame, setFrame] = useState(0);
    const [test] = useState(false);

    const setFrameHanlder = (velocity) => {
        if (frameRef.current + velocity < 0) {
            return;
        }
        setFrame(velocity);
        frameRef.current = velocity;
    }

    const clearAnimation = () => {
        WrapperRef.current.style.overflow = 'hidden';
    }

    const yesClickEventHandler = () => {
        if (openingInterval.current === null) {
            clearAnimation();
            setGlobal({
                animation: true,
            });
            setTimeout(() => {
                openingInterval.current = setInterval(() => {
                    setFrameHanlder(frameRef.current + 1);
                    if (frameRef.current - maxFrame >= openAnimationDuration) {
                        clearInterval(openingInterval.current);
                    }
                }, 1000 / 60);
            }, 500);
        }
    }

    useEffect(() => {
        return () => {
            clearInterval(openingInterval.current);
        }
    }, []);

    useEffect(() => {
        setGlobal({
            appbarVisibility: false,
        });
        setGlobal({
            footer: false,
        });
        return () => {
            setGlobal({
                appbarVisibility: true,
            });
            setGlobal({
                footer: true,
            });
        }
    }, []);

    useEffect(() => {
        WrapperRef.current.addEventListener('scroll', (event) => {
            if (frameRef.current >= maxFrame) {
                return;
            }
            const scrollTop = WrapperRef.current.scrollTop;
            const maxScrollTop = WrapperRef.current.scrollHeight - window.innerHeight;
            const scrollFraction = scrollTop / maxScrollTop;
            const frameIndex = Math.min(
                maxFrame,
                scrollFraction * maxFrame
            );
            setFrameHanlder(frameIndex);
        });
        WrapperRef.current.addEventListener("mousemove", (event) => {
            mousePos.current = {
                x: event.x,
                y: event.y,
            };
        });
    }, []);

    useEffect(() => {
        const cFrame = frameRef.current;
        if (cFrame >= 900) {
            const light = WrapperRef.current.querySelector('#light');
            const left = parseInt(light.style.left);
            const top = parseInt(light.style.top);
            if (!left) {
                light.style.left = WrapperRef.current.offsetWidth / 2 + "px";
            }
            if (!top) {
                light.style.top = WrapperRef.current.offsetHeight / 2 + "px";
            }
            if (followingLightInterval.current === null) {
                followingLightInterval.current = setInterval(() => {
                    const { x, y } = mousePos.current;
                    const left = parseInt(light.style.left);
                    const top = parseInt(light.style.top);
                    const xGap = x - left;
                    const yGap = y - top;
                    const weight = 20;
                    light.style.left = (left + (xGap / weight)) + "px";
                    light.style.top = (top + (yGap / weight)) + "px";
                }, 1000 / 60);
            }
        } else {
            if (followingLightInterval.current !== null) {
                clearInterval(followingLightInterval.current);
                followingLightInterval.current = null;
            }
        }
    }, [frameRef.current]);

    return (
        <>
            <ChevronBtn className="skip-btn"
                style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 30,
                    fontSize: '1rem',
                }}
                onClick={() => {
                    setCookie("skip_intro", "1", 1);
                    setGlobal({ intro: false });
                }}
            >
                오늘 하루 동안 보지 않기
            </ChevronBtn>
            <CustomWrapper
                style={{
                    opacity: 1 - getSubFramePercent(frame, maxFrame, maxFrame + openAnimationDuration, 1),
                    pointerEvents: getSubFramePercent(frame, maxFrame, maxFrame + openAnimationDuration, 1) && "none"
                }}
                ref={WrapperRef}
                maxFrame={maxFrame}>
                <AnimationObj
                    start={0}
                    end={40}
                    goal={1}
                    zIndex={20}
                    className={"message"}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'right bottom',
                        width: 'auto',
                        height: 'auto',
                        right: '10%',
                        bottom: '0',
                        color: '#fff',
                        fontSize: '1.6rem',
                        textAlign: 'right',
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(120, 160, 1);
                        return {
                            bottom: `${(10 * currentProceed) + (10 * subFrame)}%`,
                            opacity: `${currentProceed - subFrame}`
                        }
                    }}
                >
                    여러분은 선물을 받거나 택배가 도착했을 때<br />
                    상자를 열며 느낀 설렘을 기억하시나요?
                </AnimationObj>
                <AnimationObj
                    start={160}
                    end={200}
                    goal={90}
                    zIndex={19}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'right center',
                        backgroundColor: '#000',
                        background: `url(${images['boxwings/side.png']})`,
                        backgroundSize: `cover`,
                        backgroundPositionX: 'left',

                    }}
                    frameStyleHandler={(currentProceed) => {
                        return {
                            transform: `rotateY(${currentProceed}deg)`,
                        }
                    }}
                />
                <AnimationObj
                    start={200}
                    end={240}
                    goal={1}
                    zIndex={20}
                    className={"message"}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'left bottom',
                        width: 'auto',
                        height: 'auto',
                        left: '10%',
                        color: '#fff',
                        fontSize: '1.6rem',
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(320, 360, 1);
                        return {
                            bottom: `${(10 * currentProceed) + (10 * subFrame)}%`,
                            opacity: `${currentProceed - subFrame}`
                        }
                    }}
                >
                    'Unboxsing'의 사전적 정의는<br />
                    '상자에 들어간 물건을 꺼내다'<br />
                    정도로 그칠 지 모릅니다.
                </AnimationObj>
                <AnimationObj
                    start={360}
                    end={400}
                    goal={90}
                    zIndex={18}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'left center',
                        backgroundColor: '#000',
                        background: `url(${images['boxwings/left.png']})`,
                        backgroundPositionX: 'right',
                        backgroundSize: `cover`,
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(160, 200, 100);
                        return {
                            transform: `rotateY(${currentProceed}deg)`,
                            filter: subFrame !== 100 && `brightness(${subFrame}%)`,
                        }
                    }}
                />

                <AnimationObj
                    start={400}
                    end={440}
                    goal={1}
                    zIndex={20}
                    className={"message"}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'left center',
                        width: 'auto',
                        height: 'auto',
                        left: '10%',
                        top: '5%',
                        color: '#fff',
                        fontSize: '1.6rem',
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(520, 560, 1);
                        return {
                            top: `${(10 * currentProceed) + (10 * subFrame)}%`,
                            opacity: `${currentProceed - subFrame}`
                        }
                    }}
                >
                    그러나 상자를 첫 개봉할 때의 설렘,<br />
                    그리고 상자 안에 든 '무언가'를 마주 할때의<br />
                    행복감은 이루 말할 수 없죠.
                </AnimationObj>

                <AnimationObj
                    start={360}
                    end={400}
                    goal={20}
                    zIndex={17}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'center top',
                        height: '50%',
                        background: `url(${images['boxwings/top.png']})`,
                        backgroundPositionY: 'bottom',
                        backgroundSize: `cover`,
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(360, 400, 100);
                        const subFrame2 = getSubFramePercent(560, 600, 50);
                        const subFrame3 = getSubFramePercent(maxFrame, maxFrame + openAnimationDuration, 20);
                        return {
                            transform: `rotateX(${currentProceed + subFrame2 + subFrame3}deg)`,
                            filter: subFrame !== 100 && (`brightness(${subFrame}%)`),
                        }
                    }}
                />

                <AnimationObj
                    start={360}
                    end={400}
                    goal={20}
                    zIndex={17}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'center bottom', height: '50%', bottom: 0,
                        background: `url(${images['boxwings/bottom.png']})`,
                        backgroundPositionY: 'top',
                        backgroundSize: `cover`,
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(360, 400, 100);
                        const subFrame2 = getSubFramePercent(560, 600, 50);
                        const subFrame3 = getSubFramePercent(maxFrame, maxFrame + openAnimationDuration, 20);
                        return {
                            transform: `rotateX(${currentProceed + subFrame2 + subFrame3}deg)`,
                            filter: subFrame !== 100 && `brightness(${subFrame}%)`,
                        }
                    }}
                />

                <AnimationObj
                    start={560}
                    end={600}
                    goal={1}
                    zIndex={20}
                    id={'light'}
                    currentFrame={frame}
                    style={{
                        width: `15vw`,
                        height: `15vw`,
                        maxWidth: 800,
                        maxheight: 800,
                        borderRadius: 999999,
                        backgroundSize: 'contain',
                        transform: 'translate(-50%,50%)',
                        backgroundImage: `url(${images['light.png']})`,
                        backgroundSize: '90%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    wrapperFrameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame2 = getSubFramePercent(maxFrame, maxFrame + openAnimationDuration, 1);
                        const subFrame3 = getSubFramePercent(maxFrame + openAnimationDuration - 1, maxFrame + openAnimationDuration, 1);
                        return {
                            opacity: 1 - subFrame2,
                            visibility: subFrame3 === 1 && "hidden",
                        }
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(600, 640, 1);
                        const subFrame2 = getSubFramePercent(560, 680, 1);
                        return {
                            left: `${10 + (10 * currentProceed ** 3) + (30 * (subFrame))}%`,
                            bottom: `calc(110% - ${20 * currentProceed}% - ${40 * (subFrame ** 2)}%)`,
                            width: `${15 * (4 * subFrame2)}vw`,
                            height: `${15 * (4 * subFrame2)}vw`,
                        }
                    }}
                />
                <AnimationObj
                    start={560}
                    end={600}
                    goal={1}
                    zIndex={13}
                    className={"message"}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'left center',
                        width: 'auto',
                        height: 'auto',
                        textAlign: "center",
                        color: '#fff',
                        fontSize: '1.6rem',
                    }}
                    wrapperStyle={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(680, 720, 1);
                        return {
                            transform: `translateY(${100 - (100 * currentProceed + (50 * subFrame))}%)`,
                            opacity: `${currentProceed - subFrame}`
                        }
                    }}
                >
                    60명의 예비 디자이너들이<br />
                    4년 이상 갈고 닦아온 노력의 결과물을
                </AnimationObj>

                <AnimationObj
                    start={720}
                    end={760}
                    goal={1}
                    zIndex={13}
                    className={"message"}
                    currentFrame={frame}
                    style={{
                        transformOrigin: 'left center',
                        width: 'auto',
                        height: 'auto',
                        textAlign: "center",
                        color: '#fff',
                        fontSize: '1.6rem',
                    }}
                    wrapperStyle={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame = getSubFramePercent(840, 880, 1);
                        return {
                            transform: `translateY(${100 - (100 * currentProceed + (50 * subFrame))}%)`,
                            opacity: `${currentProceed - subFrame}`
                        }
                    }}
                >
                    경희대학교 시각디자인학과의 30번째 졸업전시회<br />
                    'UNBOXING'에서 여러분들과 함께 열어보고자 합니다.
                </AnimationObj>

                <AnimationObj
                    start={880}
                    end={920}
                    goal={1}
                    zIndex={13}
                    currentFrame={frame}
                    id="enter_option"
                    style={{
                        transformOrigin: 'left center',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: "center",
                        color: '#fff',
                        fontSize: '1.6rem',
                    }}
                    wrapperStyle={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    wrapperFrameStyleHandler={(currentProceed, getSubFramePercent) => {
                        const subFrame2 = getSubFramePercent(maxFrame, maxFrame + openAnimationDuration, 1);
                        const subFrame3 = getSubFramePercent(maxFrame + openAnimationDuration - 1, maxFrame + openAnimationDuration, 1);
                        return {
                            opacity: 1 - subFrame2,
                            visibility: subFrame3 === 1 && "hidden",
                        }
                    }}
                    frameStyleHandler={(currentProceed, getSubFramePercent) => {
                        return {
                            opacity: `${currentProceed}`
                        }
                    }}
                >
                    <div className="inner message">
                        <div className="title">다시 오지 않을 행복한 이 순간을 지금 바로 열어보세요!</div>
                        <div className="btns">
                            <button onClick={yesClickEventHandler}>
                                YES
                            </button>
                            <button onClick={yesClickEventHandler}>
                                Of Course!
                            </button>
                        </div>
                    </div>
                </AnimationObj>
                <AnimationObj
                    start={560}
                    end={600}
                    goal={1}
                    zIndex={12}
                    currentFrame={frame}
                    wrapperStyle={{
                        opacity: 1,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: theme.backgorundImage,
                        backgroundColor: theme.colors.background
                    }}
                    wrapperFrameStyleHandler={(currentProceed, getSubFramePercent) => {
                        return {
                            filter: `brightness(${40 + (60 * currentProceed)}%)`
                        };
                    }}
                />
                <AnimationObj
                    start={maxFrame}
                    end={maxFrame + openAnimationDuration}
                    goal={1}
                    zIndex={13}
                    currentFrame={frame}
                    wrapperFrameStyleHandler={(currentProceed, getSubFramePercent) => {
                        return {
                            opacity: currentProceed
                        };
                    }}
                >
                </AnimationObj>
                {test && <TestConsole>
                    frame: {frame}<br />
                </TestConsole>}
                <ScrollDown
                    className="scroll-down"
                    style={{
                        opacity: (1 - getSubFramePercent(frame, 0, 40, 1))
                    }} />
            </CustomWrapper>
        </>
    );
}

const AnimationObj = ({
    start,
    end,
    currentFrame,
    goal,
    style,
    id,
    className,
    frameStyleHandler = () => { },
    wrapperFrameStyleHandler = () => { },
    zIndex = 1,
    wrapperStyle,
    children
}) => {
    const getRelativeFrame = (currentFrame, start) => {
        return (currentFrame - start) > 0 ? (currentFrame - start) : 0;
    }
    const getPercent = (relativeFrame, end, start) => {
        return (relativeFrame / (end - start)) > 0 ? relativeFrame / (end - start) : 0
    }
    const getCurrentProceed = (goal, percent) => {
        return (goal * percent) > goal ? goal : goal * percent;
    }
    const relativeFrame = getRelativeFrame(currentFrame, start);
    const percent = getPercent(relativeFrame, end, start);
    const currentProceed = getCurrentProceed(goal, percent);
    const getSubFramePercent = (start, end, goal = goal) => {
        const relativeFrame = getRelativeFrame(currentFrame, start);
        const percent = getPercent(relativeFrame, end, start);
        const currentProceed = getCurrentProceed(goal, percent);
        return currentProceed;
    }
    return (<StyledBoxWrapper
        id={id}
        className={className}
        style={{
            zIndex: zIndex,
            ...wrapperStyle,
            ...wrapperFrameStyleHandler(currentProceed, getSubFramePercent, percent, relativeFrame),
        }}><div
            style={{
                ...style,
                ...frameStyleHandler(currentProceed, getSubFramePercent, percent, relativeFrame),
            }}
        >
            {children}
        </div>
    </StyledBoxWrapper>);
}

export default Intro;

const TestConsole = styled.div`
    position:fixed;
    left:0;
    top:0;
    background-color: rgba(0,0,0,.7);
    color:#fff;
    padding:0.5rem;
    z-index:9999;
`;

const Wrapper = styled.div`
    height:100%;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    background-size:cover;
    background-position:center;
    overflow-y:auto;
    z-index:1;
    &::after{
        content:"";
        display: block;
        height: ${p => p.maxFrame * 2}%;
    }
`;

const CustomWrapper = styled(Wrapper)`
    .scroll-down{
        position:fixed;
        bottom:0;
        z-index:20;
        width:100%;        
        display:flex;
        flex-direction:column;
        align-items:center;
        box-sizing:border-box;
        padding:2rem;
        .lottie-element {
            height:10rem;
            margin-bottom:-3rem;
        }
        .description{
            color: #fff;
        }
    }
    #enter_option{
        .inner{
            position:relative;
            .title{
                margin-bottom:14%;
            }
            .btns{
                justify-content:center;
                display:flex;
                button{
                    pointer-events:auto;
                    cursor:pointer;
                    margin:0 10%;
                    padding: 0;
                    color:#fff; 
                    background-color:transparent;
                    border:0;
                }
            }
        }
    }
    #light{
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
    }
    .message{
        font-weight:400;
        font-family:${({ theme }) => theme.font.family.notoSans};
        &>div{
            line-height:1.6;
        }
        button{
            font-weight:bold;
            font-family:${({ theme }) => theme.font.family.notoSans};
            line-height:2;
        }
    }
`;

const StyledBoxWrapper = styled.div`
    position: fixed;
    pointer-events: none;
    width:100%;
    height:100%;
    & > div{
        position: absolute;
        width:100%;
        height:100%;
    }
`;