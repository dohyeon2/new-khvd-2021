import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import images from '../images';

function Intro() {
    const INITIAL_TOUCH_POSITION_SATATE = {
        startPosition: { x: null, y: null },
        movePosition: { x: null, y: null },
        endPosition: { x: null, y: null }
    };
    const frameRef = useRef(0);
    const [frame, setFrame] = useState(0);
    const [touchPosition, setTouchPosition] = useState(INITIAL_TOUCH_POSITION_SATATE);
    const touchPositionRef = useRef(INITIAL_TOUCH_POSITION_SATATE);
    const [touchState, setTouchState] = useState(false);
    const [test, setTest] = useState(true);

    const setNewPosition = (setTouchPosition, ref, positionType, position) => {
        setTouchPosition(s => ({
            ...s,
            [positionType]: position
        }));
        ref.current[positionType] = position;
    }

    const getPositionFromEvent = (event) => {
        return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }

    const setFrameHanlder = (velocity) => {
        velocity *= 1.5;
        if (frameRef.current + velocity < 0) {
            return;
        }
        setFrame(s => s + velocity);
        frameRef.current += velocity;
    }

    useEffect(() => {
        window.addEventListener('wheel', (event) => {
            if (event.deltaY > 0) {
                setFrameHanlder(1);
            } else if (event.deltaY < 0) {
                setFrameHanlder(-1);
            }
        });
        window.addEventListener('touchstart', (event) => {
            setTouchState("touchStart");
            const position = getPositionFromEvent(event);
            setNewPosition(setTouchPosition, touchPositionRef, "startPosition", position);
        });
        window.addEventListener('touchmove', (event) => {
            setTouchState("touchMove");
            const position = getPositionFromEvent(event);
            setNewPosition(setTouchPosition, touchPositionRef, "movePosition", position);
            let velocity = -1;
            if (touchPosition.startPosition.y < touchPosition.movePosition.y) {
                velocity = 1;
            }
            setFrameHanlder(velocity);
        });
        window.addEventListener('touchend', (event) => {
            setTouchState("touchEnd");
            const position = getPositionFromEvent(event);
            setNewPosition(setTouchPosition, touchPositionRef, "endPosition", position);
        });
    }, []);
    return (
        <Wrapper style={{
            backgroundImage: `url(${images['intro-background.png']})`
        }}>
            {test && <TestConsole>
                touchState: {touchState}<br />
                frame: {frame}<br />
                {Object.keys(touchPosition).map(x => (<>{x} : {touchPosition[x].x}, {touchPosition[x].y}<br /></>))}
            </TestConsole>}
            <BoxWrapper
                start={20}
                end={60}
                currentFrame={frame}
                style={{ transformOrigin: 'left center' }}
            />
        </Wrapper>
    );
}

const BoxWrapper = ({
    start,
    end,
    currentFrame,
    deg = 90,
    style
}) => {
    const relativeFrame = (currentFrame - start) > 0 ? (currentFrame - start) : 0;
    const percent = (relativeFrame / (end - start)) > 0 ? relativeFrame / (end - start) : 0;
    const currentDeg = deg * percent;
    return (<StyledBoxWrapper
        style={{
            ...style,
            transform: `rotateY(${(currentDeg > 90 ? 90 : currentDeg)}deg)`,
        }}
    >
        {relativeFrame}<br />
        {currentDeg}
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
    position: absolute;
    inset:0;
    background-size:cover;
    background-position:center;
`;

const StyledBoxWrapper = styled.div`
    background-color: #000;
    position: absolute;
    inset:0;
    color:#fff;
`;