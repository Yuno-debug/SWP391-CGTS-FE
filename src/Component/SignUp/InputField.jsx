import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({ type, placeholder }) => {
  const [inputType, setInputType] = useState(type);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setInputType(isPasswordVisible ? 'password' : 'text');
  };

  return (
    <div className="input-wrapper">
      <input
        type={inputType}
        placeholder={placeholder}
        className="input-field"
      />
      {type === 'password' && (
        <i className="eye-icon" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </i>
      )}
    </div>
  );
};

export default InputField;