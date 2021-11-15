import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styled from 'styled-components';

function LottieElement({
  lottieOption,
  getLottie,
  className,
  initialSegment,
  noReset,
  play,
}) {
  const classList = ["lottie-element"];
  const lottieWrapperRef = useRef();
  const lottieInstanceRef = useRef({});
  classList.push(className);

  useEffect(() => {
    if (lottieWrapperRef.current) {
      if ('destroy' in lottieInstanceRef.current) {
        lottieInstanceRef.current.destroy();
      }
      lottieInstanceRef.current = lottie.loadAnimation({
        container: lottieWrapperRef.current, // the dom element that will contain the animation: ;
        renderer: 'svg',
        loop: true,
        initialSegment: initialSegment,
        autoplay: true,
        ...lottieOption,
      });
      getLottie && getLottie(lottieInstanceRef.current);
    }
  }, [(noReset ? null : lottieOption)]);

  useEffect(() => {
    if (play) {
      lottieInstanceRef.current.play();
    }
  }, [play]);

  return (
    <StyledlottieElement
      className={classList.join(" ")}
      ref={lottieWrapperRef}
    />
  );
}

export default LottieElement;

const StyledlottieElement = styled.div`

`;