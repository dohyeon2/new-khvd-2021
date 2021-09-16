import React from 'react';
import styled from 'styled-components';
import LoginBtn from './LoginBtn';

const DashBoardAppBarContainer = styled.div`
    position:sticky;
    top:0;
    left:0;
    right:0;
    padding:.5rem;
    border:1px solid #ccc;
    display: flex;
    justify-content: space-between;
`;

function DashBoardAppBar() {
    return (
        <DashBoardAppBarContainer>
            <div></div>
            <div>
                <LoginBtn />
            </div>
        </DashBoardAppBarContainer>
    );
}

export default DashBoardAppBar;