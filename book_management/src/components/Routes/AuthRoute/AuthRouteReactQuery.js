import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { refreshState } from '../../../atoms/Auth/AuthAtoms';
import { useRecoilState } from 'recoil';

// 이걸하는 이유는 새창을 열었을 경우나 새로고침한 경우에 토큰 인증을 해주기 위함임!
const AuthRouteReactQuery = ({ path, element }) => {

    const [ refresh, setRefresh ] = useRecoilState(refreshState);
    const { data, isLoading } = useQuery(["authenticated"], async () => {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8080/auth/authenticated", {params: {accessToken}});
        return response;
    }, {
        enabled: refresh
    });

    // 다시 들고온다.
    useEffect(() => {
        if(!refresh) {
            setRefresh(true);
        }
    }, [refresh]);

    // 로딩하는 중
    if(isLoading) {
        return(<div>로딩중...</div>);
    }

    // 로딩이 끝난 지점에주는것
    if(!isLoading) {
        const permitAll = ["/login", "/register", "/password/forgot"];
        // 인증이 안된상태 -> 다 로그인으로 보내버렷!
        if(!data.data) {
            if(permitAll.includes(path)) {
                return element;
            }
            return <Navigate to ="/login"/>;
        }
        // 로그인 되어져있는 상태에서 permitAll의 주소를 칠 경우 홈으로 다 보냄!
        if(permitAll.includes(path)) {
            return <Navigate to ="/"/>;
        }
    }

    

    // if(permitAll.includes(path)) {
    //     return <Navigate to ="/" />;
    // }

    return element;
};

export default AuthRouteReactQuery;