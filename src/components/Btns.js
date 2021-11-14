import styled from 'styled-components';

export const DashboardSideMenuBtn = styled.div`
    cursor: pointer;
    padding:1rem;
    border-bottom:1px solid #444;
`;

export const PrimaryBtn = styled.button`
    cursor: pointer;
    padding:1rem;
    border:0;
    margin:0;
    background-color: transparent;
    display: block;
    text-align:center;
    width: 100%;
    color:#fff;
    border-radius: 4px;
    box-shadow: 0px 3px 1px rgba(0,0,0,.3);
    margin:10px auto;
    background-color: #1288ff;
    &:hover{
        filter:brightness(120%);
    }
`;

export const SecondaryBtn = styled(PrimaryBtn)`
    background-color: #666;
    color:#fff;
`;

export const ChevronBtn = styled.button`
background-image: url("data:image/svg+xml,%3Csvg width='2rem' height='2rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%0A%3E%3Cpath d='M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z' fill='%23fff' /%3E%3C/svg%3E");
background-position-x:right;
background-position-y:65%;
background-repeat:no-repeat;
padding:0.5rem;
padding-right:1.5rem;
display:flex;
align-items:center;
justify-content:center;
background-color:transparent;
border:0;
cursor:pointer;
color:#fff;
font-size:1.4rem;
margin:0.5rem;
transition: color .2s ease-in-out, background-image .2s ease-in-out;
&:hover{
  background-image: url("data:image/svg+xml,%3Csvg width='2rem' height='2rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%0A%3E%3Cpath d='M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z' fill='%23${({ theme }) => theme.colors.primary.slice(1)}' /%3E%3C/svg%3E");
  color:${({ theme }) => theme.colors.primary}
}
`;