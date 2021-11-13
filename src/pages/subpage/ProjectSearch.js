import React, { useEffect, useState } from 'react';
import { ProjectItem } from '../ProjectList';
import styled from 'styled-components';
import { getPostApi } from '../../api/project';
import useGlobal from '../../hook/useGlobal';
import { LoadingSpinner } from '../../components/Loading';
import { FlexCC } from '../../components/Layout';

function ProjectSearch({ search }) {

    const { goTo } = useGlobal();

    const queries = {
        nopaging: 1,
        s: search,
    };
    const INITIAL_STATE = {
        searchedPost: [],
    }
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        getPostApi(queries).then(res => {
            const classification = {};
            for (let i in res.data.posts) {
                const curr = res.data.posts[i];
                if (classification[curr.category_name]) {
                    classification[curr.category_name].push(curr);
                } else {
                    classification[curr.category_name] = [curr];
                }
            }
            setState(s => ({
                ...s,
                searchedPost: classification,
            }));
        });
    }, [search]);
    const { searchedPost } = state;
    const keys = Object.keys(searchedPost);
    keys.sort((a, b) => searchedPost[a][0].category - searchedPost[b][0].category);
    if (searchedPost.length === 0) {
        return (
            <FlexCC>
                <LoadingSpinner scale={2} />
            </FlexCC>
        )
    }
    return (
        <>
            {keys.map(x =>
                <>
                    <Section>{x}</Section>
                    {searchedPost[x].map(y =>
                        <ProjectItem
                            onClick={() => {
                                goTo("/project/" + y.category_slug + "/" + y.id);
                            }}
                            className="item"
                            key={y.id}
                            title={y.title}
                            designer={y.designer_list.map(y => y.name).join(",\n")}
                            thumbnail={y.thumbnail_small}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default ProjectSearch;

export const Section = styled.div`
    border-bottom: 0.2rem solid rgba(255,255,255,0.3);
    padding-bottom:1rem;
    width:100%;
    margin:3rem 3rem 0;
    font-size:1.6rem;
    font-weight: 700;
    color:#fff;
`;
