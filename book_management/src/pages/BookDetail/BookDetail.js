/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import RentalList from '../../components/UI/BookDetail/RentalList/RentalList';

const mainContainer = css`
    padding: 10px;
`;

const BookDetail = () => {
    const { bookId } = useParams();
    // principal 키로 유저 정보들을 가지고 있음
    const queryClient = useQueryClient();

    const getBook = useQuery(["getBook"], async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}`, option);
        return response;
    });

    const getLikeCount = useQuery(["getLikeCount"], async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}/like`, option);
        return response;
    });

    const getLikeStatus = useQuery(["getLikeStatus"], async () => {
        const option = {
            params: {
                // queryClient에서 유저 정보를 가지고 온 것을 볼 수 있다.
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}/like/status`, option);
        return response;
    });

    // react query에서 데이터를 수정할 때 사용됨.
    const setLike = useMutation(async() => {
        const option = {
            headers: {
                "Content-Type" : "application/json",
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.post(`http://localhost:8080/book/${bookId}/like`, JSON.stringify({
            userId: queryClient.getQueryData("principal").data.userId
        }), option);
    }, {
        onSuccess: () => {
            // invalidateQueries 캐시를 싹 지우고 다시 받아와줌(요청을 다시보넴).
            queryClient.invalidateQueries("getLikeCount");
            queryClient.invalidateQueries("getLikeStatus");
        }
    });

    const disLike = useMutation(async() => {
        const option = {
            params: {
                // queryClient에서 유저 정보를 가지고 온 것을 볼 수 있다.
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.delete(`http://localhost:8080/book/${bookId}/like`, option);
    }, {
        onSuccess: () => {
            // invalidateQueries 캐시를 싹 지우고 다시 받아와줌(요청을 다시보넴).
            // 캐시가 유지되는 시간을 만료 해줌. -> 비워지면 유즈쿼리가 다시 값을 불러와줌.
            queryClient.invalidateQueries("getLikeCount");
            queryClient.invalidateQueries("getLikeStatus");
        }
    });

    // 해당 로직이 있어야 데이터가 불러오는 동안은 해당 값이 return 되게됨.
    if(getBook.isLoading) {
        return <div>불러오는 중...</div>
    }

    // if(!getBook.isLoading) // 데이터가 불러오고 난후에 true가 되서 return 값을 반환 받는다.
    return (
        <div css={mainContainer}>
            <Sidebar />
            <header>
                <h1>{getBook.data.data.bookName}</h1>
                <p>분류:{getBook.data.data.categoryName} / 저자명:{getBook.data.data.authorName} / 출판사:{getBook.data.data.publisherName} / 추천: {getLikeCount.isLoading ? "조회중..." : getLikeCount.data.data}</p>
            </header>
            <main>
                <div>
                    <img src={getBook.data.data.coverImgUrl} alt={getBook.data.data.categoryName} />
                </div>
                <div>
                    <RentalList bookId={bookId}/>
                </div>
                <div>
                    {getLikeStatus.isLoading 
                        ? "" 
                        : getLikeStatus.data.data === 0 
                            ? (<button onClick={() => {setLike.mutate()}}>추천하기</button>)
                            : (<button onClick={() => {disLike.mutate()}}>추천취소</button>)}
                </div>
            </main>
        </div>
    );
};

export default BookDetail;