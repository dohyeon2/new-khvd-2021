import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useGlobal from '../hook/useGlobal';
import lotties from '../lotties';
import LottieElement from './LottieElement';

const LoadingLottie = React.memo((attr) =>
  <LottieElement {...attr} />
);

export function PageLoading({ }) {
  const { setGlobal, global } = useGlobal();
  const classList = [];
  const lottieElement = useRef();
  const { loading, loadingEnd } = global;
  if (loading) {
    classList.push("loading");
  }
  if (loading === "immediately") {
    classList.push("immediately");
  }
  const getLottie = (lottie) => {
    lottieElement.current = lottie;
  };

  useEffect(() => {
    const lottie = lottieElement.current;
    if (global.loadingEnd) {
      lottie.loop = false;
      lottie.playSegments([15, 63], true);
      lottie.onComplete = () => {
        setTimeout(() => {
          setGlobal({
            loading: false,
            loadingEnd: false
          });
        }, 500);
      };
    }
  }, [global.loadingEnd]);

  useEffect(()=>{
    if(loading){
      const lottie = lottieElement.current;
      lottie.playSegments([0, 15], true);
      lottie.loop = true;
    }
  },[global.loading]);

  return (
    <StyledPageLoading className={classList.join(" ")}
      immediately={global.loading === 'immediately'}
    >
      <LoadingLottie
        className="loading-lottie"
        getLottie={getLottie}
        noReset={true}
        lottieOption={{
          autoplay: false,
          loop: false,
          animationData: lotties['loading.json']
        }}
      />
      <div>
        {loading && !loadingEnd ? "LOADING..." : "DONE!"}
      </div>
    </StyledPageLoading>
  );
}

function Loading() {
  return (
    <div>
      ...loading
    </div>
  );
}

export function LoadingSpinner({ className, scale = 1 }) {
  return <StyledLoadingSpinner className={className} scale={scale}>
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </StyledLoadingSpinner>
}

export default Loading;

const StyledPageLoading = styled.div`
  position:fixed;
  z-index:9999;
  color:#fff;
  background-color: ${({ theme }) => theme.colors.secondary};
  inset:0;
  display:flex;
  align-items:center;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transition: opacity .5s ease-in-out;
  font-family: ${({ theme }) => theme.font.family.englishBold};
  font-size:2rem;
  &.immediately{
    transition: unset;
  }
  &.loading{
    pointer-events: auto;
    opacity: 1;
  }
  .loading-lottie{
    max-width:53.3rem;
    width:100vw;
  }
`;

const StyledLoadingSpinner = styled.div`
  color: official;
  display: inline-block;
  position: relative;
  width: ${p => p.scale * 40}px;
  height: ${p => p.scale * 40}px;
  &>div {
    transform-origin: ${p => p.scale * 20}px ${p => p.scale * 20}px;
    animation: lds-spinner 1.2s linear infinite;
  }
  &>div:after {
    content: " ";
    display: block;
    position: absolute;
    top: ${p => p.scale * 1.5}px;
    left: ${p => p.scale * 18.5}px;
    width: ${p => p.scale * 3}px;
    height: ${p => p.scale * 9}px;
    border-radius: 99px;
    background: #fff;
  }
  &>div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  &>div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  &>div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  &>div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  &>div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  &>div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  &>div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  &>div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  &>div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  &>div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  &>div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  &>div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;