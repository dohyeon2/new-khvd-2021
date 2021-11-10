import React from 'react';
import styled from 'styled-components';
import images from '../images';

function ArtAndDesignHall({ image }) {
    return (
        <ANDHallWrap className="andhall-wrap">
            <svg className="svg">
                <clipPath id="hall-clip-path" clipPathUnits="objectBoundingBox"><path d="M0.741,1 v-0.008 h0.254 V0.885 h-0.008 v-0.274 h0.009 V0.569 h0.003 v-0.01 H0.863 V0.204 h0.002 v-0.003 h-0.002 v-0.004 h0.002 v-0.003 h-0.002 V0.119 h0.002 V0.114 h-0.002 V0.063 h0.002 V0.06 h-0.002 V0.05 h0.002 V0.047 h-0.006 V0.006 h0.004 V0 H0.82 V0.047 H0.744 V0 H0.701 V0.006 h0.004 V0.047 h-0.006 v0.003 h0.002 V0.06 h-0.002 v0.003 h0.002 V0.114 h-0.003 v0.005 h0.003 v0.028 H0.69 V0.1 h0.005 V0.094 H0.305 v0.007 h0.005 v0.046 H0.299 V0.119 h0.003 V0.114 h-0.003 V0.063 h0.002 V0.06 h-0.002 V0.05 h0.002 V0.047 h-0.006 V0.006 h0.004 V0 H0.256 V0.047 H0.18 V0 H0.137 V0.006 h0.004 V0.047 h-0.006 v0.003 h0.002 V0.06 h-0.002 v0.003 h0.002 V0.114 h-0.002 v0.005 h0.002 v0.075 h-0.002 v0.003 h0.002 v0.004 h-0.002 v0.003 h0.002 V0.559 H0 v0.01 H0.003 v0.041 H0.013 v0.274 H0.005 v0.107 H0.259 v0.008 M0.013,0.92 h-0.004 V0.888 h0.004 M0.31,0.194 H0.299 V0.162 h0.011 m0.391,0 H0.69 V0.162 h0.011 v0.032 m0.29,0.695 v0.032 h-0.004 V0.888"></path></clipPath>
            </svg>

            <div className="clipped">
                <div className="projected-thumbnail" style={{ backgroundImage: `url(${image || images['andhall.png']})` }} />
                <img className="background" src={images['andhall.png']} />
            </div>
        </ANDHallWrap>
    );
}

export default ArtAndDesignHall;

const ANDHallWrap = styled.div`
    max-width:1115px;
    max-height:788px;
    position: relative;
    .svg{
        position: absolute;
        left:50%;
        top:50%;
    }
    filter:drop-shadow(0 0 2vw rgba(255,53,142,.5));
    .clipped{
        width:100%;
        -webkit-clip-path: url(#hall-clip-path);
        clip-path: url(#hall-clip-path);
        -webkit-transform:translateZ(1px);
        position:relative;
        display:flex;
        img{
            position:relative;
            width:100%;
            z-index:1;
        }
        .projected-thumbnail{
            position:absolute;
            transition: background-image .2s ease-in-out;
            inset:0;
            z-index:3;
            background-size:cover;
            background-position: center;
            background-repeat: no-repeat;
            mix-blend-mode: multiply;
            opacity:1;
        }
    }
`;
