import React from 'react';
import styled from 'styled-components';
import images from '../images';

function ArtAndDesignHall({ image }) {
    console.log(image);
    return (
        <ANDHallWrap>
            <svg className="svg">
                <clipPath id="hall-clip-path" clipPathUnits="objectBoundingBox"><path d="M1,0.559 v0.01 h-0.003 v0.041 h-0.009 v0.274 h0.008 v0.036 h0 v0.071 H0.741 v0.008 H0.68 v0 H0.59 v0 h-0.061 v0 H0.472 v0 h-0.061 v0 H0.32 v0 H0.259 v-0.008 H0.005 V0.921 h0 V0.885 h0.008 v-0.274 H0.003 V0.569 H0 v-0.01 H0.137 V0.205 h-0.002 v-0.003 h0.002 v-0.004 h-0.002 v-0.003 h0.002 V0.119 h-0.002 V0.114 h0.002 V0.063 h-0.002 V0.06 h0.002 V0.05 h-0.002 V0.047 h0.006 V0.006 h-0.004 V0 h0.043 V0.047 h0.076 V0 h0.043 V0.006 h-0.004 V0.047 h0.006 v0.003 h-0.002 V0.06 h0.002 v0.003 h-0.002 V0.114 h0.003 v0.005 h-0.003 v0.028 h0.011 V0.1 h-0.005 V0.094 H0.692 v0.007 H0.687 v0.046 h0.011 V0.119 h-0.003 V0.114 h0.003 V0.063 h-0.002 V0.06 h0.002 V0.05 h-0.002 V0.047 h0.006 V0.006 h-0.004 V0 h0.043 V0.047 h0.076 V0 h0.043 V0.006 h-0.004 V0.047 h0.006 v0.003 h-0.002 V0.06 h0.002 v0.003 h-0.002 V0.114 h0.002 v0.005 h-0.002 v0.075 h0.002 v0.003 h-0.002 v0.004 h0.002 v0.003 h-0.002 V0.559 H1 M0.013,0.921 V0.889 h-0.004 v0.032 M0.299,0.194 h0.011 V0.162 H0.299 m0.693,0.727 V0.889 h-0.004 v0.032 m-0.293,-0.759 H0.687 v0.032 h0.011"></path></clipPath>
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
    width:65%;
    position: relative;
    .svg{
        position: absolute;
        left:100%;
        top:100%;
    }
    filter:drop-shadow(0 0 2vw rgba(255,53,142,.5));
    .clipped{
        width:100%;
        -webkit-clip-path: url(#hall-clip-path);
        clip-path: url(#hall-clip-path);
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
            opacity:0.7;
        }
    }
`;
