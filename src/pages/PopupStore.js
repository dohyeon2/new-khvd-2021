import styled from 'styled-components';
import React from 'react';
import { Layout } from '../components/Layout';
import AnimationWrap from './subpage/AnimationWrap';
import ProjectList from './ProjectList';

function PopupStore() {
    return (
        <>
            <AnimationWrap></AnimationWrap>
            <div style={{
                position:'relative',
                zIndex:2,
            }}>
                <ProjectList slug="goods" />
            </div>
            <LayoutContainer />
        </>
    );
}

export default PopupStore;

const LayoutContainer = styled(Layout)`
    pointer-events:none;
    position: fixed;
    inset:0;
`;