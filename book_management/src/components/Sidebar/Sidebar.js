/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { GrFormClose } from 'react-icons/gr';
import ListButton from './ListButton/ListButton';
import { BiHome, BiLike, BiListUl, BiLogOut } from 'react-icons/bi';
import { useQuery, useQueryClient } from 'react-query';
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
    
    const queryClient = useQueryClient();
    
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
            queryClient.invalidateQueries("principal");
        }
    }

    // isLoading 값이 바뀌면 재랜더링됨. isLoading을 queryClient로 불러올 경우
    if(queryClient.getQueryState("principal").status === "loading") {
        return <>로딩중...</>;
    }

    const principalData = queryClient.getQueryData("principal").data;
    const roles = principalData.authorities.split(",");

    // 데이터가 들어가기 전에 밑에 리턴에 먼저 실행되기 때문에 !isLoading을 사용해줌.
    // 값이 같다가 넣어져서 돌아온 상태임. -> 비동기 된것을 동기처럼 넣어주기 위해서 isLoading을 사용함!
    // return은 한줄임! 해당 조건 생략 가능!
    if(!queryClient.getQueryState("principal").isLoading)
    return (
        <div css={sidebar(isOpen)} onClick={sidebarOpenClickHandle}>
            <header css={header}>
                <div css={userIcon}>
                    {principalData.name.substr(0, 1)}
                </div>
                <div css={userInfo}>
                    <h1 css={userName}>{principalData.name}</h1>
                    <p css={userEmail}>{principalData.email}</p>
                </div>
                <div css={closeButton} onClick={sidebarCloseClickHandle}><GrFormClose/></div>
            </header>
            <main css={main}>
                <ListButton title="Dashboard"><BiHome /></ListButton>
                <ListButton title="Likes"><BiLike /></ListButton>
                <ListButton title="Rental"><BiListUl /></ListButton>
                {roles.includes("ROLE_ADMIN") ? (<ListButton title="RegisterBookList"><BiListUl /></ListButton>) : ""}
            </main>
            <footer css={footer}>
                <ListButton title="Logout" onClick={logoutClickHandle}><BiLogOut /></ListButton>    
            </footer>
        </div>
    );
};

export default Sidebar;