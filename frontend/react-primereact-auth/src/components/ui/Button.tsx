import React from 'react';
import { Button as PrimeButton } from 'primereact/button';

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <PrimeButton
      label={label}
      onClick={onClick}
      className={`custom-button ${className}`}
      style={{ backgroundColor: '#093FB4', color: '#FFFFFF' }}
    />
  );
};

export default Button;