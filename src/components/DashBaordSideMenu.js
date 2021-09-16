import React from 'react';
import styled from 'styled-components';
import { DashboardSideMenuBtn } from './Btns';

const DashboardSideMenuContainer = styled.div`
    background-color: #333;
    color:#fff;
    border-right: 1px solid #444;
`;

function DashboardSideMenu() {
    const DashboardSideMenuBtns = {
        
    };
    return (
        <DashboardSideMenuContainer>
            <DashboardSideMenuBtn>
            </DashboardSideMenuBtn>
        </DashboardSideMenuContainer>
    );
}

export default DashboardSideMenu;