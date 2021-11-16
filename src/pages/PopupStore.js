import styled from 'styled-components';
import React from 'react';
import { Layout } from '../components/Layout';
import AnimationWrap from './subpage/AnimationWrap';

function PopupStore() {
    return (
        <LayoutContainer>
            <AnimationWrap></AnimationWrap>
            <Layout className="layout" />
        </LayoutContainer>
    );
}

export default PopupStore;

const LayoutContainer = styled(Layout)`
    background:none;
    .layout{
        pointer-events:none;
        position: fixed;
        inset:0;
    }
`;