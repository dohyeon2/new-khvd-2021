import styled from 'styled-components';
import React, { useEffect, useState, useRef } from 'react';
import useGlobal from '../hook/useGlobal';
import Logo from './Logo';
import HambergerMenu from './HambergerMenu';
import { useHistory } from 'react-router';
import images from '../images';

/**
 * 앱바
 */
const Appbar = React.memo(() => {
  const appBar = useRef();
  const menuWrapperClass = [];
  const { global, goTo } = useGlobal();
  const history = useHistory();
  const searchRef = useRef();
  const [hambergerMenu, setHambergerMenu] = useState(false);
  const [state, setState] = useState({
    invert: false,
    minimize: false,
    searchInput: false,
    query: "",
  });
  const classList = [];
  const berforeScrollTopRef = useRef(0);

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
    makeMenuObj("/", "UNBOXING"),
    makeMenuObj("/project", "PROJECTS"),
    makeMenuObj("/participant", "PARTICIPANT"),
    makeMenuObj("/guestbook", "GUEST BOOK"),
    makeMenuObj("/popupstore", "POP-UP STORE"),
    makeMenuObj("/banner", "BANNER"),
  ];

  history.listen(() => {
    setHambergerMenu(false);
    setState(s => ({
      ...s,
      minimize: false,
    }))
  });

  useEffect(() => {
    searchRef.current?.focus();
  }, [state.searchInput]);

  useEffect(() => {
    function handleScorllEvent(event) {
      if (!appBar.current) return;
      if (this.scrollTop > 100) {
        appBar.current.classList.add("minimize");
        if (berforeScrollTopRef.current > this.scrollTop) {
          appBar.current.classList.add("invert");
          appBar.current.classList.remove("minimize");
        }
      } else {
        appBar.current.classList.remove("minimize");
        appBar.current.classList.remove("invert");
      }
      berforeScrollTopRef.current = this.scrollTop;
    }
    const root = document.getElementById("root");
    const projectContainer = document.getElementsByClassName("project-container")[0];
    root.removeEventListener("scroll", handleScorllEvent);
    root.addEventListener("scroll", handleScorllEvent);
    if (projectContainer) {
      projectContainer.removeEventListener("scroll", handleScorllEvent);
      projectContainer.addEventListener("scroll", handleScorllEvent);
    }
    return () => {
      if (projectContainer) {
        projectContainer.removeEventListener("scroll", handleScorllEvent);
      }
      root.removeEventListener("scroll", handleScorllEvent);
    }
  }, [global.appbarVisibility, global.appbarStyle]);

  useEffect(() => {
    setState(s => ({
      ...s,
      searchInput: (Boolean(global.appbarSearch) && s.searchInput),
    }));
  }, [global]);
  if (hambergerMenu) {
    menuWrapperClass.push("on");
  }

  if (!global.appbarVisibility) return null;

  if (global.appbarStyle) {
    classList.push(global.appbarStyle);
  }
  if (state.invert) {
    classList.push("invert");
  }
  if (state.searchInput) {
    classList.push("searchInput");
  }
  if (state.minimize) {
    classList.push("minimize");
  }

  return (
    <>
      <StyledAppbar ref={appBar} className={classList.join(" ")} luma={global.appbarBrightness}>
        <div className="left">
          <Logo to={"/"} />
        </div>
        <div className="center">
          {global.pageTitle}
        </div>
        <div className="right">
          {state.searchInput && <SearchInput
            onInput={(e) => {
              const target = e.target;
              const value = target.value;
              global.searchChange(value);
            }}
            ref={searchRef}
          />}
          {state.query.length === 1 && <div></div>}
          {global.appbarSearch && <SearchBtn ison={state.searchInput}
            onClick={() => {
              setState(s => ({
                ...s,
                searchInput: !s.searchInput,
              }));
              global.searchChange(false);
            }}
          />}
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
});

export default Appbar;

const SearchInput = styled.input`
  margin-right:0.8rem; 
  max-width:22rem;
  width:100%;
  color:#fff;
  background-color: transparent;
  border:0;
  border-bottom:0.24rem solid #fff;
  padding:0.4rem;
  &:focus{
    outline: 1px solid ${({ theme }) => theme.colors.primary};
    border-bottom:0.24rem solid ${({ theme }) => theme.colors.primary};
  }
`;

const SearchBtn = styled.button`
  display:flex;
  width:auto;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border:0;
  background-image: url("${p => p.on ? images['icon_ex.png'] : images['icon_search.png']}");
  background-repeat:no-repeat;
  background-size: contain;
  width:2rem;
  height:2rem;
  margin-right:1.2rem;
  margin-top:0.1rem;
  cursor: pointer;
`;


const StyledAppbar = styled.div`
  padding:1.5rem 5rem;
  @media screen and (max-width:900px){
    padding:2rem 3.8rem;
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
  transition:transform .2s ease-in-out, background-color .2s ease-in-out;
  &>div,
  &>input{
    pointer-events: auto;
    filter:${p => p.luma > 50 && `brightness(0%)`};
    transition: filter .2s ease-in-out;
  }
  .left{
    position: relative;
    margin-right:1rem;
  }
  &.searchInput{
    .center{
      display:none;
    }
  }
  .center{
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      display:none;
    }
    z-index:1;
    position: absolute;
    transform:translate(-50%,-50%);
    top:50%;
    left:50%;
    font-size:2.23rem;
    color:${p => p.luma > 50 ? "#000" : "#fff"};
    font-weight: 900;
    font-family: ${({ theme }) => theme.font.family.nanumSquare};
  }
  .right{
    display:flex;
    align-items: center;
    justify-content: flex-end;
    z-index:2;
    position: relative;
  }
  &.minimize{
    transform: translateY(-100%);
  }
  &.project{
    background-color: rgba(255,255,255,.3);
  }
  &.invert{
    background-color: #fff;
    &>div{
      filter:brightness(0%);
    }
  }
  &.shadow{
    filter:drop-shadow(0px 0px 0.5rem rgba(0,0,0,.2));
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
  flex-shrink: 0;
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