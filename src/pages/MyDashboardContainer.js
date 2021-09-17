import React from 'react';
import MyDashboard from '../components/MyDashboard';
import Editor from '../components/Editor';

function MyDashboardContainer({ match }) {
    return (
        <MyDashboard>
            <Editor></Editor>
        </MyDashboard>
    );
}

export default MyDashboardContainer;