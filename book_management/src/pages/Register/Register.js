/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
// 라우터 안에서만 돌아다니게 하는 것 Link
import { Link } from 'react-router-dom';
import LoginInput from '../../components/UI/Login/LoginInput/LoginInput';
import { FiUser, FiLock } from 'react-icons/fi';
import { BiRename } from 'react-icons/bi';
import axios from 'axios';

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 30px;
`;

const logo = css`
    margin: 50px 0px;
    font-size: 34px;
    font-weight: 600;
`;

const mainContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 40px 20px;
    width: 400px;
`;

const authForm = css`
    width: 100%;
`;

const inputLabel = css`
    margin-left: 5px;
    font-size: 12px;
    font-weight: 600;
`;

const loginButton = css`
    margin: 10px 0px;
    border: 1px solid #dbdbdb;
    border-radius: 7px;
    width: 100%;
    height: 50px;
    background-color: white;
    font-weight: 900;
    cursor: pointer;
    &:hover {
        background-color: #fafafa;
    }
    &:active {
        background-color: #eee;
    }
`;

const signupMessage = css`
    margin-top : 20px;
    font-size: 14px;
    font-weight: 600;
    color: #777;
`;

const register = css`
    margin-top: 10px;
    font-weight: 600;
`;

const Register = () => {
    const [registerUser, setRegisterUser] = useState({email: "", password: "", name: ""})

    // 이거 하나가지고 3개의 input을 처리하고자 하기 때문에 name 속성값을 받아준다.
    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setRegisterUser({...registerUser, [name]: value});
    }

    const registeSubmit = () => {
        const data = {
            ...registerUser
        }
        const option = {
            headers: {
                // 이게 있어야 JSON 타입으로 요청이 보내짐!
                "Content-Type": "application/json"
            }
        }
        // 값을 해당 url에 보낼 수 있다. JSON 형태로 바꿔서 보내준다. + 옵션도 객체형태로 바꿔서 넣어준다.
        axios.post("http://localhost:8080/auth/signup", JSON.stringify(data), option)
        // sesscess랑 똑같다고 생각하면됨.
        .then(response => {
            console.log("성공");
            console.log(response);
        })
        // error와 똑같다고 생각하면됨.
        .catch(error => {
            console.log("에러");
            console.log(error.response.data.errorData);
        });

        // 웹은 싱글스레드이기 때문에 비동기가 매우 중요함! -> 맞겨놓고 딴짓해도 됨.
        // 동기 설정을 하려면 좀 복잡함!
        // 위에꺼랑 따로 놈! 순서를 지키려면 함수안에 넣어줘야함!
        // 프로미스..? 
        console.log("비동기 테스트");
    }

    return (
        <div css={container}>
            <header>
                <h1 css={logo}>SIGN UP</h1>
            </header>
            <main css={mainContainer}>
                <div css={authForm}>
                    <label css={inputLabel}>Email</label>
                    <LoginInput type="email" placeholder="Type your email" onChange={onChangeHandle} name="email">
                        <FiUser />    
                    </LoginInput>
                    <label css={inputLabel}>Password</label>
                    <LoginInput type="password" placeholder="Type your password" onChange={onChangeHandle} name="password">
                        <FiLock />    
                    </LoginInput>
                    <label css={inputLabel}>Name</label>
                    <LoginInput type="text" placeholder="Type your name" onChange={onChangeHandle} name="name">
                        <BiRename />    
                    </LoginInput>

                    <button css={loginButton} onClick={registeSubmit}>REGISTER</button>
                </div>
            </main>

            <div css={signupMessage}>Already a user?</div>

            <footer>
                <div css={register}><Link to="/login">LOGIN</Link></div>
            </footer>
        </div>
    );
};

export default Register;