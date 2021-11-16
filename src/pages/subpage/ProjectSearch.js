import React, { useEffect, useState } from 'react';
import { ProjectItem } from '../ProjectList';
import styled from 'styled-components';
import { getPostApi } from '../../api/project';
import useGlobal from '../../hook/useGlobal';
import { LoadingSpinner } from '../../components/Loading';
import { FlexCC } from '../../components/Layout';
import NoResult from '../../components/NoResult';

function ProjectSearch({ search }) {
    const { goTo } = useGlobal();
    const queries = {
        nopaging: 1,
        s: search,
    };
    const INITIAL_STATE = {
        searched: false,
        searchedPost: {},
    }
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        setState(s => ({
            ...s,
            searched: false,
        }));
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
                searched: true,
                searchedPost: classification,
            }));
        });
    }, [search]);
    const keys = Object.keys(state.searchedPost);
    keys.sort((a, b) => state.searchedPost[a][0].category - state.searchedPost[b][0].category);
    if (keys.length === 0 && !state.searched) {
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
                    {state.searchedPost[x].map(y =>
                        <ProjectItem
                            onClick={() => {
                                goTo("/project/" + y.category_slug + "/" + y.id);
                            }}
                            className="item"
                            key={y.id}
                            winner={y.winner}
                            title={y.title}
                            designer={y.designer_list.map(y => y.name).join(",\n")}
                            thumbnail={y.thumbnail_small}
                        />
                    )}
                </>
            )}
            {(state.searched && keys.length === 0) && <NoResult />}
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
