import { useState, useEffect } from "react";
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
  isOpen: boolean; // New prop to control dropdown visibility from parent
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
  isOpen: isOpenProp, // Rename prop to differentiate it from local state
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false); // Local state

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

  // Sync internal isOpen state with isOpenProp
  useEffect(() => {
    if (!isOpenProp) {
      setIsOpen(false);
    }
  }, [isOpenProp]);

  const buttonContent = (
    <button
      onClick={toggleDropdown}
      className={`${bgColor} ${textColor} ${border} ${borderColor} w-full flex h-12 transform items-center justify-center rounded-xl px-4 transition-transform duration-300 hover:-translate-y-1`}
    >
      {text}
    </button>
  );

  return (
    <div className="relative w-full">
      {href ? (
        <Link href={href} passHref>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white">
          <div className="z-50 bg-red-500 py-1">
            <p className="bg-green-500 text-right">HELLO</p>
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