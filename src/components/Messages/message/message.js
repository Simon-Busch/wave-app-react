import React from 'react';
// import { formatDate } from '../../../../date';
import './message.css';

const Message = (props) => {
	function formatDate(date) {
		var dd = new Date(date).getDate();
	
		var mm = new Date(date).getMonth() + 1;
	
		var yy = new Date(date).getFullYear();
	
		if (mm < 10) {
			mm = "0" + mm;
		}
		if (dd < 10) {
			dd = "0" + dd;
		}
	
		return dd + "." + mm + "." + yy;
	}

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
          <p className="message-small">Time: {formatDate(props.time)}</p>
        </div>
        </div>
			</div>
			{/* <div>won ?</div> */}
		</div>
	);
};

export default Message;
