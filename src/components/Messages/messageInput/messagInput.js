import React from 'react';
import './messageInput.css';

const MessagInput = (props) => {
  return (
    <div className="input-container">
      <input
				type="text"
				placeholder="Will you dare to wave at me 🤡... ?"
				onChange={props.changeHandler}
				className="form-control"
			>
      </input>
    </div>
  );
};

export default MessagInput;