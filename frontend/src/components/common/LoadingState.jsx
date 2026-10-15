import React from 'react';
import './LoadingState.css';

const LoadingState = ({ message = 'Loading Dhaka properties...', size = 'md' }) => {
  return (
    <div className={`loading-state-container size-${size}`} role="status">
      <div className="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingState;
