import React from 'react';
import styled from 'styled-components';
import LoginBtn from './LoginBtn';

const DashboardAppBarContainer = styled.div`
    position:sticky;
    z-index:99;
    top:0;
    left:0;
    right:0;
    padding:.5rem 1rem;
    background-color: #444;
    border-bottom:1px solid #555;
    color:#fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

function DashboardAppBar() {
    return (
        <DashboardAppBarContainer className="dashboard-appbar">
            <div>KHVD 2021 GRAD. DASHBOARD</div>
            <div>
                <LoginBtn />
            </div>
        </DashboardAppBarContainer>
    );
}

export default DashboardAppBar;