import Link from "next/link";
import Image from "next/image";
import { ButtonProps } from "../lib/definitions";

export default function Button({
  text = "Button",
  bgColor = "bg-blue-800",
  border = "border-0",
  borderColor = bgColor,
  textColor = "text-white",
  href,
  type = "button",
  img = "",
  size = 20,
  imgSide = "l",
  alt = "",
  onClick,
  isOpen = false,
  noAnimation = false,
}: ButtonProps) {
  const buttonContent = (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${textColor} ${border} ${borderColor} line-clamp-1 flex h-12 transform items-center justify-center gap-x-2 rounded-xl px-4 ${!noAnimation ? "transition-transform duration-300 hover:-translate-y-1" : ""}`}
    >
      {img && (
        <Image
          src={isOpen ? "/close.png" : img}
          alt={alt}
          width={size}
          height={size}
          className={imgSide === "r" ? "order-last" : ""}
        />
      )}
      {text}
    </button>
  );
  if (href) {
    return (
      <Link href={href} passHref>
        {buttonContent}
      </Link>
    );
  }
  return buttonContent;
}
