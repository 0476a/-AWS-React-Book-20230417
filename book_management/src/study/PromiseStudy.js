import React from 'react';

const PromiseStudy = () => {

    // 생성되면 프로미스가 실행됨.
    const a = new Promise((resolve, reject) => {
        console.log("프로미스 호출");
        if(1 === 1) {
            resolve();
        } else {
            throw new Error("오류입니다.");
        }
    });

    const clickHandler = () => {
        // 클릭하면서 then이 호출됨.
        a
        .then(() => {
            console.log("1번 then 호출")
            return new Promise((resolve, reject) => {
                resolve("리턴!!!");
            });

        })
        .catch((error) => {
            console.log(error);
        })
        .then(b);
    }

    const b = (str) => {
        console.log(str);
    }

    return (
        <div>
            <button onClick={clickHandler}>버튼</button>
        </div>
    );
};

export default PromiseStudy;