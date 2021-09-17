import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DashboardSideMenuBtn } from './Btns';

const DashboardSideMenuAnimationWrap = styled.div`
    position: relative;
    overflow-x:hidden;
    display: flex;
    justify-content: flex-end;
    width: 400px;
    transition: width .3s ease-in-out;
    &.hide{
        width: 46.59px;
        .show-toggle-btn{
            svg{
                transform:scaleX(-1);
            }
        }
    }
`;
const DashboardSideMenuContainer = styled.div`
    width: 400px;
    background-color: #333;
    color:#fff;
    border-right: 1px solid #444;
    position: absolute;
    top:0;
    bottom:0;
`;

const DashBoardProfileSection = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    border-bottom:1px solid #444444;
    .left{
        display: flex;
        align-items: stretch;
    }
    .profile-image{
        padding:1rem;
        flex-shrink: 0;
        flex-grow:0;
    }
    .user-name{
        display: flex;
        align-items: center;
        padding:1rem 0;
    }
    .show-toggle-btn{
        cursor: pointer;
        border:0;
        padding:0 .8rem;
        display: flex;
        align-items: center;
        background-color:transparent;
        border-left:1px solid #444444;
        svg{
            path{
                fill:#fff;
            }
        }
    }
`;

const ProfileImage = styled.div`
    background-image:${p => `url(${p.src})`};
    background-size: cover;
    background-position: center;
    width:50px;
    height:50px;
    border-radius:99px;
`;

function DashboardSideMenu() {
    const { user } = useSelector(s => s);
    const initialState = {
        drawerShow: true,
    };
    const [state, setState] = useState(initialState);
    const toggleDrawer = () => {
        setState(s => ({
            ...s,
            drawerShow: !s.drawerShow
        }));
    }
    const DashboardSideMenuBtns = [
        {
            label: "내 작품",
        },
        {
            label: "작품 올리기",
        }
    ];

    return (
        <DashboardSideMenuAnimationWrap className={[(!state.drawerShow ? "hide" : null)].join(" ")}>
            <DashboardSideMenuContainer className="dashboard-sidemenu">
                <DashBoardProfileSection>
                    <div className="left">
                        <div className="profile-image"><ProfileImage src={user.data.googleData.profileObj.imageUrl} /></div>
                        <div className="user-name">{user.data.wordpressData.data.display_name}</div>
                    </div>
                    <button className="show-toggle-btn" onClick={toggleDrawer}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                            <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </button>
                </DashBoardProfileSection>
                {DashboardSideMenuBtns.map((x, i) => <DashboardSideMenuBtn key={i}>
                    {x.label}
                </DashboardSideMenuBtn>)}
            </DashboardSideMenuContainer>
        </DashboardSideMenuAnimationWrap>
    );
}

export default DashboardSideMenu;