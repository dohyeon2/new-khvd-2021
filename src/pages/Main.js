import React, { useRef } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import LottieElement from '../components/LottieElement';
import lotties from '../lotties';
import images from '../images';
import useGlobal from '../hook/useGlobal';

function Main() {
  const { goTo } = useGlobal();
  const lottieInstances = useRef({});
  const makeElement = (name) => {
    return {
      name: name,
    }
  }
  const topElements = [
    makeElement("participant"),
    makeElement("project"),
  ];
  const bottomElements = [
    makeElement("guestbook"),
    makeElement("popupstore"),
    makeElement("banner"),
  ];
  return (
    <MainLayout>
      <div className="top-element">
        <img className="main-sticker" src={images['main-sticker.png']} alt="" />
        {topElements.map(x => <div key={x} className={"elements" + " " + x.name + "-container"}
          onClick={() => {
            setTimeout(() => {
              goTo(x.name);
            }, 500);
          }}
          onMouseEnter={() => {
            const { currentFrame } = lottieInstances.current[x.name];
            lottieInstances.current[x.name].playSegments([Math.floor(currentFrame), lotties[x.name + ".json"].op], true);
          }}
          onMouseLeave={() => {
            const { currentFrame } = lottieInstances.current[x.name];
            lottieInstances.current[x.name].playSegments([Math.floor(currentFrame), 0], true);
          }}
        >
          <LottieElement
            getLottie={(lottie) => {
              lottieInstances.current[x.name] = lottie;
            }}
            noReset={true}
            className={`${x.name}-lottie`}
            lottieOption={{
              autoplay: false,
              loop: false,
              animationData: lotties[x.name + ".json"]
            }} />
        </div>)}
      </div>
      <div className="bottom-element">
        {bottomElements.map(x => <div key={x} className={"elements" + " " + x.name + "-container"}
          onClick={() => {
            setTimeout(() => {
              goTo(x.name);
            }, 500);
          }}
          onMouseEnter={() => {
            const { currentFrame } = lottieInstances.current[x.name];
            lottieInstances.current[x.name].playSegments([Math.floor(currentFrame), lotties[x.name + ".json"].op], true);
          }}
          onMouseLeave={() => {
            const { currentFrame } = lottieInstances.current[x.name];
            lottieInstances.current[x.name].playSegments([Math.floor(currentFrame), 0], true);
          }}
        >
          <LottieElement
            getLottie={(lottie) => {
              lottieInstances.current[x.name] = lottie;
            }}
            noReset={true}
            className={`${x.name}-lottie`}
            lottieOption={{
              autoplay: false,
              loop: false,
              animationData: lotties[x.name + ".json"]
            }} />
        </div>)}
      </div>
      <Layout className="background" />
    </MainLayout>
  );
}

export default Main;


const MainLayout = styled(Layout)`
  display:flex;
  flex-direction:column;
  align-items:center;
  .main-sticker{
    position:absolute;
    left:4rem;
    margin:-1rem;
    top:4rem;
    width:60vw;
    max-width:30rem;
    z-index:4;
  }
  .elements{
    position:relative;
    width:24rem;
    z-index:2;
    cursor:pointer;
    pointer-events:none;
    svg{
      pointer-events:visible;
    }
  }
  .bottom-element{
    position:relative;
    max-width:1280px;
    display:flex;
    width:100%;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      height:28rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      height:40rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      height:145vw;
      flex-direction:column;
      align-items:center;
    }
  }
  .top-element{
    position:relative;
    max-width:1280px;
    width:100%;
    display:flex;
    justify-content: space-between;
    margin-bottom:12rem;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      height:30rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      height:40rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      flex-direction:column;
      height:125vw;
    }
  }
  .project-container{
    width:50rem;
    max-width:115vw;
    margin:-5rem -8rem;
    position:absolute;
    right:0;
    z-index:2;
    flex-shrink:0;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      position:absolute;
      right:0;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      position:absolute;
      right:0;
      top:7rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      position:relative;
      top:unset;
      margin-top:10vw;
      order:1;
      margin-left:6vw;
    }
  }
  .participant-container{
    top:15rem;
    width:40rem;
    position:relative;
    z-index:3;
    flex-shrink:0;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      position:absolute;
      top:20rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      position:absolute;
      top:30rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      position:relative;
      top:unset;
      margin-top:10vw;
      width:40rem;
      order:2;
      max-width:100vw;
      left:-3vw;
    }
  }
  .banner-container{
    position:relative;
    z-index:2;
    width:39rem;
    margin:-5rem;
    left:5rem;
    max-width:100vw;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      position:absolute;
      right:0;
      left:unset;
      top:-5rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      top:-2rem;
      z-index:4;
      right:-5rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      position:relative;
      width:100vw;
      order:1;
    }
  }
  .guestbook-container{
    position:relative;
    z-index:3;
    width:18rem;
    max-width:100vw;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      width:20rem;
      max-width:100vw;
      position:absolute;
      left:20vw;
      top:1rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      width:22rem;
      max-width:100vw;
      left:5rem;
      position:absolute;
      top:3rem;
      z-index:5;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      position:relative;
      order:3;
      left:0;
      top:-5vw;
      width:60vw;
    }
  }
  .popupstore-container{
    width:28rem;
    position:relative;
    z-index:3;
    left:2rem;
    bottom:5rem;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.l}px){
      position:absolute;
      right:5rem;
      left:unset;
      bottom:0;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      right:1rem;
    }
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      position:relative;
      order:2;
      width:80vw;
    }
  }
  .background{
    pointer-events:none;
    position: fixed;
    z-index:1;
    inset:0;
  }
`;