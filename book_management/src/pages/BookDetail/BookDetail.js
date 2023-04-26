/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const mainContainer = css`
    padding: 10px;
`;

const BookDetail = () => {
    const { bookId } = useParams();
    
    const getBook = useQuery(["getBook"], async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}`, option);
        return response;
    });

    // 해당 로직이 있어야 데이터가 불러오는 동안은 해당 값이 return 되게됨.
    if(getBook.isLoading) {
        return <div>불러오는 중...</div>
    }

    if(!getBook.isLoading) // 데이터가 불러오고 난후에 true가 되서 return 값을 반환 받는다.
    return (
        <div css={mainContainer}>
            <Sidebar />
            <header>
                <h1>{getBook.data.data.bookName}</h1>
                <p>분류:{getBook.data.data.categoryName} / 저자명:{getBook.data.data.authorName} / 출판사:{getBook.data.data.publisherName} / 추천: 10</p>
            </header>
            <main>
                <div>
                    <img src={getBook.data.data.coverImgUrl} alt={getBook.data.data.categoryName}  />
                </div>
                <div>

                </div>
                <div>
                    
                </div>
            </main>
        </div>
    );
};

export default BookDetail;