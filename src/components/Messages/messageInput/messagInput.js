import React from 'react';
import './messageInput.css';

const MessagInput = (props) => {
  return (
    <div>
      <input
				type="text"
				placeholder="Do you dare to wave at me 🤡... ?"
				onChange={props.changeHandler}
				className="form-control"
			>
      </input>
      <p>By waving at me you have a chance to win some ETH ... Or I can win some ETH"</p>
      <p>Will you dare ?</p>
    </div>
  );
};

export default MessagInput;