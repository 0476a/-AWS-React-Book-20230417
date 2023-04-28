/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { useMutation, useQuery } from 'react-query';

const tableContainer = css`
    height: 300px;
    overflow-y: auto;
`;

const table = css`
    border: 1px solid #dbdbdb;
    font-size: 12px;
`;

const thAndTd = css`
    border: 1px solid #dbdbdb;
    padding: 5px 10px;
    text-align: center;
`;

const BookRegister = () => {
    const [ searchParams, setSearchParams ] = useState({page: 1, searchValue: ""});

    const getBooks = useQuery(["registerSearchBooks"], async () => {
        const option = {
            params: {
                ...searchParams
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.get("http://localhost:8080/books", option);
    });
    const registeBookList = useMutation();

    return (
        <div>
            <div>
                <label>도서검색</label>
                <input type="text" />
                <button><BiSearch /></button>
            </div>
            <div css={tableContainer}>
            <table css={table}>
                <thead>
                    <tr>
                        <th css={thAndTd}>선택</th>
                        <th css={thAndTd}>분류</th>
                        <th css={thAndTd}>도서명</th>
                        <th css={thAndTd}>저자명</th>
                        <th css={thAndTd}>출판사</th>
                    </tr>
                </thead>
                <tbody>
                    {getBooks.isLoading ? "" : getBooks.data.data.bookList.map(book => (
                        <tr>
                            <td css={thAndTd}><input type="radio" name='select' value={book.bookId}/></td>
                            <td css={thAndTd}>{book.categoryName}</td>
                            <td css={thAndTd}>{book.bookName}</td>
                            <td css={thAndTd}>{book.authorName}</td>
                            <td css={thAndTd}>{book.publisherName}</td>
                        </tr>)
                    )}  
                </tbody>
            </table>
            </div>
            <div>
                <button>&#60;</button>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>&#62;</button>
            </div>
            <div>
                <label>도서코드</label>
                <input type="text" readOnly/>
            </div>
            <div>
                <label>분류</label>
                <input type="text" readOnly/>
            </div>
            <div>
                <label>도서명</label>
                <input type="text" readOnly/>
            </div>
            <div>
                <label>저자</label>
                <input type="text" readOnly/>
            </div>
            <div>
                <label>출판사</label>
                <input type="text" readOnly/>
            </div>
            <div>
                <label>이미지 경로</label>
                <input type="text" readOnly/>
            </div>
            <button>등록</button>
        </div>
    );
};

export default BookRegister;