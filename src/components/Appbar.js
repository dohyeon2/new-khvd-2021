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
  const { global, goTo } = useGlobal();
  const history = useHistory();
  const [hambergerMenu, setHambergerMenu] = useState(false);

  const handleClickHambergerMenu = () => {
    setHambergerMenu(s => !s);
  }

  const makeMenuObj = (link, label) => {
    return {
      link: link,
      label: label,
      current: (link === (history.location.pathname || "/")),
    }
  }

  const menuList = [
    makeMenuObj("/", "UNBOXSING"),
    makeMenuObj("/project", "PROJECTS"),
    makeMenuObj("/participant", "PARTICIPANT"),
    makeMenuObj("/guestbook", "GUEST BOOK"),
    makeMenuObj("/popupstore", "POP-UP STORE"),
    makeMenuObj("/banner", "BANNER"),
  ];

  history.listen(() => {
    setHambergerMenu(false);
  });

  if (hambergerMenu) {
    menuWrapperClass.push("on");
  }

  if (!global.appbarVisibility) return null;

  return (
    <>
      <StyledAppbar className={(global.appbarStyle || "")} luma={global.appbarBrightness}>
        <div className="left">
          <Logo to={"/"} />
        </div>
        <div className="center">
          {global.pageTitle}
        </div>
        <div className="right">
          <HambergerMenu on={hambergerMenu} onClick={handleClickHambergerMenu} />
        </div>
      </StyledAppbar>
      <StyledMenuWrap className={menuWrapperClass.join(" ")} >
        {menuList.map((x, i) => <StyledMenuButton
          key={i} idx={i}
          className={(x.current ? "current" : "") + " " + (hambergerMenu ? "on" : "")}
          onClick={() => {
            goTo(x.link);
          }}
        >{x.label}</StyledMenuButton>)}

      </StyledMenuWrap>
    </>
  );
}

export default Appbar;

const StyledAppbar = styled.div`
  padding:1.5rem 5rem;
  @media screen and (max-width:900px){
    padding:2.5rem;
  }
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
    filter:${p => p.luma > 50 && `brightness(0%)`};
  }
  .center{
    font-size:2.23rem;
    color:${p => p.luma > 50 ? "#000" : "#fff"};
  }
  &.project{
    background-color: rgba(255,255,255,.3);
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
  padding:0;
  border:0;
  background-color:transparent;
  color:${({ theme }) => theme.colors.foreground};
  font-family: ${({ theme }) => theme.font.family.englishBold};
  font-size:3.3rem;
  line-height: 1.5;
  cursor:pointer;
  letter-spacing: ${({ theme }) => theme.font.translateLetterSpacing(60, -20)};
  opacity: 0;
  transform: translateY(20%);
  &.on{
    opacity: 1;
    transform: translateY(0%);
    transition:color .2s ease-in-out, opacity .4s ${p => 0.2 * p.idx}s ease-in-out, transform .4s ${p => 0.2 * p.idx}s ease-in-out;
  }
  &:active{
    outline:none;
  }
  &:hover,
  &.current{
    color:${({ theme }) => theme.colors.primary};
  }
`;