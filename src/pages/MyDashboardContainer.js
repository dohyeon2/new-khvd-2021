import React from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import MyDashboard from '../components/MyDashboard';
import EditWork from './dashboard/EditWork';
import LoginPage from './LoginPage';
import UserConfigure from './UserConfigure';

function MyDashboardContainer({ match }) {
    //global states
    const { user } = useSelector(s => s);

    if (user.loading) {
        return (<Loading />);
    }

    if (!user.data) {
        return (<LoginPage />);
    }

    if (!user.data.wordpressData?.data?.meta?.common) {
        return (<UserConfigure />);
    }

    return (
        <MyDashboard>
            <EditWork></EditWork>
        </MyDashboard>
    );
}

export default MyDashboardContainer;