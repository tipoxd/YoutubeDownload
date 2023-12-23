import React from 'react';

const Button = ({ text, type }) => {
    return (
        <button type="button" className={`btn btn-${type}`}>
            {text}
        </button>
    );
}

export default Button;
