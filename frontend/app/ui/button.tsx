import Link from "next/link";
import Image from "next/image";
interface ButtonProps {
  text?: string;
  bgColor?: string;
  bgHover?: string;
  border?: string;
  borderColor?: string;
  textColor?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  img?: string;
  alt?: string;
  onClick?: () => void;
  isOpen?: boolean;
}

export default function Button({
  text = "Button",
  bgColor = "bg-blue-800",
  border = "border-0",
  borderColor = bgColor,
  textColor = "text-white",
  href,
  type = "button",
  img = "",
  alt = "",
  onClick,
  isOpen = false,
}: ButtonProps) {
  const buttonContent = (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${textColor} ${border} ${borderColor} line-clamp-1 flex h-12 transform items-center justify-center gap-x-2 rounded-xl px-4 transition-transform duration-300 hover:-translate-y-1`}
    >
      {img && (
        <Image
          src={isOpen ? "/close.png" : img}
          alt="alt"
          width={20}
          height={20}
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
