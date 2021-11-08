import React from 'react';
import styled from 'styled-components';
import DashboardAppBar from './DashboardAppBar';
import DashboardSideMenu from './DashboardSideMenu';

const DashboardContainer = styled.div`
    position: absolute;
    left:0;
    right:0;
    bottom:0;
    top:0;
    display: flex;
    flex-direction: column;
    .dashboard-layout{
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
    }
    .dashboard-appbar{
        flex-grow: 0;
        flex-shrink: 0;
    }
    .dashboard-body{
        background-color: #fff;
        flex-grow: 1;
        align-items: stretch;
        overflow-y: auto;
        position: relative;
        &>div{
            position: absolute;
            left:0;
            right:0;
            top:0;
            bottom:0;
        }
    }
    .dashboard-sidemenu{
        flex-shrink: 0;
    }
`;

function MyDashboard({ children }) {
    return (
        <DashboardContainer>
            <DashboardAppBar />
            <div className="dashboard-layout">
                <DashboardSideMenu />
                <div className="dashboard-body">
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </DashboardContainer>
    );
}

export default MyDashboard;