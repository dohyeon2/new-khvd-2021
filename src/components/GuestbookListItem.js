import React from 'react';
import styled from 'styled-components';
import images from '../images';
import Sticker from './Sticker';

function GuestbookListItem({ content, author_name, date, onClick }) {
    return (
        <StyledGuestbookListItem className="guestbook-list-item" onClick={onClick}>
            <Sticker className="sticker" noRandomRotate={true} />
            <div className="item-wrap">
                <div className="name">
                    {author_name}
                </div>
                <div className="date">
                    {date.split(" ")[0].split("-").join(".")}
                </div>
                <div className="content"
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                >
                </div>
            </div>
        </StyledGuestbookListItem>
    );
}

export default GuestbookListItem;

const StyledGuestbookListItem = styled.div`
    background-image:url(${images['guestbook-backgorund.png']});
    background-position: center;
    background-size:cover;
    position:relative;
    cursor: pointer;
    .name{
        font-size:1.22rem;
        font-weight: 700;
        margin-bottom:0.3rem;
    }
    .date{
        font-size:0.8rem;
        font-weight: 700;
        margin-bottom:0.9rem;
    }
    .content{
        text-overflow:hidden;
        overflow:hidden;
        line-height: 1.6;
        img{
            max-width:100%;
        }
    }
    .sticker{
        position:absolute;
        top:0;
        left:50%;
        width:50%;
        pointer-events: none;
        img{
            width:100%;
        }
        transform: translate(-50%,-50%);
    }
    .item-wrap{
        display: flex;
        flex-direction: column;
        position:absolute;
        inset:0;
        z-index:2;
        padding:2rem;
        padding-top:2.4rem;
        padding-bottom:24%;
    }
    &::before{
        content:"";
        display:block;
        padding-top:100%;
    }
`;