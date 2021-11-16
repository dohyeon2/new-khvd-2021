import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { getUserApi } from '../api/user';
import { getPostApi } from '../api/project';
import useGlobal from '../hook/useGlobal';
import { Layout } from '../components/Layout';
import { ParticipantItem } from '../components/ParticipantItem';
import { getColorBrightness } from '../utils/functions';
import images from '../images';

function Participant() {

  const params = useParams();
  const { setGlobal, goTo } = useGlobal();
  const INITIAL_STATE = {
    user: null,
    projects: [],
  }
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    setGlobal({ pageTitle: "Participant" });
    setGlobal({ appbarStyle: 'participant invert shadow' });
    setGlobal({ floatingMenu: true });
    return () => {
      setGlobal({ pageTitle: null });
      setGlobal({ appbarStyle: null });
      setGlobal({ floatingMenu: false });
    }
  }, []);

  useEffect(() => {
    getUserApi({
      include: [params.id],
    }).then((res) => {
      setState(s => ({
        ...s,
        user: res.data.users[0]
      }));
    }).catch((error) => {
      console.log(error.response);
    });
    getPostApi({
      meta_key: "designerList",
      meta_value: params.id,
      meta_compare: "LIKE",
      thumbSize: 400,
    }).then((res) => {
      setState(s => ({
        ...s,
        projects: res.data.posts,
      }));
    }).catch((error) => {
      console.log(error.response);
    });
  }, []);

  const { user, projects } = state;

  if (!user) return null;

  const name = user.display_name || "";
  const matches = name.match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]*)(.*)/);
  const koreanName = matches && matches[1].trim();
  const englishName = matches && matches[2].trim();

  const contact = Object.keys(user.meta).filter(x => {
    return x.includes("contact");
  }).map(x => user.meta[x].value);

  const interview = Object.keys(user.meta).filter(x => x.includes("question_")).map(x => {
    const result = user.meta[x];
    if (x === "question_0") {
      result.color = user.meta["question_0_add"].value;
    }
    return result;
  });

  return (
    <ParticipantLayout>
      <HeadLayout>
        <ParticipantItem
          picture={user?.profile_image?.normal}
          hoverPicture={user?.profile_image?.confetti}
          onlyProfileImage={true}
          className={"profile-image"}
          winner={user?.award}
        />
        <div className="info">
          <div className="name">
            <div className="korean">{koreanName}</div>
            <div className="english">{englishName}</div>
          </div>
          <div className="bottom">
            {contact.length ? <div className="contact">
              <div className="label">Contact</div>
              <div className="value">
                {contact.map(x => x + "\n")}
              </div>
            </div> : null}
            <div className="project-label">Project</div>
            <div className="projects">
              {projects.map(x => <div className="project" onClick={() => { goTo('/project/' + x.category_slug + "/" + x.id, true) }} style={{ backgroundImage: `url(${x.thumbnail_small})` }} />)}
            </div>
          </div>
        </div>
      </HeadLayout>
      <div className="body">
        {interview.length ? <>
          <div className="interview">
            <div className="title">
              2021,<br />
              경희에서의 추억이 담긴 상자를 열어보다.
            </div>
            {interview.map((x, i, arr) => {
              if (x.question === "색상코드") return;
              return <div className="interview-row" key={i}>
                <div className="question">
                  {x.question}
                </div>
                <div className="answer">
                  {x.color && <div
                    className={`color ${(getColorBrightness(x.color) > 55 ? "bright" : "dark")}`}
                    style={{
                      backgroundColor: x.color
                    }}
                  >{x.color}</div>}
                  {x.value}
                </div>
              </div>
            })}
          </div>
          <div className='backgorund'>
            <div className="top"
              style={{
                backgroundImage: `url(${user?.profile_image?.interview})`
              }} />
            <div className="mid"
              style={{
                backgroundImage: `url(${images['background-mid-image.png']})`
              }}
            />
            <div className="bottom"
              style={{
                backgroundImage: `url(${user?.profile_image?.interview})`
              }} />
          </div>
        </> : null}
      </div>
      {user?.profile_image?.groupimage && <div className="group-photo">
        <div className="title">2021 졸업전시 준비위원회</div>
        <img src={user?.profile_image?.groupimage[0]} alt="" />
        <img src={user?.profile_image?.groupimage[1]} alt="" />
      </div>}
    </ParticipantLayout>
  );
}

export default Participant;

const HeadLayout = styled.div`
  display:flex;
  align-items:stretch;
  margin-bottom:11.11rem;
  @media screen and (max-width:${({ theme }) => theme.breakPoints.m * 0.75}px){
    flex-direction:column;
  }
  .profile-image{
    max-width:25.77rem;
    width:38.9%;
    margin-right:5.11rem;
    .winner-mark{
      width:13.9rem;
      top:-6.87rem;
      right:-4.83rem;
    }
    .picture{
      filter:unset;
      margin-bottom:0;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m * 0.75}px){
      max-width:100%;
      width:100%;
      margin-bottom:2.63rem;
      .winner-mark{
        width:30vw;
        top:-2rem;
        right:-2rem;
      }
      .picture{
        position:relative;
        background-color:transparent;
        align-items:flex-start;
        img{
          top:0;
        }
        &::before{
          padding-top:100%;
        }
        .images{
          background-color: #D8D7D1;
          position:absolute;
          inset:0;
          border-radius: 99rem;
          overflow:hidden;
        }
      }
    }
  }
  .info{
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    flex-grow:1;
    .name{
      margin-bottom:0.5rem;
      flex-shrink:0;
      display:flex;
      align-items:flex-end;
      @media screen and (max-width:${({ theme }) => theme.breakPoints.m * 0.75}px){
        margin-bottom:2.3083rem;
      }
      .korean{
        font-weight: 700;
        font-size:2.5rem;
        margin-right:0.8rem;
      }
      .english{
        font-size:1.667rem;
      }
    }
    .bottom{
      font-size:1.1rem;
      line-height:1.7;
      letter-spacing:${({ theme }) => theme.font.translateLetterSpacingRem(1.1, -20)};
      .contact{
        white-space:pre-wrap;
        margin-bottom:1rem;
        flex-shrink:0;
        .label{
          font-weight:700;
          color:${({ theme }) => theme.colors.secondary};
        }
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m * 0.75}px){
          margin-bottom:2.3083rem;
          .label{
            font-size:1.33rem;
            font-weight: 700;
            color:#000;
          }
        }
      }
      .project-label{
        display:none;
        width:100%;
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m * 0.75}px){
          display:block;
          margin-bottom:1.1rem;
          font-size:1.33rem;
          font-weight: 700;
        }
      }
      .projects{
        display:flex;
        margin-right:-1.45rem;
        .project{
          cursor:pointer;
          background-position: center;
          background-size:cover;
          position:relative;
          overflow: hidden;
          max-width:13.3rem;
          width:100%;
          display:flex;
          justify-content:center;
          align-items:center;
          margin-right:1.45rem;
          &::before{
            content:"";
            position:relative;
            display: block;
            padding-top:141.5%;
            inset:0;
          }
        }
      }
    }
  }
`;

const ParticipantLayout = styled(Layout)`
  background-image: none;
  background-color:#fff;
  padding-top: 14.4rem;
  max-width: 1280px;
  margin:0 auto;
  box-sizing:border-box;
  @media screen and (max-width:1440px){
    max-width: 1080px;
  }
  padding-right:2.5rem;
  padding-left:2.5rem;
  margin:0 auto;
  margin-bottom:11.12rem; 
  @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
    margin-bottom:0; 
  } 
  .group-photo{
    margin-top:10.67rem;
    .title{
      font-size:2.22rem;
      font-weight:900;
      letter-spacing:${({ theme }) => theme.font.translateLetterSpacingRem(2.22, -20)};
      margin-bottom:5.67rem;
    }
    img{
      width:100%;
      &:not(:last-of-type){
        margin-bottom:5.56rem;
      }
    }
  }
  .body{
    position:relative;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      width:100vw;
      left:-2.5rem;
    }
    .backgorund{
      width:100%;
      user-select:none;
      display:flex;
      flex-direction:column;
      position:absolute;
      inset:0;
      .top,
      .bottom{
        flex-shrink:0;
        flex-grow:0;
        width:100%;
        position:relative;
        background-position:bottom;
        background-size:100% auto;
        &::before{
          content:"";
          display:block;
          padding-top:62.5%;
        }
      }
      .mid{
        flex-grow:1;
        background-size:100% auto;
        background-position:center;
        background-repeat:repeat;
      }
      .bottom{
        top:-1px;
      }
      .top{
        background-position:top;
        &::before{
          content:"";
          display:block;
          padding-top:77.18%;
        }
      }
    }
    .interview{
      z-index:2;
      position:relative;
      top:0;
      padding:6.67rem 7.22rem 55vw;
      @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
        padding:2rem 2rem 55vw;
      }
      word-break: keep-all;
      line-height:1.5;
      .interview-row{
        margin-bottom:2.83rem;
      }
      .title{
        white-space:pre-wrap;
        font-size:2.22rem;
        font-weight:900;
        line-height:1.25;
        margin-bottom:5.55rem;
      }
      .question{
        margin-bottom:0.89rem;
        font-size:1.11rem;
        font-weight:900;
      }
      .answer{
        font-size:1.11rem;
        display:flex;
        align-items:center;
        .color{
          margin-right: 0.4rem;
          display: inline-block;
          padding:0.3rem 0.8rem 0.5rem;
          &.dark{
            color: #fff;
          }
          /* border-radius:0.99rem; */
        }
      }
    }
  } 
`;
