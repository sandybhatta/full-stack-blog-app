import React from 'react';
import { useDispatch } from 'react-redux';
import { shareBlogAction } from '../features/blogSlice'; 
import './ShareButton.css';

const ShareButton = ({ blogId }) => {
  const dispatch = useDispatch();

  const handleShare = () => {
    dispatch(shareBlogAction({ blogId }));
  };

  return (
    <button className="share-button" onClick={handleShare}>
      <i className="bx bx-share-alt"></i> Share
    </button>
  );
};

export default ShareButton;
