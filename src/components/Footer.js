import React from 'react';
import images from '../images';
import styled from 'styled-components';
import Logo from './Logo';

function Footer() {
  return (
    <FooterLayout>
      <div className="text-layout">
        <div className="logo-icons">
          <Logo />
          <div className="icons">
            <img className="icon" src={images['insta.png']} alt="" />
            <img className="icon" src={images['facebook.png']} alt="" />
            <img className="icon" src={images['youtube.png']} alt="" />
          </div>
        </div>
        <div className="description">
          <div className="top">
            <div className="col">
              <div className="header">UNBOXING</div>
              2021 KHVD 30TH GRADUATION
            </div>
            <div className="col">
              <div className="header">Offline Goods-Store</div>
              경기도 수원시 영통구 영통동 1024-14
            </div>
            <div className="col">
              경희대학교 예술디자인대학 시각디자인학과 (446701)<br />
              경기도 용인시 기흥구 덕영대로 1732<br />
              TEL : 031) 201-2672~4 FAX : 031) 204-8127
            </div>
          </div>
          <div className="bottom">
            Copyright (C) Kyung Hee University of Art&Design Visual Design.  All rights reserved.
          </div>
        </div>
      </div>
      <img className="left-circle" src={images['left_circle.png']} alt="" />
      <img className="right-star" src={images['right_star.png']} alt="" />
    </FooterLayout>
  );
}

export default Footer;

const FooterLayout = styled.div`
  background-image: url(${images['footer-bg.png']});
  position: relative;
  overflow: hidden;
  width:100%;
  .text-layout{
    width:100%;
    padding:2.4rem 5.5rem;
    box-sizing:border-box;
    position:relative;
    z-index:2;
    display:flex;
    justify-content:space-between;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      flex-wrap:wrap;
      padding:2.4rem;
    }
    .description{
      color:#fff;
      flex-grow:1;
      display:flex;
      flex-direction:column;
      max-width:1250px;
      font-size:1rem;
      letter-spacing: ${({ theme }) => theme.font.translateLetterSpacingRem(1, -20)};
      .top{
        flex-wrap:wrap;
        display:flex;
        margin:0 -1.5rem;
        line-height: 1.67;
        .col{
          .header{
            font-weight:900;
          }
          margin:0 1.5rem;
          margin-bottom:2rem;
        }
      }
      .bottom{
        font-size:1.11rem;
        font-weight:300;
      }
    }
    .logo-icons{
      flex-grow:0;
      display: flex;
      align-items:flex-start;
      margin-right: 2rem;
      @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
        align-items: center;
        width:100%;
        justify-content:space-between;
        margin-right:0;
        margin-bottom:3.33rem;
      }
      .icons{
        display: flex;
        margin: 0 -0.56rem;
        cursor: pointer;
        .icon{
          height:1.67rem;
          margin:0 0.56rem;
          @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
            height:3.33rem;
          }
        }
      }
      .logo{
        position:relative;
        z-index:2;
        margin:-0.6rem 0;
        margin-right:2.3rem;
        img{
          height:5rem;
        }
      }
    }
  }
  .left-circle{
    left:-9.82rem;
    top:-4.56rem;
    height:20.5rem;
    position: absolute;
  }
  .right-star{
    bottom:-7.14rem;
    right:-2.32rem;
    position: absolute;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.s}px){
      right:-15rem;
    }
  }
`;