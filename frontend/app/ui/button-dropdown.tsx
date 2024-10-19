import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ButtonProps } from "../lib/definitions";
import Image from "next/image";

interface DropdownButtonProps extends ButtonProps {
  options: { label: string; href?: string; onClick?: () => void }[]; // Dropdown options
  isOpen?: boolean; // New prop to control dropdown visibility from parent
  rounded?: string;
  caretBlack?: boolean;
}

export default function DropdownButton({
  text = "Button",
  bgColor = "bg-blue-800",
  bgHover = "",
  border = "border-0",
  borderColor = bgColor,
  textColor = "text-white",
  options,
  href,
  onClick,
  isOpen: isOpenProp,
  rounded = "rounded-xl",
  caretBlack = false,
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false); // Local state
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to track the dropdown element

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

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    // Attach event listener to document to capture clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buttonContent = (
    <button
      onClick={toggleDropdown}
      className={`${
        isOpen ? bgHover : bgColor
      } ${textColor} ${border} ${borderColor} ${rounded} line-clamp-1 flex h-12 transform items-center justify-center gap-x-2 px-4 ${bgHover}`}
    >
      {text}
      <Image
        src={caretBlack ? "/caret-down-black.png" : "/caret-down.png"}
        alt={"caret down"}
        width={12}
        height={12}
      />
    </button>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
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
          <div className="z-50 py-1">
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
