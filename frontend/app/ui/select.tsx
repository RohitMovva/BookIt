import React from "react";
import Image from "next/image";

interface SelectProps {
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
      {/* Select button */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block h-12 w-full cursor-pointer appearance-none rounded-xl border border-gray-400 bg-white px-4 py-2 pr-6 hover:bg-gray-50 focus:bg-gray-200 focus:outline-none ${className}`} // Background color only applies to the select button
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white">
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
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
