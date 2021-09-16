import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import LoginBtn from '../components/LoginBtn';
import Loading from '../components/Loading';
import DashboardAppBar from '../components/DashBoardAppBar';
import DashboardSideMenu from '../components/DashBaordSideMenu';

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
        background-color: #222;
        color:#fff;
        flex-grow: 1;
        align-items: stretch;
        overflow-y: auto;
    }
`;

function MyDashboard() {
    //global states
    const { user } = useSelector(s => s);

    if (user.loading) {
        return (<Loading />);
    }

    if (!user.data) {
        return (<LoginBtn />);
    }

    return (
        <DashboardContainer>
            <DashboardAppBar />
            <div className="dashboard-layout">
                <DashboardSideMenu />
                <div className="dashboard-body">

                </div>
            </div>
        </DashboardContainer>
    );
}

export default MyDashboard;