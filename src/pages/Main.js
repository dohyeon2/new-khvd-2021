import React from 'react';
import styled from 'styled-components';

export const Layout = styled.div`
  position:relative;
  width:100%;
  min-height:100%;
  background-image:${({ theme }) => theme.backgorundImage};
  background-size:cover;
  background-position:center;
  background-color:${({ theme }) => theme.colors.background};
`;

function Main() {
  return (
    <Layout>
    </Layout>
  );
}

export default Main;
