import React, { useEffect, useState } from 'react';
import './ToastMessage.css';

const ToastMessage = ({ message, type, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose(); // Call onClose when the toast disappears
    }, 3000); // Hide toast after 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    show && (
      <div className={`toast-message ${type}`}>
        <span>{message}</span>
      </div>
    )
  );
};

export default ToastMessage;
