import React, { useCallback, useEffect, useRef } from 'react';
import LottieElement from '../components/LottieElement';
import lotties from '../lotties';
import { WinnerIcon } from '../components/Icon';
import styled from 'styled-components';
import { StyledProjectItem } from '../pages/ProjectList';
import Sticker from './Sticker';

export function ParticipantItem({
    picture, hoverPicture, name, className, winner, onClick, onlyProfileImage, circle
}) {
    const pictureClassList = ["picture"];
    const nameClassList = ["name"];
    const lottieRef = useRef();

    if (!picture) {
        pictureClassList.push("loading");
    }
    if (!name) {
        nameClassList.push("loading");
    }
    if (circle) {
        pictureClassList.push('circle');
    }

    const getLottie = useCallback((lottie) => {
        lottieRef.current = lottie;
    }, []);

    const onMouseEnter = () => {
        if (lottieRef.current?.isPaused) {
            lottieRef.current.goToAndPlay(0);
        }
    }
    useEffect(() => {
        className?.includes('active') && lottieRef.current.goToAndPlay(0);
    }, [className]);

    const matches = !onlyProfileImage ? name.match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]*)(.*)/) : "";
    const koreanName = matches && matches[1].trim();
    const englishName = matches && matches[2].trim();
    return (
        <ParticipantItemLayout
            className={className}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            {winner && <WinnerIcon winner={winner} />}
            <LottieElement
                className="confetti_animation"
                noReset={true}
                lottieOption={{
                    autoplay: false,
                    animationData: lotties['confetti.json'],
                    loop: false,
                    initialSegment: [10, 31]
                }}
                getLottie={getLottie}
            />
            <div className={pictureClassList.join(" ")} >
                <div className="images">
                    <img className="normal" src={picture} loading="lazy" />
                    <img className="confetti" src={hoverPicture} loading="lazy" />
                    {!picture && <Sticker className="sticker" noRandomRotate={true} />}
                </div>
            </div>
            {!onlyProfileImage && <div className={nameClassList.join(" ")}>
                {koreanName}<br />
                {englishName}
            </div>}
        </ParticipantItemLayout>
    )
}
const ParticipantItemLayout = styled(StyledProjectItem)`
    position:relative;
    &.active,
    &:hover{
        img{
            &.normal{
                opacity:0;
            }
        }
    }
    .name{
        text-align:center;
    }
    .confetti_animation{
        pointer-events: none;
        z-index:4;
        position:absolute;
        width:140%;
        left:50%;
        transform:translateX(-50%);
        top:-10%;
    }
    .picture{
        height:100%;
        position:relative;
        background-color: #D8D7D1;
        display:flex;
        justify-content:center;
        align-items:flex-end;
        &.circle{
            border-radius: 9999px;
            overflow:hidden;
            img{
                top:0;
                border-radius: 99px;
            }
            &::before{
                padding-top: 100%;
            }
        }
        &.loading{
            animation:unset;
            background-color: #D8D7D1;
            opacity:1;
        }
        img{
            width:100%;
            position:absolute;
            top:unset;
            bottom:0;
            left:0;
            right:0;
            &.normal{
                z-index:2;
                transition: opacity .2s ease-in-out;
            }
        }
        .sticker img{
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
        }
        &::before{
            padding-top: 133%;
        }
    }
`;