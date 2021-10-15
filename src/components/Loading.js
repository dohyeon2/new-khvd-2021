import React from 'react';
import styled from 'styled-components';

export function PageLoading() {
  return (
    <StyledPageLoading>
      ...loading
    </StyledPageLoading>
  );
}

function Loading() {
  return (
    <div>
      ...loading
    </div>
  );
}

export default Loading;

const StyledPageLoading = styled.div`
  position:fixed;
  z-index:99;
  background-color: #fff;
  top:0;
  left:0;
  bottom:0;
  right:0;
`;