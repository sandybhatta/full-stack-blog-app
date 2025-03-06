import React from "react";
import "../assets/styles/Loading.css"; // Assuming the CSS file for the shimmer effect

const Loading = () => {
  return (
    <div className="loading-shimmer">
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
    </div>
  );
};

export default Loading;
