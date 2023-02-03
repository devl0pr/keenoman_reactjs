import Spin from "../helpers/spin";
import React, {useState} from "react";

const CommentForm = ({ submitCommentHandler, mode, label, setIsReplying, commentId }) => {

    const [commentText, setCommentText] = useState('')
    const [commentError, setCommentError] = useState('')
    const [isCommentPostLoading, setIsCommentPostLoading] = useState(false)

    const commentTextChangeHandler = (e) => {
        setCommentText(e.target.value)
    }

    const submitComment = (e) => {
        e.preventDefault()

        if(!commentText || isCommentPostLoading) return;

        setIsCommentPostLoading(true)

        submitCommentHandler(commentText, setIsCommentPostLoading, setCommentText, setCommentError, commentId)
    }

    return (
        <div style={{marginBottom: '20px'}}>

            <form onSubmit={submitComment} action="components/comment/commentForm#" className="comments__form">
                <div className="sign__group">

                    <textarea value={commentText} onChange={commentTextChangeHandler} id="text" name="text" className="sign__textarea"
                              placeholder="Add comment"></textarea>

                    {commentError && <p style={{fontSize: '12px',  color: '#df4a32', padding: '10px 0px 0 6px'}}>{commentError}</p>}
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <button style={{height: '40px'}} type="submit" className="sign__btn">{isCommentPostLoading ? <Spin /> : label}</button>
                    {mode === 'replying' && <button onClick={() => {setIsReplying(false)}} style={{height: '40px', color: '#fff'}} >Cancel replying</button>}
                </div>

            </form>
        </div>
    )
}

export default CommentForm