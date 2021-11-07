import React from 'react';
import './button.css';

const Button = (props) => {
  return (
    <div onClick={props.onClick} className="button">hello</div>
  );
};

export default Button;