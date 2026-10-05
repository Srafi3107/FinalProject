import React from 'react';
import './Input.css';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = null,
  helperText = null,
  required = false,
  disabled = false,
  icon = null,
  rightElement = null,
  className = '',
  ...props
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`custom-input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="custom-input-label">
          {label} {required && <span className="input-required-star">*</span>}
        </label>
      )}

      <div className={`custom-input-box ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
        {icon && <span className="input-left-icon">{icon}</span>}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="custom-input-field"
          {...props}
        />

        {rightElement && <div className="input-right-element">{rightElement}</div>}
      </div>

      {error && <span className="input-error-msg">{error}</span>}
      {!error && helperText && <span className="input-helper-msg">{helperText}</span>}
    </div>
  );
};

export default Input;
