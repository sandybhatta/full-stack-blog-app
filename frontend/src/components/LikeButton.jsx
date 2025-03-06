import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlogAction } from '../features/blogSlice'; // Make sure this action exists in your blogSlice
// import './LikeButton.css';

const LikeButton = ({ blogId, initialLikeStatus }) => {
  const [liked, setLiked] = useState(initialLikeStatus);
  const dispatch = useDispatch();
  
  // Get the current user from the auth slice
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setLiked(initialLikeStatus); // Set initial like status from props
  }, [initialLikeStatus]);

  const handleLike = () => {
    if (!token) {
      alert('You need to be logged in to like a blog');
      return;
    }
  
    setLoading(true); // Set loading state
    dispatch(likeBlogAction({ blogId: _id, token })).then(() => {
      // Update the like status after dispatching the like action
      setIsLiked((prevState) => !prevState); // Toggle the like status
      setLoading(false); // Reset loading state
    }).catch(() => setLoading(false)); // Reset loading state on error
  };
  

  return (
    <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
      <i className={`bx bx-like ${liked ? 'liked-icon' : ''}`} />
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default LikeButton;
