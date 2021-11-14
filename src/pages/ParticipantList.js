import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getUserApi } from '../api/user';
import useGlobal from '../hook/useGlobal';
import { ProjectContainer, StyledProjectItem, ProjectListLayout } from './ProjectList';
import { Section } from './subpage/ProjectSearch';
import LottieElement from '../components/LottieElement';
import lotties from '../lotties';
import { LoadingSpinner } from '../components/Loading';
import { FlexCC } from '../components/Layout';
import theme from '../themes';
import { useHistory } from 'react-router';
import { WinnerIcon } from '../components/Icon';


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
        setGlobal({ appbarScrollInvert: true });
        setGlobal({ appbarSearch: true });
        setGlobal({ searchChange: appbarSearch });
    }, []);

    useEffect(() => {
        return () => {
            setGlobal({ pageTitle: null });
            setGlobal({ appbarSearch: false });
            setGlobal({ searchChange: null });
            setGlobal({ appbarScrollInvert: null });
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
                    <ParticipantSection>지도교수</ParticipantSection>
                    {professors?.map(printParticipant)}
                </>}
                {loading &&
                    <FlexCC>
                        <LoadingSpinner scale={2} />
                    </FlexCC>
                }
                {(!users?.length && !adiministrator_users?.length && !loading && !professors?.length)
                    &&
                    <div>
                        검색결과가 없습니다.
                    </div>
                }
            </ParticipantLayout>
        </PraticipantLayout>
    );
}

export default ParticipantList;

export function ParticipantItem({ picture, hoverPicture, name, className, winner, onClick, onlyProfileImage }) {
    const pictureClassList = ["picture"];
    const nameClassList = ["name"];
    const lottieRef = useRef();

    if (!picture) {
        pictureClassList.push("loading");
    }
    if (!name) {
        nameClassList.push("loading");
    }

    const getLottie = useCallback((lottie) => {
        lottieRef.current = lottie;
    }, []);

    const onMouseEnter = () => {
        if (lottieRef.current?.isPaused) {
            lottieRef.current.goToAndPlay(0);
        }
    }
    const matches = !onlyProfileImage ? name.match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]*)(.*)/) : "";
    const koreanName = matches && matches[1].trim();
    const englishName = matches && matches[2].trim();
    return (
        <ParticipantItemLayout
            className={className}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            {winner && <WinnerIcon winner={winner} />}
            <div className={pictureClassList.join(" ")} >
                <LottieElement
                    className="confetti_animation"
                    lottieOption={{
                        autoplay: false,
                        animationData: lotties['confetti.json'],
                        loop: false,
                        initialSegment: [10, 31]
                    }}
                    getLottie={getLottie}
                />
                <div className="images">
                    <img className="normal" src={picture} loading="lazy" />
                    <img className="confetti" src={hoverPicture} loading="lazy" />
                </div>
            </div>
            {!onlyProfileImage && <div className={nameClassList.join(" ")}>
                {koreanName}<br />
                {englishName}
            </div>}
        </ParticipantItemLayout>
    )
}

const PraticipantLayout = styled(ProjectListLayout)`

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

const ParticipantItemLayout = styled(StyledProjectItem)`
    position:relative;
    &:hover{
        img{
            &.normal{
                opacity:0;
            }
        }
    }
    .name{
        text-align:center;
    }
    .picture{
        filter:drop-shadow(0.2rem 0.2rem 0.2rem rgba(0,0,0,0.5));
        position:relative;
        background-color: #D8D7D1;
        display:flex;
        justify-content:center;
        align-items:center;
        &.loading{
            animation:unset;
            background-color: #D8D7D1;
            opacity:1;
        }
        .confetti_animation{
            pointer-events: none;
            z-index:4;
            position:absolute;
            width:140%;
            left:50%;
            transform:translateX(-50%);
            top:-10%;
        }
        img{
            width:100%;
            position:absolute;
            inset:0;
            &.normal{
                z-index:2;
                transition: opacity .2s ease-in-out;
            }
        }
        &::before{
            padding-top: 133%;
        }
    }
`;