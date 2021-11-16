import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getUserApi } from '../api/user';
import useGlobal from '../hook/useGlobal';
import { StyledProjectItem, ProjectListLayout } from './ProjectList';
import { Section } from './subpage/ProjectSearch';
import { LoadingSpinner } from '../components/Loading';
import { FlexCC } from '../components/Layout';
import theme from '../themes';
import { useHistory } from 'react-router';
import { ParticipantItem } from '../components/ParticipantItem';
import { Layout } from '../components/Layout';
import { ProjectContainer } from '../components/Container';
import images from '../images';
import NoResult from '../components/NoResult';

function ParticipantList() {
    const history = useHistory();
    const INITIAL_STATE = {
        users: [],
        adiministrator_users: [],
        professors: [],
        search: history.location.search.match(/s=(.*)/) ? history.location.search.match(/s=(.*)/)[1] : "",
        loading: true,
        row: 4,
    };
    const searchPending = useRef();
    const { setGlobal } = useGlobal();
    const [state, setState] = useState(INITIAL_STATE);
    const { goTo } = useGlobal();

    const appbarSearch = (value) => {
        if (value.length < 1) {
            history.push(history.location.pathname);
        }
        clearTimeout(searchPending.current);
        searchPending.current = setTimeout(() => {
            setState(s => ({
                ...s,
                search: value || "",
            }));
        }, 500);
    }

    const handleWindowResizeEvent = () => {
        const { innerWidth } = window;
        let row = 4;
        if (theme.breakPoints.m > innerWidth) {
            row = 3;
        }
        if (theme.breakPoints.s > innerWidth) {
            row = 2;
        }
        setState(s => ({
            ...s,
            row: row,
        }));
    }

    //초기화
    useEffect(() => {
        getUserApi({
            exclude: '1',
            role: 'Author'
        }).then((res) => {
            setState(s => ({
                ...s,
                users: res.data.users
            }));
        });
        getUserApi({
            exclude: '1',
            role: 'Administrator'
        }).then((res) => {
            setState(s => ({
                ...s,
                adiministrator_users: res.data.users
            }));
        });
        getUserApi({
            exclude: '1',
            role: 'Contributor'
        }).then((res) => {
            setState(s => ({
                ...s,
                professors: res.data.users
            }));
        });
        setGlobal({ pageTitle: "Participants" });
        setState(s => ({
            ...s,
            loading: false,
        }));
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleWindowResizeEvent);
        return () => {
            window.removeEventListener("resize", handleWindowResizeEvent);
        }
    }, []);

    useEffect(() => {
        setGlobal({
            appbarScrollInvert: true,
            appbarSearch: true,
            searchChange: appbarSearch
        });
    }, []);

    useEffect(() => {
        return () => {
            setGlobal({
                pageTitle: null,
                appbarSearch: false,
                searchChange: null,
                appbarScrollInvert: null
            });
        }
    }, []);

    const { users: usersList, adiministrator_users: adminUsersList, search, loading, professors: professorsList } = state;

    const getFilteredList = (list, search) => {
        const fitered = search !== "" ? list.filter(x => x.display_name.includes(decodeURI(search))) : list;
        const result = fitered.sort((a, b) => {
            if (!b.profile_image.normal && !a.profile_image.normal) return 0;
            if (!b.profile_image.normal) return -1;
            return 0;
        });
        return result;
    }

    const users = getFilteredList(usersList, search);
    const adiministrator_users = getFilteredList(adminUsersList, search);
    const professors = getFilteredList(professorsList, search);

    const onClickItem = (x) => {
        goTo('/participant/' + x.ID);
    }

    const printParticipant = (x) => <ParticipantItem
        onClick={() => { onClickItem(x) }}
        picture={x.profile_image.normal}
        hoverPicture={x.profile_image.confetti}
        key={x.ID}
        className="item"
        name={x.display_name}
        winner={x.award}
    />
    return (
        <PraticipantLayout>
            <ParticipantLayout>
                {users?.length > 0 && <>
                    <ParticipantSection>전시 참여자</ParticipantSection>
                    {users?.map(printParticipant)}
                </>}
                {adiministrator_users?.length > 0 && <>
                    <ParticipantSection>졸업전시준비위원회</ParticipantSection>
                    {adiministrator_users?.map(printParticipant)}
                </>}
                {professors?.length > 0 && <>
                    <ParticipantSection>전임교수 / 지도교수</ParticipantSection>
                    {professors?.map(printParticipant)}
                </>}
                {loading &&
                    <FlexCC>
                        <LoadingSpinner scale={2} />
                    </FlexCC>
                }
                {(!users?.length && !adiministrator_users?.length && !loading && !professors?.length)
                    &&
                    <NoResult />
                }
            </ParticipantLayout>
            <Layout className="layout" />
        </PraticipantLayout>
    );
}

export default ParticipantList;



const PraticipantLayout = styled(ProjectListLayout)`
    .item{
        .picture{
            height:unset;
            filter:drop-shadow(0.2rem 0.2rem 0.2rem rgba(0,0,0,0.5));
        }
    }
`;

const ParticipantSection = styled(Section)`
    margin-right:2rem;
    margin-left:2rem;
`;

const ParticipantLayout = styled(ProjectContainer)`
    margin:-2rem -3rem 0;
    .item{
        margin:2rem;
        width:calc(25% - 4rem);
        @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
            width:calc(33.333% - 4rem);
        }
        @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
            width:calc(50% - 4rem);
        }
    }
`;

