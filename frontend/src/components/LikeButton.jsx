import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlogAction } from '../features/blogSlice'; 

const LikeButton = ({ blogId, initialLikeStatus }) => {
  const [liked, setLiked] = useState(initialLikeStatus);
  const dispatch = useDispatch();
  
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setLiked(initialLikeStatus); 
  }, [initialLikeStatus]);

  const handleLike = () => {
    if (!token) {
      alert('You need to be logged in to like a blog');
      return;
    }
  
    setLoading(true); 
    dispatch(likeBlogAction({ blogId: _id, token })).then(() => {
    
      setIsLiked((prevState) => !prevState); 
      setLoading(false); 
    }).catch(() => setLoading(false)); 
  };
  

  return (
    <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
      <i className={`bx bx-like ${liked ? 'liked-icon' : ''}`} />
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default LikeButton;
