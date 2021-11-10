import React, { useCallback, useEffect, useState, useRef } from 'react';
import { getSubFramePercent } from '../utils/functions';

export function HorizontalScrollAnimation({
    children,
    maxFrame,
    frame,
    accelearation,
    accframe: af,
    minFrame: mf,
    setScrolling = () => { },
    getFrame = () => { }
}) {
    const INITIAL_STATE = {
        maxFrame: maxFrame || 100,
        frame: frame || 0,
        minFrame: mf || 0,
    };
    const frameRef = useRef(frame || 0);
    const accFrameRef = useRef(af || 0);
    const accelearationRef = useRef(accelearation || 0.1);
    const requestAnimationId = useRef();
    const srolling = useRef(false);
    const approx = useRef();
    const animState = useRef();
    const timeOutRef = useRef(0);
    const beforeTouch = useRef();
    const [state, setState] = useState(INITIAL_STATE);
    const { minFrame } = state;
    useEffect(() => {
        anim();
    }, []);

    useEffect(() => {
        getFrame(state.frame);
    }, [state.frame]);

    useEffect(() => {
        accFrameRef.current = af || 0;
        cancelAnimationFrame(requestAnimationId.current);
        requestAnimationId.current = requestAnimationFrame(anim);
    }, [af]);

    const anim = () => {
        const delay = frameRef.current;
        const accFrame = accFrameRef.current;
        frameRef.current = delay + (accFrame - delay) * accelearationRef.current;
        setState(s => ({
            ...s,
            frame: frameRef.current,
        }));
        requestAnimationId.current = requestAnimationFrame(anim);
        approx.current = Math.abs(frameRef.current - accFrame) < 1;
        if (!approx.current) return;
        cancelAnimationFrame(requestAnimationId.current);
        animState.current = false;
    };
    const setScroll = (direction, weight = 100) => {
        accFrameRef.current += weight * direction;
        if (accFrameRef.current < minFrame) {
            accFrameRef.current = minFrame;
        } else if (accFrameRef.current > maxFrame) {
            accFrameRef.current = maxFrame;
        }
        if (animState.current) return;
        requestAnimationId.current = requestAnimationFrame(anim);
        animState.current = true;
    }
    const onWheel = (event) => {
        if (srolling.current === false) {
            srolling.current = true;
            setScrolling(true);
        }
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
            if (srolling.current === true) {
                srolling.current = false;
                setScrolling(false);
            }
        }, 300);
        let direction = 1;
        if (event.deltaY < 0) {
            direction = - 1;
        }
        const weight = 70 + (getSubFramePercent(window.innerWidth, 300, 1920, 50));
        setScroll(direction, weight);
    };

    const onTouchEnd = (event) => {
        beforeTouch.current = null;
    }

    const onTouchMove = (event) => {
        if (!event.touches[0]) { return; }

        const { clientX, clientY } = event.touches[0];

        if (!beforeTouch.current) {
            beforeTouch.current = { clientX, clientY };
            return;
        }
        let direction = 1;
        if (beforeTouch.current.clientX - clientX < 0) {
            direction = - 1;
        }
        const weight = 1 + (1 - getSubFramePercent(window.innerWidth, 300, 1920, 1));
        const amount = (beforeTouch.current.clientX - clientX);
        beforeTouch.current = { clientX, clientY };
        setScroll(amount, weight);
    };

    const attr = {
        onWheel,
        onTouchMove,
        onTouchEnd
    };

    return (
        React.cloneElement(
            children,
            {
                ...children.props,
                ...attr
            }
        )
    );
}