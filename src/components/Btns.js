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