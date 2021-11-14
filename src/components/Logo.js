import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import images from '../images';

/**
 * 로고 컴포넌트
 * @param {object} attr {to = 클릭시 이동할 링크} 
 */
function Logo({ to }) {
    const history = useHistory();
    return (
        <StyledLogo className="logo" onClick={() => {
            history.push(to);
        }}>
            <img src={images['logo.png']} alt="KHVD" />
        </StyledLogo>
    );
}

export default Logo;

const StyledLogo = styled.div`
    position:relative;
    display:inline-flex;
    align-items:center;
    justify-content: center;
    cursor:pointer;
    img{
        height:3.8rem;
    }
`;