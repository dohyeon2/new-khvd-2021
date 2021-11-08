import React, { useState } from "react";
import styled from 'styled-components';
import { Layout } from "./Main";
import ProjectCategory from "./ProjectCategory";

function ProjectList() {
    const INITIAL_STATE = {
        category: null,
    };
    const [state, setState] = useState(INITIAL_STATE);

    return (
        (state.category ? <ProjectListLayout>
            <ProjectThumb
                thumbnailImage={null}
            />
        </ProjectListLayout> : <ProjectCategory />)
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

`;

const StyledProjectThumb = styled.div`

`;