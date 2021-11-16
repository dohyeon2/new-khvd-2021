import React from 'react';
import styled from 'styled-components';
import images from '../images';

function NoResult() {
    return (
        <StyledNoResult>
            <img src={images["oops@2x.png"]} /><br />
            검색결과가 없습니다.
        </StyledNoResult>
    );
}

export default NoResult;

const StyledNoResult = styled.div`
    width:100%;
    text-align:center;
    padding:5rem;
    box-sizing:border-box;
    color: #fff;
    font-size:1.2rem;
`;