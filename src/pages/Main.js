import React from 'react';
import styled from 'styled-components';
import images from '../images';

function Main() {
  return (
    <StyledMain>
      Hello React!
    </StyledMain>
  );
}

export default Main;

const StyledMain = styled.div`
  position:fixed;
  inset:0;
  background-image:url(${images['intro-background.png']});
  background-size:cover;
  background-position:center;
`;