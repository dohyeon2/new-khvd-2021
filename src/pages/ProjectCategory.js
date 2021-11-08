import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ArtAndDesignHall from '../components/ArtAndDesignHall';
import axios from 'axios';
import apiURL from '../vars/api';
import { Layout } from './Main';

function ProjectCategory() {
    const INITIAL_STATE = {
        eventBinded: false,
        mouseStokerSize: {
            width: 0,
            height: 0,
        },
        mouseStokerPosition: {
            x: 0,
            y: 0,
        }
    };
    const mouseStokerRef = useRef();
    const wrapperRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);

    const getFeaturePostByCategory = async (categoryId) => {
        const categoryFeaturePost = await axios.get(apiURL);
    }

    useEffect(() => {
        if (state.eventBinded === false) {
            wrapperRef.current.addEventListener('mousemove', (e) => {
                mouseStokerRef.current.style.left = e.x + "px";
                mouseStokerRef.current.style.top = e.y + "px";
            });
            setState(s => ({
                ...s,
                eventBinded: true
            }));
        }
    }, []);

    useEffect(() => {
        // 그래픽 디자인 2, 디자인 비즈니스 3, 뉴미디어 4
        const categoryList = [2, 3, 4];
        categoryList.forEach((x) => {
            getFeaturePostByCategory(x);
        });
    }, []);
    return (
        <ProjectCategoryLayout ref={wrapperRef}>
            <ArtAndDesignHall />
            <div className="categories">
                {["GRAPHIC DESIGN", "DESIGN BUSINESS", "UXUI / NEW MEDIA"]
                    .map((x, i) => <CategoriesBtn
                        onMouseEnter={() => {
                            mouseStokerRef.current.style.width = '22.3rem';
                            mouseStokerRef.current.style.height = '22.3rem';
                        }}
                        onMouseLeave={() => {
                            mouseStokerRef.current.style.width = '0';
                            mouseStokerRef.current.style.height = '0';
                        }}
                        key={i}>
                        {x}
                    </CategoriesBtn>)}
            </div>
            <div id="mouse-stoker" ref={mouseStokerRef} style={{
                width: state.mouseStokerSize.width,
                height: state.mouseStokerSize.height,
                left: state.mouseStokerPosition.x,
                top: state.mouseStokerPosition.y,
            }} />
        </ProjectCategoryLayout>
    );
}

export default ProjectCategory;

const ProjectCategoryLayout = styled(Layout)`
    display:flex;
    align-items:center;
    padding:4rem;
    box-sizing:border-box;
    justify-content:center;
    .categories{
        position:relative;
        z-index:2;
        display:flex;
        flex-direction:column;
        margin:-3.5rem 0;
        margin-left:3.9rem;
    }
    #mouse-stoker{
        position:absolute;
        transition:width 0.2s ease-in-out, height 0.2s ease-in-out;
        background-color:${({ theme }) => theme.colors.primary};
        border-radius:999rem;
        transform:translate(-50%,-50%);
        pointer-events:none;
    }
`;

const CategoriesBtn = styled.button`
    margin:3.5rem 0;
    border:0;
    padding:0;
    outline:0;
    background-color:transparent;
    font-size:2.23rem;
    text-align:left;
    white-space:nowrap;
    font-family: ${({ theme }) => theme.font.family.englishBold};
    color:#fff;
    opacity:0.6;
    cursor:pointer;
    @supports (-webkit-text-stroke:2px #fff) {
        color:transparent;
        opacity:1;
        -webkit-text-stroke:2px #fff; 
    }
    &:hover{
        color:#fff;
        opacity:1;
        -webkit-text-stroke:0px #fff; 
    }
`;