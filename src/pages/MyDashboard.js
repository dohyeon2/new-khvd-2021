import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import LoginBtn from '../components/LoginBtn';

const DashBoardContainer = styled.div`

`;

function MyDashboard() {
    //global states
    const { user } = useSelector(s => s);
    const dispatch = useDispatch();

    if (user.loading) {
        return (<div>Loading...</div>);
    }

    if (!user.data) {
        return (<LoginBtn />);
    }

    return (
        <DashBoardContainer>
            <LoginBtn />
        </DashBoardContainer>
    );
}

export default MyDashboard;