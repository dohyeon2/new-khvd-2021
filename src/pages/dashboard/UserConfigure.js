import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PrimaryBtn, SecondaryBtn } from '../../components/Btns';
import { apiURI } from '../../vars/api';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import useUser from '../../hook/useUser.js';

export const StyledUserConfigure = styled.div`
    overflow-x: hidden;
    overflow-y: auto;
    .configure-wrap{
        box-sizing:border-box;
        max-width: 600px;
        width:100%;
        margin:0 auto;
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
    &>form{
        &>div{
            &>input,
            &>textarea{
                box-sizing:border-box;
                width: 100%;
            }
        }
    }
    .color-selector-wrap{
        display: flex;
        margin-bottom:5px;
        input[type="color"]{
            margin-right: 5px;
        }
    }
`;

function UserConfigure() {
    const { dispatchUserToRedux } = useUser();
    const questions = [
        {
            q: "Q. 나를 표현하는 색상 코드와 그 이유는?",
            preText: ({ value, onInput, idx, question }) => <div className="text-color-wrap color-selector-wrap">
                <input type="color" name={`question_${idx}_add`} id="text_color" question={"색상코드"} onInput={onInput} value={value} required />
                <input type="text" name={`question_${idx}_add`} id="text_color_input" question={"색상코드"} value={value} onInput={onInput} maxLength="7" required />
            </div>
        },
        {
            q: "Q. 내가 가장 행복했던 언박싱의 순간은?"
        },
        { q: "Q. 졸전을 준비하며, 가장 많이 들었던 나의 원픽 노동요는?" },
        { q: "Q. 졸전이 끝나면 가장 먼저 하고 싶은 것은?" },
        { q: "Q. 졸업하며 한마디!", maxLength: 40 }
    ];
    const { user } = useSelector(s => s);
    const userMeta = user.data.wordpressData.meta.common ? JSON.parse(user.data.wordpressData.meta.common) : {};
    const initialState = {
        questions: questions,
        answers: {
            question_0_add: {
                question: "색상코드",
                value: "#cccccc"
            }, ...userMeta
        },
        userMetaData: null,
    };
    const history = useHistory();
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
            try {
                const updateUserMeta = await axios.post(apiURI + `wp/v2/users/me`, {
                    name: [state.answers['2_koeran_name']?.value, state.answers['3_english_name']?.value || null].join(" "),
                    meta: {
                        common: JSON.stringify(state.answers),
                    },
                }, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                    }
                });
                history.push('/my-dashboard');
                dispatchUserToRedux({
                    ...user.data,
                    wordpressData: {
                        ...user.data.wordpressData,
                        ...updateUserMeta.data,
                    },
                });
                window.alert("설정이 완료됐습니다.");
            } catch (e) {
                console.log(e);
            }
        })();
    };
    const getValue = (key, defaultValue = "") => {
        return state.answers[key]?.value || defaultValue;
    }
    if (user.loading) return <div>loading</div>;
    return (
        <StyledUserConfigure>
            <form className="configure-wrap" onSubmit={onSubmit}>
                <div>
                    <label>학번</label>
                    <input type="text" question="학번" name="1_student_number" onInput={answerInput} value={getValue("1_student_number")} required />
                </div>
                <div>
                    <label>한글 이름</label>
                    <input type="text" question="한글 이름" name="2_koeran_name" onInput={answerInput} value={getValue("2_koeran_name")} />
                </div>
                <div>
                    <label>영문 이름</label>
                    <small>외국인 학생인 경우 입력</small>
                    <input type="text" question="영문 이름" name="3_english_name" onInput={answerInput} value={getValue("3_english_name")} />
                </div>
                {[1, 2, 3, 4, 5].map((x) => <div key={x}>
                    <label>컨택트 {x}</label>
                    <input type="text" question={`컨택트 ${x}`} name={`contact_${x}`} onInput={answerInput} value={getValue(`contact_${x}`)} />
                </div>)}
                {state.questions.map((x, i) => <div key={i}>
                    <label >{x.q}</label>
                    {x.preText && x.preText({
                        question: x.q,
                        value: getValue(`question_${i}_add`, "#000000"),
                        onInput: answerInput,
                        idx: i,
                    })}
                    <textarea name={`question_${i}`} question={x.q} onInput={answerInput} value={getValue(`question_${i}`)} maxLength={x.maxLength || 150} required></textarea>
                </div>)}
                <PrimaryBtn type="submit">입력</PrimaryBtn>
                <SecondaryBtn type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        history.push("/my-dashboard");
                    }}>취소</SecondaryBtn>
            </form>
        </StyledUserConfigure>
    );
}

export default UserConfigure;