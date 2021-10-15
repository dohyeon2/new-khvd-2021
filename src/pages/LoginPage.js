import React from 'react';
import LoginBtn from '../components/LoginBtn';
import styled from 'styled-components';

const LoginPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
`;

function LoginPage() {
    return (
        <LoginPageContainer>
            <h1>KHVD GRAD. Dashboard</h1>
            <LoginBtn></LoginBtn>
        </LoginPageContainer>
    );
}

export default LoginPage;