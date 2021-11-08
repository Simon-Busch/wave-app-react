import React from 'react';
import './message.css';

const Message = (props) => {
	return (
		<div className="message-container">
			<div className="message-container-message">
				<div>
					<p>{props.message}</p>
				</div>
        <div className="message-container-info">
				<div>
					<p className="message-small"> Adr: {props.address}</p>
				</div>
        <div>
          <p className="message-small">Time: {props.time}</p>
        </div>
        </div>
			</div>
			{/* <div>won ?</div> */}
		</div>
	);
};

export default Message;
