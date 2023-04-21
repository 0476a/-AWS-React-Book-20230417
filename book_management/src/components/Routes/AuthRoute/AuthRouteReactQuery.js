import React from 'react';
import { Navigate } from 'react-router-dom';
import { authenticatedState } from '../../../atoms/Auth/AuthAtoms';
import { useRecoilState } from 'recoil';
import axios from 'axios';

const validateToken = async(accessToken) => {
    const response = await axios.get("http://localhost:8080/auth/authenticated", {params: {accessToken}});
    return response.data;
}

// 이걸하는 이유는 새창을 열었을 경우나 새로고침한 경우에 토큰 인증을 해주기 위함임!
const AuthRoute = ({ path, element }) => {
    const [ authenticated , setAuthenticated ] = useRecoilState(authenticatedState);
    
    const permitAll = ["/login", "/register", "/password/forgot"];

    // 인증이 안되었을 때(새로고침 or 로그인이 안되었을 때)
    if(!authenticated) {
        const accessToken = localStorage.getItem("accessToken");
        // 토큰이 있을때 유효한지 확인
        if(accessToken !== null){
            // 토큰 검사를 안해주게되면 아무토큰이나 적어서 들어올 수 있게 되므로 유효성 확인 필수
            validateToken(accessToken).then((flag) => {
                setAuthenticated(flag);
            });
               // 이친구를 바로 true로 만들고 싶다!-> react-query를 사용하면 편하다.
            if(authenticated){
                return element;
            }
            // 위에 비동기 처리를 했기 때문에 밑에 로직을 적어서 받은 path 값으로 이동 시킴.
            console.log("페이지 이동 테스트");
            return <Navigate to={path} />;
        }

        // 토큰이 없는 경우 (로그인 페이지에서 다시 온 녀석이 여기에 걸려서 로그인 페이지로 감!)
        if(permitAll.includes(path)) {
            return element;
        }
        // 토큰이 없으면 로그인페이지로 보냄!
        return <Navigate to="/login" />;
    }

    // 인증이 되어있을 경우
    if(permitAll.includes(path)) {
        return <Navigate to ="/" />;
    }

    return element;
};

export default AuthRoute;