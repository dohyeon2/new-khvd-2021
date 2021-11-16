import React from 'react';
import styled from 'styled-components';

function AnimationWrap() {
    return (
        <ScrollAnimationSticky>
            <div className="animationwrap">
                <div>
                    asdfsafd
                </div>
            </div>
        </ScrollAnimationSticky>
    );
}

export default AnimationWrap;


const ScrollAnimationSticky = styled.div`
    position:relative;
    height:5000px;
    z-index:2;
    top:0;
    .animationwrap{
        position: sticky;

        top: 0; /* required */
    }
`;
