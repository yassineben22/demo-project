import React from 'react';
import { InputText } from 'primereact/inputtext';

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = 'text', placeholder }) => {
  return (
    <div className="field">
      <label htmlFor={label}>{label}</label>
      <InputText id={label} value={value} onChange={onChange} type={type} placeholder={placeholder} />
    </div>
  );
};

export default Input;