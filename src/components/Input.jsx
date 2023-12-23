import React from 'react';

const InputComponent = ({ label, type, placeholder, value, onChange, className, name }) => {
    return (
        <div>
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`input input-bordered w-full max-w-xs ${className}`}
                name={name}
            />
        </div>
    );
};

export default InputComponent;
