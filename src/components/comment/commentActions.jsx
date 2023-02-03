import moment from 'moment'
import 'moment/locale/az'
import React, {useEffect, useState} from 'react'
import {requestWithToken} from "../../config/axios-config";
import FullscreenSpin from "../helpers/fullscreen-spin";
import { AiOutlineLike, AiOutlineDislike, AiTwotoneLike, AiTwotoneDislike } from "react-icons/ai";
import { BsReply, BsChatLeftQuote } from "react-icons/bs";

const CommentActions = ({commentId, likeStatus, likeCount, dislikeCount, setIsReplying, isSubComment = false}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [commentLikeStatus, setCommentLikeStatus] = useState(likeStatus);
    const [commentLikeCount, setCommentLikeCount] = useState(likeCount);
    const [commentDislikeCount, setCommentDislikeCount] = useState(dislikeCount);
    const [likeType, setLikeType] = useState(null);

    moment.locale('az')

    useEffect(() => {
        if(likeType === null) return;

        requestWithToken()
            .post('/movie/comment/' + commentId + '/like/' + likeType)
            .then(function (response) {

            })
            .catch(function (error) {
                console.log(error);
            });
    }, [likeType])


    const likeCommentHandle = (status) => {
        if(status > 0) {
            if(commentLikeStatus === 1) {
                setCommentLikeCount(commentLikeCount-1)
                setCommentLikeStatus(0)
                setLikeType(0)
            }
            else if(commentLikeStatus === -1) {
                setCommentDislikeCount(commentDislikeCount-1)
                setCommentLikeCount(commentLikeCount+1)
                setCommentLikeStatus(1)
                setLikeType(1)
            } else {
                setCommentLikeCount(commentLikeCount+1)
                setCommentLikeStatus(1)
                setLikeType(1)
            }
        }
        else if (status < 0) {
            if(commentLikeStatus === 1) {
                setCommentLikeCount(commentLikeCount-1)
                setCommentDislikeCount(commentDislikeCount+1)
                setCommentLikeStatus(-1)
                setLikeType(-1)
            }
            else if(commentLikeStatus === -1) {
                setCommentDislikeCount(commentDislikeCount-1)
                setCommentLikeStatus(0)
                setLikeType(0)
            } else {
                setCommentDislikeCount(commentDislikeCount+1)
                setCommentLikeStatus(-1)
                setLikeType(-1)
            }
        }
    }

    return (
        <>
            {
                isLoading ? <FullscreenSpin/> :
                    <div className="comments__actions" style={isSubComment ? {height: '40px'} : {}}>
                        <div className="comments__rate">
                            <button onClick={() => {likeCommentHandle(1)}} type="button">
                                { commentLikeStatus === 1 ? <AiTwotoneLike style={{color: '#29b474', width: '13px', height: 'auto'}} /> : <AiOutlineLike style={{color: '#29b474', width: '13px', height: 'auto'}} /> }
                                {commentLikeCount}
                            </button>

                            <button onClick={() => {likeCommentHandle(-1)}} type="button"> {commentDislikeCount}
                                { commentLikeStatus === -1 ? <AiTwotoneDislike style={{color: '#eb5757', width: '13px', height: 'auto'}} /> : <AiOutlineDislike style={{color: '#eb5757', width: '13px', height: 'auto'}} /> }
                            </button>
                        </div>
                        {isSubComment || (
                            <>
                                <button type="button" onClick={() => setIsReplying(true)}>
                                    {/*<BsReply style={{color: '#fff', width: '13px', height: 'auto'}} /> <span>Reply</span>*/}
                                </button>
                                {/*<button type="button">*/}
                                {/*    <BsChatLeftQuote style={{color: '#fff', width: '13px', height: 'auto'}} /> <span>Quote</span>*/}
                                {/*</button>*/}
                            </>
                        )}

                    </div>
            }
        </>
    );
}


export default CommentActions