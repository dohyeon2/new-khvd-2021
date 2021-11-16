import styled from 'styled-components';

export const ProjectContainer = styled.div`
  display:flex;
  justify-content:flex-start;
  flex-wrap:wrap;
  width:100%;
  max-width:1280px;
  margin:-2rem -3rem 0;
  @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      margin:-3rem -3rem 0;
  }
  .item{
    width:calc(33.333% - 6rem);
    box-sizing:border-box;
    margin:3rem;
    transition:transform .2s ease-in-out;
    position:relative;
    @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
      width:calc(50% - 3rem);
      margin:1.5rem;
    }
    &:hover{
      z-index:2;
      transform:scale(1.2);
    }
  }
`;