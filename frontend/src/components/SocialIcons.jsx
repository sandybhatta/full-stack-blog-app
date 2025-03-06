// src/components/SocialIcons.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleLike, addComment, incrementShareCount } from '../features/blogSlice';

export const LikeIcon = ({ isLiked, onClick }) => (
  <div onClick={onClick} className={`social-icon ${isLiked ? 'liked' : ''}`}>
    <i className="bx bx-like" style={{ fontSize: '24px',color:'green' }}></i>
  </div>
);

export const CommentIcon = ({ onClick }) => (
  <div onClick={onClick} className="social-icon">
    <i className="bx bx-comment" style={{ fontSize: '24px',color:'green' }}></i>
  </div>
);

export const ShareIcon = ({ onClick }) => (
  <div onClick={onClick} className="social-icon">
    <i className="bx bx-share-alt" style={{ fontSize: '24px' }}></i>
  </div>
);

const SocialIcons = ({ blogId, likes, comments, shareCount }) => {
  const dispatch = useDispatch();

  const handleLike = () => {
    dispatch(toggleLike({ blogId }));
  };

  const handleComment = () => {
    const comment = prompt("Enter your comment:");
    if (comment) {
      dispatch(addComment({ blogId, comment }));
    }
  };

  const handleShare = () => {
    dispatch(incrementShareCount({ blogId }));
  };

  return (
    <div className="social-icons-container">
      <LikeIcon isLiked={likes.includes(blogId)} onClick={handleLike} />
      <CommentIcon onClick={handleComment} />
      <ShareIcon onClick={handleShare} />
      <span>{shareCount} Shares</span>
    </div>
  );
};

export default SocialIcons;
