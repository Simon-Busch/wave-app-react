import React from 'react';
import './button.css';

const Button = (props) => {
  return (
    <div onClick={props.onClick} className="button">YES</div>
  );
};

export default Button;