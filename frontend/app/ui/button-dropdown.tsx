import { useState } from "react";
import Link from "next/link";

interface ButtonProps {
  text?: string;
  bgColor?: string;
  bgHover?: string;
  border?: string;
  borderColor?: string;
  textColor?: string;
  href?: string;
  onClick?: () => void;
}

interface DropdownButtonProps extends ButtonProps {
  options: { label: string; href?: string; onClick?: () => void }[]; // Dropdown options
}

export default function DropdownButton({
  text = "Button",
  bgColor = "bg-blue-800",
  border = "border-0",
  borderColor = bgColor,
  textColor = "text-white",
  options,
  href,
  onClick,
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false); // Dropdown open state

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown open state
  };

  const handleOptionClick = (option: {
    onClick?: () => void;
    href?: string;
  }) => {
    if (option.onClick) {
      option.onClick(); // Call the onClick function if provided
    }
    setIsOpen(false); // Close dropdown after selection
  };

  const buttonContent = (
    <button
      onClick={toggleDropdown}
      className={`${bgColor} ${textColor} ${border} ${borderColor} flex h-12 transform items-center justify-center rounded-xl px-4 text-base transition-transform duration-300 hover:-translate-y-1`}
    >
      {text}
    </button>
  );

  return (
    <div className="relative inline-block">
      {href ? (
        <Link href={href} passHref>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option, index) => (
              <Link key={index} href={option.href || "#"} passHref>
                <button
                  onClick={() => handleOptionClick(option)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
