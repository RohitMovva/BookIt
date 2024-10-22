import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-12 w-full transform items-center justify-center rounded-xl border border-gray-400 px-4 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default Input;
