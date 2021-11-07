import React from 'react';
import './message.css';

const Message = () => {
  return (
    <div className="message-container">
      <div>
        sender
      </div>
      <div>
        message
      </div>
      <div>
        time
      </div>
      <div>
        won ?
      </div>
    </div>
  );
};

export default Message;