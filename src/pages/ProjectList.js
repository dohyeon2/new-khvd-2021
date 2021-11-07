import React from "react";
import styled from 'styled-components';

function ProjectList() {
    return (
        <StyledProjectList>
            <ProjectThumb
                thumbnailImage={null}
            />
        </StyledProjectList>
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

const StyledProjectList = styled.div`

`;

const StyledProjectThumb = styled.div`

`;