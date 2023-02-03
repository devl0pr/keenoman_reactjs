import {FaUserAstronaut} from "react-icons/fa";
import moment from "moment/moment";
import CommentActions from "./commentActions";
import React, {useEffect, useState} from "react";
import 'moment/locale/az'
import CommentForm from "./commentForm";

const Comment = ({comment, n, submitCommentHandler, replies, className, isSubComment = false}) => {

    moment.locale('az')

    const [isNew, setIsNew] = useState(comment.isNew !== undefined)
    const [isReplying, setIsReplying] = useState(false)

    let i = 0;

    return (
        <>
            <li className={isNew ? "comments__item highlight " + className : "comments__item " + className}>
                <div className="comments__autor">
                    <div style={{marginRight: '20px'}}>
                        <FaUserAstronaut style={{color: '#fff', width: '36px', height: 'auto'}}/>
                    </div>
                    <div style={{paddingTop: '2px'}}>
                        <span className="comments__name">#{n} {comment.username}</span>
                        <span className="comments__time">{moment(comment.createdAt).format('DD.MM.YYYY, LT')}</span>
                    </div>
                </div>
                <p className="comments__text">{comment.text}</p>
                <CommentActions setIsReplying={setIsReplying} commentId={comment.id} likeCount={comment.like_count} dislikeCount={comment.dislike_count} likeStatus={comment.me_like_dislike} isSubComment={isSubComment}/>

                {isReplying && <CommentForm setIsReplying={setIsReplying} label={'Reply'} mode={'replying'} commentId={comment.id} submitCommentHandler={submitCommentHandler} />}
            </li>

            {replies.length > 0 && (
                replies.map((reply) => (
                    <Comment n={++i} key={reply.id} comment={reply} replies={[]} className={'comments__item--answer'} isSubComment={true}/>
                ))
            )}

        </>
    )
}

export default Comment