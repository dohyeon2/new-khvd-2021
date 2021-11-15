import React, { useEffect, useRef, useState } from 'react';

function Grabcomp({
    children
}) {
    const childrenRef = useRef();
    const INITIAL_STATE = {
        dragging: false,
    }
    const [state, setState] = useState(INITIAL_STATE);
    const [pos, setPos] = useState({
        left: null, top: null,
    });
    const postInit = () => {
        const { left, top } = pos;
        const { left: refLeft, top: refTop } = childrenRef.current.getBoundingClientRect();
        if (left === null || top === null) {
            setPos({ left: refLeft, top: refTop });
        }
    }
    const dragStart = (event) => {
        setState(s => ({
            ...s,
            dragging: true,
        }));
    }
    const dragMove = (event) => {
        if (!dragging) return;
        const { type, movementX, movementY } = event;
        setPos(s => ({
            left: s.left + movementX,
            top: s.top + movementY,
        }));
    }
    const dragEnd = () => {
        setState(s => ({
            ...s,
            dragging: false,
        }));
    }
    const onMouseDown = (event) => {
        dragStart(event);
    }
    const onMouseMove = (event) => {
        dragMove(event);
    }
    const onMouseUp = (event) => {
        dragEnd(event);
    }
    const onMouseLeave = (event) => {
        dragEnd(event);
    }
    const onTouchStart = (event) => {
        dragStart(event);
    }
    const onTouchEnd = (event) => {
        dragEnd(event);
    }
    const onDragStart = (event) => {
        event.preventDefault();
    }
    useEffect(()=>{
        postInit();
    },[]);
    const { dragging } = state;
    const style = {
        // transform: `translate(-50%,-50%)`,
        cursor: dragging ? `grabbing` : `grab`
    }
    return React.cloneElement(children,
        {
            ref: childrenRef,
            onTouchStart,
            onDragStart,
            onMouseUp,
            onTouchEnd,
            onMouseDown,
            onMouseMove,
            onMouseLeave,
            style: {
                ...style,
                ...pos,
            },
        })
}

export default Grabcomp;