import React from 'react';
import Message from '../message/message';
import './messages.css';

const Messages = (props) => {
  console.log(props.messagesArray)
  return (
    <div className="messageBox-container">
      <h3>Courage feed</h3>
      <ul>
      {props.messagesArray.reverse().map((message,index) =>  {return (
        <li>
          <Message
            key={index}
            address={message.address}
            time={message.timestamp.toString()}
            message={message.message}
          />
        </li>
      )})}
      </ul>
    </div>
  );
};

export default Messages;