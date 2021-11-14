import React from 'react';
import styled from 'styled-components';
import images from '../images';

function FloatingMenu() {
    return (
        <FloatingMenuLayout>
            <button className="circle-button" 
            onClick={() => {
                if(document.getElementsByClassName('project-container')[0]){
                    document.getElementsByClassName('project-container')[0].scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
                document.getElementById("root").scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}>
                <img src={images['upup-btn.png']} alt="" />
                UPUP!
            </button>
        </FloatingMenuLayout>
    );
}

export default FloatingMenu;

const FloatingMenuLayout = styled.div`
    position:fixed;
    bottom:4.72rem;
    right:1rem;
    z-index:33;
    .circle-button{
        padding:0;
        border:0;
        margin:0;
        background-color: transparent;
        cursor:pointer;
        display:flex;
        flex-direction: column;
        align-items: center;
        font-family:${({ theme }) => theme.font.family.englishBold};
        color:${({ theme }) => theme.colors.primary};
        text-align:center;
        width: 100%;
        img{
            height:4.444rem;
            margin-bottom:0.4rem;
        }
    }
`