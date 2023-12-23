import React from 'react';

const SelectComponent = ({ options, defaultValue, onChange, name }) => {
    return (
        <select className="select select-secondary w-full max-w-xs" name={name} onChange={onChange}>
            <option disabled defaultValue={defaultValue}>
                {defaultValue}
            </option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.text}
                </option>
            ))}
        </select>
    );
};

export default SelectComponent;
