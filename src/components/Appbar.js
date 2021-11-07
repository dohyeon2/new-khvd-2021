import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import useGlobal from '../hook/useGlobal';
import Logo from './Logo';
import HambergerMenu from './HambergerMenu';
import { useHistory } from 'react-router';

/**
 * 앱바
 */
function Appbar() {
  const menuWrapperClass = [];
  const { global } = useGlobal();
  const history = useHistory();
  const [hambergerMenu, setHambergerMenu] = useState(false);

  const handleClickHambergerMenu = () => {
    setHambergerMenu(s => !s);
  }

  useEffect(() => {
    setHambergerMenu(false);
  }, [history.location.pathname]);

  if (hambergerMenu) {
    menuWrapperClass.push("on");
  }

  if (!global.appbarVisibility) return null;

  return (
    <>
      <StyledAppbar>
        <div className="left">
          <Logo to={"/"} />
        </div>
        <div className="right">
          <HambergerMenu on={hambergerMenu} onClick={handleClickHambergerMenu} />
        </div>
      </StyledAppbar>
      <StyledMenuWrap className={menuWrapperClass.join(" ")} >
        <StyledMenuButton>버튼</StyledMenuButton>
      </StyledMenuWrap>
    </>
  );
}

export default Appbar;

const StyledAppbar = styled.div`
  padding:36px 70px;
  display:flex;
  align-items: center;
  z-index:99;
  justify-content:space-between;
  position:fixed;
  top:0;
  left:0;
  right:0;
  pointer-events:none;
  &>div{
    pointer-events: auto;
  }
`;

const StyledMenuWrap = styled.div`
  position:fixed;
  z-index:98;
  inset:0;
  pointer-events: none;
  opacity:0;
  background-color: rgba(0,0,0,0.7);
  transition: opacity .2s ease-in-out;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items:center;
  &.on{
    opacity:1;
    pointer-events: auto;
  }
`;

const StyledMenuButton = styled.button`
  &:active{
    outline:none;
  }
  &:hover,
  &.active{
    color:#FF358E;
  }
`;