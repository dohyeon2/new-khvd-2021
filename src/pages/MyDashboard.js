import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import LoginBtn from '../components/LoginBtn';
import Loading from '../components/Loading';
import DashBoardAppBar from '../components/DashBoardAppBar';

const DashBoardContainer = styled.div`

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
        <DashBoardContainer>
            <DashBoardAppBar />
        </DashBoardContainer>
    );
}

export default MyDashboard;