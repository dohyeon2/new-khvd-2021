import React from 'react';
import MyDashboard from '../components/MyDashboard';
import EditWork from './dashboard/EditWork';

function MyDashboardContainer({ match }) {
    return (
        <MyDashboard>
            <EditWork></EditWork>
        </MyDashboard>
    );
}

export default MyDashboardContainer;