import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import LoginBtn from './LoginBtn';
import { StyledUserConfigure } from './UserConfigure';
import styled from 'styled-components';

function UserInfo() {
    const { user } = useSelector(s => s);
    const userMeta = JSON.parse(user.data?.wordpressData?.meta?.common || "{}");
    const userMetaKeys = Object.keys(userMeta);
    userMetaKeys.sort();
    if (user.loading) return null;
    if (!user.data) return null;
    return (
        <StyledUserInfo>
            <div className="configure-wrap" >
                <ul>
                    {userMetaKeys.map((x, i) => {
                        const data = userMeta[x];
                        if (!data.value) return null;
                        return <li key={i}><b>{data.question}</b><span>{data.value}</span></li>
                    }
                    )}
                </ul>
            </div>
        </StyledUserInfo>
    );
}

export default UserInfo;

const StyledUserInfo = styled(StyledUserConfigure)`
    li{
        b{
            display:block;
            margin-bottom:5px;
        }
        margin-bottom:20px;
    }
`;