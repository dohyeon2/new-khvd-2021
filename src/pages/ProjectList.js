import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { apiURI } from '../vars/api';
import axios from 'axios';
import useGlobal from '../hook/useGlobal';
import images from '../images';
import theme from '../themes';
import ProjectSearch from './subpage/ProjectSearch';
import { getPostApi } from '../api/project';
import { WinnerIcon } from '../components/Icon';
import { ChevronBtn } from '../components/Btns';

function ProjectList({
  slug: slugAttr,
}) {
  const { setGlobal, goTo } = useGlobal();
  const history = useHistory();
  const INITIAL_STATE = {
    category: null,
    authors: null,
    projects: [],
    projectLoading: true,
    frames: {
      current: 0,
      maxFrame: 0.1,
      minFrame: 0,
      accFrame: null,
    },
    projectEnd: false,
    projectThumbWidth: null,
    currentProjectIdx: -1,
    wholeCount: null,
    row: null,
    searched: history.location.search.match(/s=(.*)/) ? history.location.search.match(/s=(.*)/)[1] : "",
    queries: {
      paged: 1,
      nopaging: 0,
      posts_per_page: 9,
      thumbSize: 600,
      post__not_in: [],
      orderby: "rand",
    },
    placeholder: [],
  };
  const params = useParams();
  const slug = slugAttr || params.categorySlug;
  const [state, setState] = useState(INITIAL_STATE);
  const windowResizeEventRef = useRef(false);
  const searchPending = useRef(null);

  const handleWindowResizeEvent = () => {
    const { innerWidth } = window;
    let row = 3;
    if (theme.breakPoints.m > innerWidth) {
      row = 2;
    }
    setState(s => ({
      ...s,
      row: row,
      queries: {
        ...s.queries,
        posts_per_page: row * 3,
      }
    }));
  }

  const getLengthArray = (N = 0, value = false) => {
    if (isNaN(N) || N < 0) return [];
    const arr = [];
    arr.length = N;
    return arr.fill(value);
  }


  useEffect(() => {
    handleWindowResizeEvent();
    if (!windowResizeEventRef.current) {
      window.addEventListener("resize", () => {
        handleWindowResizeEvent();
      });
    }
  }, []);

  useEffect(() => {
    axios.get(`${apiURI}khvd/v1/category/${slug}`).then(res => {
      setState(s => ({
        ...s,
        category: res.data,
        queries: {
          ...s.queries,
          cat: res.data.term_id,
        },
        wholeCount: res.data.count,
        loading: true,
      }));
    });
  }, [slug]);

  const appbarSearch = (value) => {
    if (value.length <= 1) {
      history.push(history.location.pathname);
    } else {
      clearTimeout(searchPending.current);
      searchPending.current = setTimeout(() => {
        setState(s => ({
          ...s,
          searched: value,
        }));
      }, 500)
    }
  }

  useEffect(() => {
    setGlobal({
      pageTitle: state.category?.meta.english_label,
      appbarScrollInvert: true,
      appbarSearch: true,
      searchChange: appbarSearch
    });
  }, [state.category]);

  useEffect(() => {
    return () => {
      setGlobal({
        pageTitle: null,
        appbarScrollInvert: null,
        appbarSearch: false,
        searchChange: null,
      });
    }
  }, []);

  //플레이스홀더 이미지 세팅
  useEffect(() => {
    const placeholder = [];
    for (let i = 0, len = 5; i < len; i++) {
      placeholder.push(images['icon_' + (i + 1) + ".png"]);
    }
    placeholder.sort(() => Math.random() - Math.random());
    setState(s => ({
      ...s,
      placeholder: placeholder,
    }));
  }, []);

  const getPost = (queries) => {
    getPostApi(queries).then(res => {
      setState(s => {
        const project = [...s.projects, ...res.data?.posts];
        return {
          ...s,
          projects: project,
          endOfPost: (project.length >= s.wholeCount || res.data.posts.length === 0),
          queries: {
            ...s.queries,
            post__not_in: [...s.queries.post__not_in, ...res.data.posts.map(x => x.id)]
          },
          loading: false,
        }
      });
      if (isScrollEnd()) {
        setState(s => ({
          ...s,
          loading: true,
        }));
      }
    });
  }

  //로딩 시 포스트 불러오기
  useEffect(() => {
    const queries = state.queries;
    if (state.loading && !state.endOfPost && !state.searched) {
      getPost(queries)
    }
  }, [state.loading, state.endOfPost, state.queries, state.searched]);

  //스크롤이 끝인지 판단
  const isScrollEnd = () => {
    return document.getElementById("root").scrollTop + window.innerHeight >= document.getElementById("root").scrollHeight - 100;
  }

  //스크롤 끝일때 로딩 지정
  useEffect(() => {
    document.getElementById("root").addEventListener('scroll', () => {
      if (isScrollEnd() && !state.endOfPost) {
        setState(s => ({
          ...s,
          loading: true,
        }));
      }
    });
  }, [state.endOfPost]);

  const { projects, queries, wholeCount, endOfPost, row, placeholder, searched, category } = state;

  const dummyCount = Math.min(queries.posts_per_page, wholeCount - projects.length);

  return (
    <ProjectListLayout>
      <ProjectContainer>
        {searched ?
          <ProjectSearch
            currentCategory={category}
            search={searched}
            row={row}
          />
          :
          <>{projects.map(x => <ProjectItem
            className="item"
            key={x?.id}
            title={x?.title}
            thumbnail={x?.thumbnail_small}
            designer={x?.designer_list?.map(y => y.name).join(",\n")}
            onClick={() => {
              goTo("/project/" + slug + "/" + x.id, true);
            }}
            winner={x.winner}
          />)}
            {state.loading && getLengthArray(dummyCount).map(x => <ProjectItem className="item" />)}
            {getLengthArray((row - ((projects.length + dummyCount) % row)) % row).map((x, i) => <PlaceHolder className="item"><img src={placeholder[i]}></img></PlaceHolder>)}
            {(endOfPost) &&
              <div className="endoflist-wrap">
                <img className="endoflist-icon" src={images['endoflist.svg']} alt="" />
                <ChevronBtn onClick={() => {
                  goTo('/project');
                }}>
                  다른 카테고리 보기
                </ChevronBtn>
                <ChevronBtn
                  onClick={() => {
                    goTo('/guest-book')
                  }}
                >
                  방명록 쓰러가기
                </ChevronBtn>
              </div>
            }
          </>}
      </ProjectContainer>
    </ProjectListLayout>
  );
}

export default ProjectList;

export function ProjectItem({
  thumbnail,
  designer,
  title,
  className,
  onClick,
  winner
}) {
  const thumbnailClassList = ["thumbnail"];
  const titleClassList = ["title"];
  const designerClassList = ["designer"];
  const INITIAL_STATE = {
    loading: true,
  };
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    const image = new Image();
    image.src = thumbnail;
    image.addEventListener('load', () => {
      setState(s => ({
        ...s,
        loading: false,
      }));
    });
  }, []);

  const { loading } = state;

  if (loading) thumbnailClassList.push("loading");
  if (!title) titleClassList.push("loading");
  if (!designer) designerClassList.push("loading");

  return (
    <StyledProjectItem className={className} onClick={onClick}>
      {winner && <WinnerIcon winner={winner} />}
      <div
        className={thumbnailClassList.join(" ")}
        style={{
          backgroundImage: (!loading && `url(${thumbnail})`)
        }}
      />
      <div className="info">
        <div className={titleClassList.join(" ")}>
          {title}
        </div>
        <div className={designerClassList.join(" ")}>
          {designer}
        </div>
      </div>
    </StyledProjectItem>
  )
}

const PlaceHolder = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  img{
    max-width:100%;
    max-height:100%;
  }
`;

export const ProjectListLayout = styled(Layout)`
  padding:2rem;
  padding-top:10rem;
  display:flex;
  justify-content: flex-start;
  align-items:center;
  box-sizing:border-box;
  background-attachment: fixed;
  flex-direction:column;
  .endoflist-wrap{
    margin:4rem 0;
    opacity:0;
    animation:fadeIn forwards .4s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items:center;
    width:100%;
  }
  .endoflist-icon{
    max-width:320px;
    width:100%;
    margin:1rem;
  }
`

export const ProjectContainer = styled.div`
  display:flex;
  justify-content:flex-start;
  flex-wrap:wrap;
  width:100%;
  max-width:1280px;
  margin:-2rem -3rem 0;
  .item{
    width:calc(33.333% - 6rem);
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      width:calc(50% - 6rem);
    }
    box-sizing:border-box;
    margin:3rem;
    transition:transform .2s ease-in-out;
    &:hover{
      transform:scale(1.2);
    }
  }
`;

export const StyledProjectItem = styled.div`
  position: relative;
  .winner-mark{
      position:absolute;
      width:8.5rem;
      top:-4rem;
      right:-3rem;
      z-index:5;
  }
  div.loading{
      content:"loading";
      display:flex;
      justify-content: center;
      align-items:center;
      opacity:0;
      animation:loadingPlaceholder ease-in-out infinite alternate 1s,fadeIn forwards .4s ease-in-out;
  }
  .picture,
  .thumbnail{
    cursor: pointer;
    background-color: #000;
    background-size: cover;
    background-position: center;
    margin-bottom:0.5rem;
    &::before{
      content:"";
      display: block;
      padding-top: 140%;
    }
  }
  .info{
    width:100%;
  }
  .designer{
    white-space: pre-wrap;
    line-height:1.6;
    min-height:1rem;
    width:100%;
    color:rgba(255,255,255,.6);
  }
  .name,
  .title{
    margin-bottom:0.5rem;
    min-height:1.4rem;
    width:100%;
    color:#fff;
    font-size:1.4rem;
    word-break:keep-all;
    line-height:1.4;
    font-weight:700;
  }
`;