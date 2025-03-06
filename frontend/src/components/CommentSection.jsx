import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { commentOnBlogAction } from '../features/blogSlice';

const CommentSection = ({ blogId, comments = [] }) => {  // Default to empty array if no comments are passed
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (newComment.trim()) {
      const commentData = {
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      // Dispatch action to add comment to the blog
      dispatch(commentOnBlogAction({ blogId, commentData }));
      setNewComment('');  // Reset the textarea after submitting the comment
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          rows="3"
        />
        <button type="submit" className="comment-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
