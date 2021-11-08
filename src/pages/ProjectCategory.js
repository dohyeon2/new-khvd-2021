import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ArtAndDesignHall from '../components/ArtAndDesignHall';
import axios from 'axios';
import { apiURI } from '../vars/api';
import { Layout } from './Main';
import { parseObjectToQuery } from '../utils/functions';

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
        },
        categories: [
            {
                id: 2,
                label: "GRAPHIC DESIGN",
                featurePost: null,
            },
            {
                id: 3,
                label: "DESIGN BUSINESS",
                featurePost: null,
            },
            {
                id: 4,
                label: "UXUI / NEW MEDIA",
                featurePost: null,
            }
        ],
        currentThumbnail: null,
    };
    const mouseStokerRef = useRef();
    const wrapperRef = useRef();
    const [state, setState] = useState(INITIAL_STATE);

    const getFeaturePostByCategory = async (categoryId) => {
        const queries = {
            cat: categoryId,
            posts_per_page: 1,
            orderby: "rand",
            nopaging: 0,
        };
        const categoryFeaturePost = await axios.get(apiURI + "khvd/v1/project" + "?" + parseObjectToQuery(queries));
        setState(s => ({
            ...s,
            categories: s.categories.map(x => {
                if (x.id === categoryId) {
                    return {
                        ...x,
                        thumbnail: categoryFeaturePost.data.posts[0].thumbnail_small
                    };
                } else {
                    return x;
                }
            }),
        }));
        return categoryFeaturePost.data.posts[0];
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
        state.categories.forEach((x, i, arr) => {
            const curr = getFeaturePostByCategory(x.id).then((post) => {
                if (i === 0) {
                    const image = new Image();
                    image.src = post.thumbnail_small;
                    image.onload = () => {
                        setState(s => ({
                            ...s,
                            currentThumbnail: post.thumbnail_small,
                        }));
                    }
                }
            });
        });
    }, []);

    return (
        <ProjectCategoryLayout ref={wrapperRef}>
            <ArtAndDesignHall image={state.currentThumbnail} />
            <div className="categories">
                {state.categories
                    .map((x) => <CategoriesBtn
                        onMouseEnter={() => {
                            mouseStokerRef.current.style.width = '22.3rem';
                            mouseStokerRef.current.style.height = '22.3rem';
                            const image = new Image();
                            image.src = x.thumbnail;
                            image.onload = () => {
                                setState(s => ({
                                    ...s,
                                    currentThumbnail: x.thumbnail,
                                }));
                            }
                        }}
                        onMouseLeave={() => {
                            mouseStokerRef.current.style.width = '0';
                            mouseStokerRef.current.style.height = '0';
                        }}
                        key={x.id}>
                        {x.label}
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