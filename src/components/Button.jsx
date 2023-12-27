import React from 'react';
import '../App.css';
const Button = ({ text, type, onClick }) => {
    return (
        <button className={`btn btn-${type}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
