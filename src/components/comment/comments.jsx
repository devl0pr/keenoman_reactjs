import moment from 'moment'
import 'moment/locale/az'
import React, {useEffect, useState} from 'react'
import {requestWithToken} from "../../config/axios-config";
import FullscreenSpin from "../helpers/fullscreen-spin";
import Comment from "./comment";
import CommentForm from "./commentForm";
import PrevIcon from "../icons/prev";
import NextIcon from "../icons/next";
import ReactPaginate from "react-paginate";

const Comments = ({id}) => {
    const commentLimitPerPage = 10;

    const [isLoading, setIsLoading] = useState(false)
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState([]);
    const [commentsPage, setCommentsPage] = useState(1);

    moment.locale('az')

    useEffect(() => {
        setIsLoading(true);
        requestWithToken()
            .get('/movie/' + id + '/comment?limit=' + commentLimitPerPage + '&page=' + commentsPage)
            .then(function (response) {
                setComments(response.data.data)
                setCommentsCount(response.data.count)
                setIsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [commentsPage])

    const submitCommentHandler = (commentText, setIsCommentPostLoading, setCommentText, setCommentError, commentId = null) => {
        requestWithToken()
            .post('/movie/' + id + '/comment', {text: commentText, commentId: commentId})
            .then(function (response) {
                setIsCommentPostLoading(false)
                setCommentText('')
                setCommentError('')
                setComments( [{...response.data.data, isNew: true}, ...comments]);

            })
            .catch(function (error) {
                setIsCommentPostLoading(false)
                setCommentError(error.response.data.detail ?? error.response.data.errors.text)
            });
    }

    const handleCommentPageClick = event => {
        const page = event.selected+1;
        setCommentsPage(page)
        setIsLoading(true)
    }

    let i = commentLimitPerPage * (commentsPage -1);

    return (
        <>
            {
                isLoading ? <FullscreenSpin/> :
                <div className="comments">
                    <ul className="nav nav-tabs comments__title comments__title--tabs"
                        id="comments__tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="components/comment/movieComments#tab-1"
                               role="tab" aria-controls="tab-1" aria-selected="true">
                                <h4>Comments</h4>
                                <span>{commentsCount}</span>
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="tab-1" role="tabpanel">

                           <CommentForm submitCommentHandler={submitCommentHandler} label={'Send'}/>

                            <ul className="comments__list">
                                {
                                    comments.map(comment => {
                                       return <Comment key={comment.id} comment={comment} n={++i} submitCommentHandler={submitCommentHandler} replies={[]} />
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            }
            <div className="comments" style={{marginTop:0, paddingTop:0, borderTop:"none"}}>
                <div className="catalog__paginator-wrap catalog__paginator-wrap--comments">
                    <span className="catalog__pages">{(commentsPage * commentLimitPerPage) > commentsCount ? commentsCount : commentsPage * commentLimitPerPage} from {commentsCount}</span>
                    <ReactPaginate
                        containerClassName="catalog__paginator"
                        previousLabel={<PrevIcon />}
                        nextLabel={<NextIcon />}
                        pageClassName=""
                        pageLinkClassName=""
                        previousClassName=""
                        previousLinkClassName=""
                        nextClassName=""
                        nextLinkClassName=""
                        breakLabel="..."
                        breakClassName=""
                        breakLinkClassName=""
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        activeClassName="active"
                        onPageChange={handleCommentPageClick}
                        pageCount={Math.ceil(commentsCount / commentLimitPerPage)}
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
        </>
    );
}

export default Comments