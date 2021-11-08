import React from 'react';
import styled from 'styled-components';

function HambergerMenu({ onClick, on }) {
    const classList = [];
    if (on) {
        classList.push('on');
    }
    return (
        <StyledHambergerMenu className={classList.join(" ")} onClick={onClick}>
            <div className="bar"></div>
        </StyledHambergerMenu>
    );
}

export default HambergerMenu;

const StyledHambergerMenu = styled.div`
    position:relative;
    height:1.56rem;
    cursor:pointer;
    width:2.23rem;
    &::after,
    &::before,
    .bar{
        position:absolute;
        content:"";
        display:block;
        width:100%;
        height:0.23rem;
        background-color:#fff;
    }
    .bar{
        top:50%;
        transform: translateY(-50%);
        opacity:1;
        transition:opacity .2s ease-in-out;
    }
    &::after,
    &::before{
        transform:rotate(0);
        transform-origin:center;
        transition:transform .2s ease-in-out, bottom .2s ease-in-out, top .2s ease-in-out;
    }
    &::after{
        bottom:0;
    }
    &::before{
        top:0;
    }
    &.on{
        .bar{
            opacity:0;
        }
        &::after{
            bottom:0.67rem;
            transform:rotate(45deg);
        }
        &::before{
            top:0.67rem;
            transform:rotate(-45deg);
        }
    }
`;