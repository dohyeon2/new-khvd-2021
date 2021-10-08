import axios from 'axios';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { apiURI } from '../vars/api';
import { StyledEditWork } from './dashboard/EditWork';

const ProjectContainer = styled(StyledEditWork)`
    .project-wrap{
        box-sizing:border-box;
        font-family: NanumSquare;
        max-width: 1280px;
        padding-top: 189px;
        margin:0 auto;
        .work-meta{
            .left{
                .project-title{
                    border:0;
                    padding:0;
                    margin-top:0;
                }
                .description{
                    border:0;
                    margin-bottom:50px;
                    height:auto;
                }
                .desinger-section-title{
                    margin-bottom:50px;
                }
            }
            .right{
                .thumbnail{
                    border:0;
                    img{
                        max-width:100%;
                        max-height:100%;
                        width:auto;
                        height:auto;
                    }
                }
            }
        }
    }
`;

function Project({ match }) {
    const params = useParams();
    const initialState = {
        loading: true,
        data: null,
        post_data: null,
        error: false,
    };
    const [state, setState] = useState(initialState);
    useEffect(() => {
        if (state.loading) {
            (async () => {
                const res = await axios.get(apiURI + `wp/v2/posts/${params.id}`);
                setState(s => produce(s, draft => {
                    draft.data = res.data;
                    draft.post_data = JSON.parse(res.data.post_content_no_rendered);
                    draft.loading = false;
                }));
            })();
        }
    }, [state.loading]);
    return (
        <ProjectContainer>
            <div className="project-wrap">
                <div className="work-meta">
                    <div className="flex">
                        <div className="left">
                            <h3 className="project-title">{state.data?.title.rendered}</h3>
                            <div className="description">
                                {state.post_data?.project_description}
                            </div>
                            <div>
                                <h2 className="desinger-section-title">Designer</h2>
                                <ul className="designer-list">
                                </ul>
                            </div>
                        </div>
                        <div className="right">
                            <div className="thumbnail">
                                <img src={state.post_data?.thumbnail} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProjectContainer>
    );
}

export default Project;