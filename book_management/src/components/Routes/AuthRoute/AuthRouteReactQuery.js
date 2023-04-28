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


    // 키값을 배열에 넣어주는 것이 정석이다.(이렇게 쓰는 걸로 통일하자는 뜻임!) 키값을 여러개 넣는 경우가 있음.
    const principal = useQuery(["principal"], async () => {
        const accessToken = localStorage.getItem("accessToken")
        // 해당 값이 fresh 한지 안한지 확인함! 받은 값이 같으면 상태를 바꾸지 않고 다르면 상태를 바꾸어 재랜더링 해준다. -> 자동으로 해줌.
        const response = await axios.get("http://localhost:8080/auth/principal", {params: {accessToken}})
        return response;
        },{
            // 값이 없으면 false이다. -> true와 false만 값이 나옴.
            // enabled true인 상태에만 들고온다.
            enabled: !!localStorage.getItem("accessToken")
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

    if(principal.data !== undefined) {
        const roles = principal.data.data.authorities.split(",");
        // const hasAdminPath = path.substr(0, 6) === "/admin";
        if(path.startsWith("/admin") && !roles.includes("ROLE_ADMIN")) {
            alert("접근 권한이 없습니다.");
            return <Navigate to ="/"/>;
        }
    }

    // 로딩이 끝난 지점에주는것
    if(!isLoading) {
        const permitAll = ["/login", "/register", "/passwor+d/forgot"];
        
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

        return element;
    }

    // if(permitAll.includes(path)) {
    //     return <Navigate to ="/" />;
    // }
    return element;
};

export default AuthRouteReactQuery;