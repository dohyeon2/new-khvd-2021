import styled from 'styled-components';

export const FlexCC = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
    position: fixed;
    inset:0;
`;

export const Layout = styled.div`
  position:relative;
  width:100%;
  min-height:100%;
  background-image:${({ theme }) => theme.backgorundImage};
  background-size:cover;
  background-position:center;
  background-color:${({ theme }) => theme.colors.background};
`;
