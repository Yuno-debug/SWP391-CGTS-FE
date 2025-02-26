import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({ type, placeholder, value, onChange, name }) => {
  const [inputType, setInputType] = useState(type);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setInputType(isPasswordVisible ? "password" : "text");
  };

  return (
    <div className="input-wrapper">
      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        className="input-field"
        value={value}
        onChange={onChange} // Cập nhật giá trị
      />
      {type === "password" && (
        <i className="eye-icon" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </i>
      )}
    </div>
  );
};

export default InputField;
