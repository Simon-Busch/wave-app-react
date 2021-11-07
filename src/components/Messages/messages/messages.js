import React from 'react';
import Message from '../message/message';
import './messages.css';

const Messages = () => {
  return (
    <div className="messageBox-container">
      <h3>Courage feed</h3>
      <ul>
        <li>
          <Message />
        </li>
        <li>
          <Message />
        </li>
        <li>
          <Message />
        </li>
        <li>
          <Message />
        </li>
        <li>
          <Message />
        </li>
      </ul>
    </div>
  );
};

export default Messages;