import React from 'react';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className="field-checkbox">
      <PrimeCheckbox inputId={label} checked={checked} onChange={onChange} />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default Checkbox;