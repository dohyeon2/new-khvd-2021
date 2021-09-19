import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PrimaryBtn } from '../components/Btns';
import LoginBtn from '../components/LoginBtn';
import { apiURI } from '../vars/api';

const StyledUserConfigure = styled.div`
    overflow-x: hidden;
    overflow-y: auto;
    .configure-wrap{
        box-sizing:border-box;
        max-width: 600px;
        width:100%;
        margin:0 auto;
        height:100vh;
        padding:1rem;
    }
    label{
        display: block;
        margin:.5rem 0;
    }
    small{
        display: block;
        margin:.25rem 0;
    }
    textarea{
        resize:none;
        height:100px;
    }
    input,
    textarea{
        box-sizing:border-box;
        width: 100%;
    }
`;

function UserConfigure() {
    const questions = [
        "Q. 내가 가장 행복했던 ‘언박싱’의 순간은?",
        "Q. 졸전을 준비하며, 가장 많이 들었던 나의 원픽 노동요는?",
        "Q. 나를 표현하는 색상 코드를 고르자면?",
        "Q. 졸업하며 한마디!"
    ];
    const initialState = {
        questions: questions,
        answers: [],
    };
    const [state, setState] = useState(initialState);
    const answerInput = (event) => {
        const target = event.target;
        const name = target.name;
        const question = target.getAttribute("question");
        const value = target.value;
        setState(s => ({
            ...s,
            answers: {
                ...s.answers,
                [name]: {
                    question: question,
                    value: value,
                }
            }
        }));
    };
    const onSubmit = (event) => {
        event.preventDefault();
        (async () => {
            const updateUserMeta = await axios.post(apiURI + `wp/v2/users/me`, {
                meta: {
                    common: JSON.stringify(state.answers),
                }
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                }
            });
        })();
    };
    return (
        <StyledUserConfigure>
            <form className="configure-wrap" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="">학번</label>
                    <input type="text" question="학번" name="student_number" onInput={answerInput} value={state.answers.student_number?.value || ""} />
                </div>
                <div>
                    <label htmlFor="">한국 이름</label>
                    <input type="text" question="한국 이름" name="koeran_name" onInput={answerInput} value={state.answers.koeran_name?.value || ""} />
                </div>
                <div>
                    <label htmlFor="">영어 이름</label>
                    <small>외국인 학생인 경우 입력</small>
                    <input type="text" question="영어 이름" name="english_name" onInput={answerInput} value={state.answers.english_name?.value || ""} />
                </div>
                <div>
                    {state.questions.map((x, i) => <div key={i}>
                        <label htmlFor="">{x}</label>
                        <textarea name={`question_${i}`} question={x} onInput={answerInput} value={state.answers[`question_${i}`]?.value || ""}></textarea>
                    </div>)}
                </div>
                <PrimaryBtn>입력</PrimaryBtn>
                <LoginBtn></LoginBtn>
            </form>
        </StyledUserConfigure>
    );
}

export default UserConfigure;