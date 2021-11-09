import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Layout } from "./Main";
import ProjectCategory from "./ProjectCategory";
import images from '../images';
import axios from "axios";
import { apiURI } from "../vars/api";
import { parseObjectToQuery } from "../utils/functions";

function ProjectList() {
    const INITIAL_STATE = {
        catId: null,
        category: null,
        authors: null,
    };
    const [state, setState] = useState(INITIAL_STATE);
    const selectCategory = (catId) => {
        setState(s => ({
            ...s,
            catId: catId
        }));
    }
    const projectCategoryAttrs = {
        selectCategory
    };

    useEffect(() => {
        if (state.catId !== null) {
            const queries = {
                cat: state.catId,
                paged: 1,
                nopaging: 0,
                post__not_in: 450,
                thumbSize: 830
            };
            const author_query = {
                cat: state.catId,
            }
            axios.get(`${apiURI}wp/v2/categories/${state.catId}`).then(res => {
                setState(s => ({
                    ...s,
                    category: res.data,
                }));
            });
            axios.get(`${apiURI}khvd/v1/author?${parseObjectToQuery(author_query)}`).then(res => {
                setState(s => ({
                    ...s,
                    authors: res.data.authors
                }));
            });
            axios.get(`${apiURI}khvd/v1/project?${parseObjectToQuery(queries)}`).then(res => {
                console.log(res);
            });
        }
    }, [state.catId]);

    return (
        (state.catId ? <ProjectListLayout style={{
            backgroundImage: (state.catId && `url(${images['project-background.png']})`)
        }}>
            <div className="cover">
                <div className="category-title">
                    {state.category?.meta.english_label}
                </div>
                <div className="author-list">
                    {state.authors?.reduce((b, c) => {
                        if (b.find(x => x.ID === c.ID)) {
                            return b;
                        }
                        return [...b, c];
                    }, []).map(x => <div
                        className="author-name"
                        key={x.ID}
                    >
                        {x.display_name.split(" ")[0]}
                    </div>)}
                </div>
            </div>
        </ProjectListLayout> : <ProjectCategory {...projectCategoryAttrs} />)
    );
}

function ProjectThumb({ thumbnailImage }) {
    return (
        <StyledProjectThumb
            style={{
                backgroundImage: thumbnailImage,
            }}
        >
        </StyledProjectThumb>
    );
}

export default ProjectList;

const ProjectListLayout = styled(Layout)`
    width:100%;
    height:100%;
    .cover{
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        color:#fff;
        justify-content:center;
        align-items:center;
        .category-title{
            font-size:4.45rem;
            font-family:${({ theme }) => theme.font.family.englishBold};
            margin-bottom:4.34rem;
        }
        .author-list{
            max-width:800px;
            width:100%;
            margin:0 1rem;
            display:flex;
            flex-direction:row;
            font-size:1.12rem;
            justify-content:center;
            flex-wrap:wrap;
            .author-name{
                line-height:2.3rem;
                margin:0.2rem;
            }
        }
    }
`;

const StyledProjectThumb = styled.div`

`;