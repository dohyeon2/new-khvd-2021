import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import images from '../images';

function Sticker(attr) {
    const { stickerIdx } = attr;
    const [icon, setIcon] = useState(null);
    const [rotate, setRotate] = useState(null);
    useEffect(() => {
        if (!stickerIdx) {
            const Idx = Math.floor(Math.random() * 9.9);
            setIcon(Idx);
            setRotate(Math.random() * 360);
        }
    }, []);
    return (
        <StyledSticker {...attr}>
            {icon !== null &&
                <img
                    src={images["sticker/" + icon + ".png"]}
                    style={{
                        transform: attr.noRandomRotate ? null : `rotate(${rotate}deg)`,
                    }}
                />
            }
        </StyledSticker>
    );
}

export default Sticker;

const StyledSticker = styled.div`
    ${p => p.onClick && "cursor:pointer"}
    img{
        width:13rem;
        user-select:none;
    }
`;