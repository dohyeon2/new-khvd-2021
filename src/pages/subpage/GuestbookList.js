import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { getGuestbook } from '../../api/guestbook';
import GuestbookListItem from '../../components/GuestbookListItem';
import { TextInput } from '../../components/Input';
import useGlobal from '../../hook/useGlobal';
import images from '../../images';

function GuestbookList({ relatePostId }) {
    const COUNT = 9;
    const INITIAL_STATE = {
        loading: true,
        data: null,
        error: null,
    };
    const { global, setGlobal } = useGlobal();
    const [state, setState] = useState(INITIAL_STATE);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(null);
    const { data, loading } = state;
    const timeoutRef = useRef();

    useEffect(() => {
        const params = {
            posts_per_page: COUNT,
            paged: page,
        };
        if (relatePostId) {
            params['meta_query'] = "relate_post_id";
            params['meta_value'] = relatePostId;
            params['meta_compare'] = "'='";
        }
        if (search) {
            params['s'] = search;
            params['nopaging'] = 1;
        }
        getGuestbook(params).then(res => {
            setState(s => ({
                ...s,
                data: res.data,
                loading: false,
            }));
        }).catch(error => {
            setState(s => ({
                ...s,
                error: error.data.message,
                loading: false,
            }));
        });
    }, [global.guestbookSeed, page, search]);

    const getPages = (currentPage, min_page, max_page) => {
        if (!max_page) return;
        const pages = [];
        let page = ((max_page - currentPage) > 2) ? currentPage - 2 : currentPage - (4 - (max_page - currentPage));
        let flag = true;
        while (pages.length < 5 && flag) {
            if (page >= min_page) {
                pages.push(page);
            }
            if (page >= max_page) {
                flag = false;
            }
            page++;
        }
        return pages;
    }
    const handleSearchInput = (event) => {
        clearTimeout(timeoutRef);
        setTimeout(() => {
            setSearch(event.target.value);
        }, 500);
    }
    const openViewer = (x) => {
        setGlobal({ guestbookData: x });
    }
    const changePage = (to) => (e) => {
        if (to < 1 || to > data.max_page) {
            return;
        }
        setPage(to);
    }
    if (loading) return null;
    const pages = getPages(page, 1, data.max_page);
    return (
        <>
            <GuestbookLayoutWrap className="guestbook-list-wrap">
                <div className="header">
                    <div className="search">
                        <TextInput placeholder="검색" onChange={handleSearchInput} />
                    </div>
                </div>
                {data.posts.length ? <GuestbookLayout>
                    {data.posts?.map(x => <GuestbookListItem {...x} onClick={() => { openViewer(x); }} />)}
                </GuestbookLayout> : <div style={{
                    textAlign: 'center'
                }}>
                    방명록이 없어요!<br />
                    방명록의 첫 주인이 되어보세요!
                </div>}
                <div className="footer">
                    <PageNavigator>
                        <button className={"first" + (1 === page ? " disabled" : "")} onClick={changePage(1)}>
                            <img src={images['last.png']} alt="" />
                        </button>
                        <button className={"prev" + (1 > page - 1 ? " disabled" : "")} onClick={changePage(page - 1)}>
                            <img src={images['next.png']} alt="" />
                        </button>
                        {pages?.map(x => <button className={"page" + (x === page ? " current" : "")} onClick={changePage(x)}>{x}</button>)}
                        <button className={"next" + (data.max_page < page + 1 ? " disabled" : "")} onClick={changePage(page + 1)}>
                            <img src={images['next.png']} alt="" />
                        </button>
                        <button className={"last" + (data.max_page === page ? " disabled" : "")}>
                            <img src={images['last.png']} onClick={changePage(data.max_page)} alt="" />
                        </button>
                    </PageNavigator>
                </div>
            </GuestbookLayoutWrap>
        </>
    );
}

export default GuestbookList;

const GuestbookLayoutWrap = styled.div`
    display:flex;
    padding-top:5rem;
    align-items:center;
    flex-direction: column;
    .footer,
    .header{
        width:100%;
        box-sizing:border-box;
        display:flex;
        justify-content:flex-end;
        padding:2rem;
        max-width:1280px;
    }
`;

const GuestbookLayout = styled.div`
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
    width:100%;
    max-width:1280px;
    padding:1rem;
    box-sizing:border-box;
    margin:-1rem -1rem 0;
    .guestbook-list-item{
        width:calc(33.333% - 2rem);
        @media screen and (max-width:${({ theme }) => theme.breakPoints.m}px){
        width:calc(50% - 2rem);
        }
        box-sizing:border-box;
        margin:1rem;
    }
`;

const PageNavigator = styled.div`
display:flex;
    button{
        cursor:pointer;
        padding:0;
        margin:0.25rem 0.5rem;
        border:0;
        background-color:transparent;
        img{
            height:1.4rem;
        }
        &.disabled{
            filter:grayscale(1);
            opacity:0.5;
            pointer-events:none;
        }
    }
    .first,
    .prev{
        img{
            transform:scaleX(-1);
        }
    }
    .page{
        font-weight:700;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:1rem;
        width:1.4rem;
        height:1.4rem;
        border-radius:99rem;
        padding-bottom:0.2rem;
        color:${({ theme }) => theme.colors.secondary};
        &.current{
            color:#fff;
            background-color:${({ theme }) => theme.colors.secondary};
        }
    }
`;