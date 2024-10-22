import React from "react";
import Image from "next/image";

interface SelectProps {
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const StyledSelect: React.FC<SelectProps> = ({
  name,
  value,
  options,
  onChange,
  className,
}) => {
  return (
    <div className="relative w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-400 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Image
          src="/caret-down-black.png"
          alt="Caret down"
          width={12}    
          height={12}
        />
      </div>
    </div>
  );
};

export default StyledSelect;
