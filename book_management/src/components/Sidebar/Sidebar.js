/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { GrFormClose } from 'react-icons/gr';
import ListButton from './ListButton/ListButton';
import { BiHome, BiLike, BiListUl, BiLogOut } from 'react-icons/bi';
import { useQuery } from 'react-query';
import axios from 'axios';

const sidebar = (isOpen) => css`
    position: absolute;
    display: flex;
    left: ${isOpen ? "10px" : "-240px"};
    flex-direction: column;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    width: 250px;
    box-shadow: -1px 0px 5px #dbdbdb;
    transition: left 1s ease;
    background-color: white;
    ${isOpen ? "" : `
        cursor: pointer;
    `}
    
    ${isOpen ? "" : 
        `&:hover {
            left: -230px;
        }`
    }
    
`;

const header = css`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px;
`;

const userIcon = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    border-radius: 8px;
    width: 45px;
    height: 45px;
    background-color: #713fff;
    color: white;
    font-size: 30px;
    font-weight: 600;
`;

const userInfo = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const userName = css`
    font-size: 18px;
    font-weight: 600;
    padding: 5px;
    padding-top: 0;
`;

const userEmail = css`
    font-size: 12px;
`;

const closeButton = css`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dbdbdb;
    padding-left: 0.3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    &:active {
        background-color: #fafafa;
    }
`;

const main = css`
    padding: 10px;
    border-bottom: 1px solid #dbdbdb;
`;

const footer = css`
    padding: 10px;
`;

const Sidebar = () => {
    const [ isOpen, setIsOpen ] = useState(false);
                                // 키값을 배열에 넣어주는 것이 정석이다.(이렇게 쓰는 걸로 통일하자는 뜻임!) 키값을 여러개 넣는 경우가 있음.
    const { data, isLoading } = useQuery(["principal"], async () => {
        const accessToken = localStorage.getItem("accessToken")
        // 해당 값이 fresh 한지 안한지 확인함! 받은 값이 같으면 상태를 바꾸지 않고 다르면 상태를 바꾸어 재랜더링 해준다. -> 자동으로 해줌.
        const response = await axios.get("http://localhost:8080/auth/principal",
        {params: {accessToken}},
        {
            // 값이 없으면 false이다. -> true와 false만 값이 나옴.
            // enabled true인 상태에만 들고온다.
            enabled: accessToken
        });
        console.log(response)
        return response;
    });

    const sidebarOpenClickHandle = () => {
        if(!isOpen){
            setIsOpen(true);
        }
    }

    const sidebarCloseClickHandle = () => {
        setIsOpen(false);
    }

    const logoutClickHandle = () => {
        if(window.confirm("로그아웃 하시겠습니까?")) {
            localStorage.removeItem("accessToken");
        }
    }

    // isLoading 값이 바뀌면 재랜더링됨.
    if(isLoading) {
        return <>로딩중...</>;
    }

    // 데이터가 들어가기 전에 밑에 리턴에 먼저 실행되기 때문에 !isLoading을 사용해줌.
    // 값이 같다가 넣어져서 돌아온 상태임. -> 비동기 된것을 동기처럼 넣어주기 위해서 isLoading을 사용함!
    // return은 한줄임!
    if(!isLoading)
    return (
        <div css={sidebar(isOpen)} onClick={sidebarOpenClickHandle}>
            <header css={header}>
                <div css={userIcon}>
                    {data.data.name.substr(0, 1)}
                </div>
                <div css={userInfo}>
                    <h1 css={userName}>{data.data.name}</h1>
                    <p css={userEmail}>{data.data.email}</p>
                </div>
                <div css={closeButton} onClick={sidebarCloseClickHandle}><GrFormClose/></div>
            </header>
            <main css={main}>
                <ListButton title="Dashboard"><BiHome /></ListButton>
                <ListButton title="Likes"><BiLike /></ListButton>
                <ListButton title="Rental"><BiListUl /></ListButton>
            </main>
            <footer css={footer}>
                <ListButton title="Logout" onClick={logoutClickHandle}><BiLogOut /></ListButton>    
            </footer>
        </div>
    );
};

export default Sidebar;