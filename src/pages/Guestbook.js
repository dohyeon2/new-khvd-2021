import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import styled from 'styled-components';
import images from '../images';
import Sticker from '../components/Sticker';
import GuestbookList from './subpage/GuestbookList';
import useGlobal from '../hook/useGlobal';

function Guestbook() {
    const INITIAL_STATE = {
        stickers: [],
        editorVisible: false,
    };
    const { setGlobal, global } = useGlobal();
    const [state, setState] = useState(INITIAL_STATE);

    const makeSticker = (attr) => {
        const { innerWidth, innerHeight } = window;
        const newSticker = {
            className: "sticker",
            style: {
                left: ((Math.random() * innerWidth * 0.8) + innerWidth * 0.1) * 100 / innerWidth + "%",
                top: ((Math.random() * innerHeight * 0.8) + innerHeight * 0.1) * 100 / innerHeight + "%",
            },
            ...attr,
        };
        setState(s => ({
            ...s,
            stickers: [
                ...s.stickers,
                newSticker,
            ]
        }));
    }

    const onClick = (event) => {
        const { clientX, clientY } = event;
        const attr = {
            style: {
                left: clientX,
                top: clientY,
            }
        }
        makeSticker(attr);
        setGlobal({ editorVisible: true, editorCancel: false });
    }

    useEffect(() => {
        const count = 20 + (100*(window.innerWidth/1920));
        for (let i = 0; i < count; i++) {
            makeSticker();
        }
    }, []);

    useEffect(() => {
        if (global.editorCancel) {
            setState(s => ({
                ...s,
                stickers: global.editorCancel ? s.stickers.slice(0, -1) : s.stickers,
            }));
            setGlobal({ editorCancel: false });
        }
    }, [global.editorCancel]);

    return (
        <>
            <GeustbookLayout
                onClick={onClick}
            >
                <div className="balloon-container">
                    {"u,n,b,o,x,i,n2,g".split(",").map(x =>
                        <img className={"balloon" + " " + x} src={images[x + ".png"]} />
                    )}
                </div>
                <img className="click-banner" src={images['guestbook_click_banner.png']} />
                {state.stickers.map(attr => <Sticker
                    {...attr}
                />)}
            </GeustbookLayout>
            <GuestbookList />
        </>
    );
}

export default Guestbook;

const GeustbookLayout = styled(Layout)`
    position:relative;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    .sticker{
        position:absolute;
        transform:translate(-50%,-50%);
    }
    .click-banner{
        position:absolute;
        left:4.38rem;
        top:7.27rem;
        max-width:23.5rem;
        z-index:2;
    }
    .balloon-container{
        cursor:auto;
        z-index:3;
        display:flex;
        align-items:center;
        justify-content: center;
        position:relative;
        width:100%;
        user-select:none;
        .balloon{
            max-width:10rem;
            margin:0 -2.3rem;
            transform:translateY(0%) rotate(0deg);
            animation: 3s ease-in-out updownAndRotate infinite alternate;
            &.b{
                max-width:12rem;
            }
            @media screen and (max-width:${({theme})=>theme.breakPoints.m}px){
                margin:0 -4vw;
                max-width:18vw;
                width:24vw;
                &.b{
                    max-width:22vw;
                }
            }
            &:nth-of-type(2n){
                animation-name:updownAndRotateReverse;
                animation-duration:2.5s;
            }
            &:nth-of-type(3n){
                animation-delay: -1.5s;
            }
            @keyframes updownAndRotate{
                0%{
                    transform:translateY(0%) rotate(0deg);
                }   
                100%{
                    transform:translateY(20%) rotate(-10deg);
                }
            }
            @keyframes updownAndRotateReverse{
                0%{
                    transform:translateY(0%) rotate(0deg);
                }   
                100%{
                    transform:translateY(20%) rotate(10deg);
                }
            }
        }

    }
`;