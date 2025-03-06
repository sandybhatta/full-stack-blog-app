import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlogAction, commentOnBlogAction,shareBlogAction } from '../features/blogSlice';
import { LikeIcon, CommentIcon, ShareIcon } from './SocialIcons';
import CommentSection from './CommentSection'; 
import {  getCommentsAction } from '../features/blogSlice'
import './BlogCard.css';

const BlogCard = ({ blog }) => {
  const { title, content, authorName, likes, comments, shareCount, _id } = blog;
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false); // Toggle comments section
  const [updatedComments, setUpdatedComments] = useState(comments);  // Store updated comments locally

  useEffect(() => {
    if (user && likes && user._id) {
      setIsLiked(likes.includes(user._id));
    }
  }, [user, likes]);

 
  useEffect(() => {
    if (showComments) {
     
      dispatch(getCommentsAction({ blogId: _id }))
        .then((data) => {
          commentOnBlogAction(data.comments); 
        })
        .catch((error) => console.error('Error fetching comments:', error));
    }
  }, [showComments, _id, dispatch]);

  const handleLike = () => {
    if (!token) return alert('You need to be logged in to like a blog');
    setIsLiked((prevState) => !prevState);
    setLoading(true);
    dispatch(likeBlogAction({ blogId: _id, token }))
      .then(() => {
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleComment = () => {
    setShowComments((prev) => !prev); // Toggle comment section visibility
  };

  const handleShare = () => {
    if (!token) return alert('You need to be logged in to share a blog');
    setLoading(true);
    dispatch(shareBlogAction({ blogId: _id, token }))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const contentPreview = content.length > 150 ? `${content.slice(0, 150)}...` : content;

  return (
    <div className="blog-card">
      <div className="blog-card-header">
        <h3>{title}</h3>
        <p className="author">By {authorName}</p>
      </div>
      <div className="blog-card-content">
        <p>{contentPreview}</p>
      </div>
      <div className="blog-card-footer">
        <div className="blog-card-actions">
          <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={loading}>
            <LikeIcon /> {likes.length}
          </button>
          <button className="comment-btn" onClick={handleComment}>
            <CommentIcon /> {comments.length}
          </button>
          <button className="share-btn" onClick={handleShare} disabled={loading}>
            <ShareIcon /> {shareCount}
          </button>
        </div>
      </div>
      {showComments && <CommentSection blogId={_id} comments={updatedComments || []} />}
    </div>
  );
};

export default BlogCard;

