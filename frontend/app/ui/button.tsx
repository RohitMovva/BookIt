import Link from "next/link";
interface ButtonProps {
  text?: string;
  bgColor?: string;
  bgHover?: string;
  border?: string;
  borderColor?: string;
  textColor?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function Button({
  text = "Button",
  bgColor = "bg-blue-800",
  border = "border-0",
  borderColor = bgColor,
  textColor = "text-white",
  href,
  type = "button",
  onClick,
}: ButtonProps) {
  const buttonContent = (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${textColor} ${border} ${borderColor} flex h-12 transform items-center justify-center rounded-xl px-4 transition-transform duration-300 hover:-translate-y-1`}
    >
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
