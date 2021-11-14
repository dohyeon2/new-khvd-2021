import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import MyDashboard from '../components/MyDashboard';
import EditWork from './dashboard/EditWork';
import LoginPage from './LoginPage';
import { Switch, Route } from "react-router-dom";
import UserConfigure from './dashboard/UserConfigure';
import UserInfo from './dashboard/UserInfo';
import UserList from './dashboard/UserList';
import ProjectList from './dashboard/ProjectList';
import useGlobal from '../hook/useGlobal';

function MyDashboardContainer({ match }) {

    const { setGlobal } = useGlobal();
    //global states
    const { user } = useSelector(s => s);

    useEffect(() => {
        setGlobal({
            appbarVisibility: false,
        });
        setGlobal({
            footer: false,
        });
        return () => {
            setGlobal({
                appbarVisibility: true,
            });
            setGlobal({
                footer: true,
            });
        }
    }, []);
    if (user.loading) {
        return (<Loading />);
    }

    if (!user.data) {
        return (<LoginPage />);
    }
    return (
        <MyDashboard>
            <Switch>
                {!user.data.wordpressData?.meta?.common
                    && <Route path="/my-dashboard">
                        <UserConfigure></UserConfigure>
                    </Route>}
                <Route path="/my-dashboard/user-config">
                    <UserConfigure></UserConfigure>
                </Route>
                <Route path="/my-dashboard/edit-work/:id">
                    <EditWork></EditWork>
                </Route>
                <Route path="/my-dashboard/edit-work">
                    <EditWork></EditWork>
                </Route>
                <Route path="/my-dashboard/projects">
                    <ProjectList></ProjectList>
                </Route>
                {user.data.isAdmin && [<Route path="/my-dashboard/users-info">
                    <UserList></UserList>
                </Route>]}
                <Route path="/my-dashboard">
                    <UserInfo></UserInfo>
                </Route>
            </Switch>
        </MyDashboard>
    );
}

export default MyDashboardContainer;