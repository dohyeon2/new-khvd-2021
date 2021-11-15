import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import images from '../images';
import { FloatingBtn } from './Btns';
import LottieElement from './LottieElement';
import lotties from '../lotties';
import useGlobal from '../hook/useGlobal';
import { updateProjectCheer } from '../api/project';

function FloatingMenu() {
    const { global } = useGlobal();
    const upupBtn = useRef();
    const lottieRef = useRef();
    const handleScrollEvent = (container) => () => {
        let scrollTop = 0;
        scrollTop = container.scrollTop || 0;
        if (upupBtn.current) {
            upupBtn.current.style.display = scrollTop > window.innerHeight / 2 ? 'block' : "none";
        }
    }
    const getLottie = (lottie) => {
        lottieRef.current = lottie;
    }
    useEffect(() => {
        const container = document.getElementsByClassName('project-container')[0] || document.getElementById("root");
        handleScrollEvent(container);
        container.addEventListener('scroll', handleScrollEvent(container));
        return () => {
            container.removeEventListener('scroll', handleScrollEvent(container));
        }
    }, [global]);
    return (
        <FloatingMenuLayout>
            <FloatingBtn
                className="cheer-btn"
                onClick={() => {
                    const { current } = lottieRef;
                    if (current) {
                        if (current.currentFrame >= current.totalFrames - 1
                            || current.currentFrame === 0) {
                            current.goToAndPlay(0);
                            updateProjectCheer(global.currentProjectId);
                        }
                    }
                }}>
                <LottieElement
                    getLottie={getLottie}
                    className="cheer-animation"
                    lottieOption={{
                        loop: false,
                        autoplay: false,
                        animationData: lotties['cheers.json']
                    }}
                />
                <div className="placeholder"></div>
                Cheers!
            </FloatingBtn>
            <div
                className="upup-btn"
                ref={upupBtn}
            >
                <FloatingBtn
                    onClick={() => {
                        if (document.getElementsByClassName('project-container')[0]) {
                            document.getElementsByClassName('project-container')[0].scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }
                        document.getElementById("root").scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                >
                    <img src={images['upup-btn.png']} alt="" />
                    UPUP!
                </FloatingBtn>
            </div>
        </FloatingMenuLayout>
    );
}

export default FloatingMenu;


const FloatingMenuLayout = styled.div`
    display:flex;
    flex-direction: column;
    position:fixed;
    bottom:4.72rem;
    right:1rem;
    z-index:33;
    .upup-btn{
        display:none;
    }
    .cheer-btn{
        position:relative;
        margin-bottom:2rem;
        .placeholder{
            width:4.44rem;
            height:4.44rem;
            margin-bottom:1rem;
        }
        .cheer-animation{
            pointer-events: none;
            cursor:auto;
            position:absolute;
            width:9.2rem;
            right:-0.7rem;
            bottom:-0.5rem;
        }
    }
`