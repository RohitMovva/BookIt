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

export default function Button({
  text = "Button",
  bgColor = "bg-blue-800",
  bgHover = "bg-blue-400",
  border = "border-0",
  borderColor = "border-black",
  textColor = "text-white",
  href,
  onClick,
}: ButtonProps) {
  const buttonContent = (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} ${border} ${borderColor} min-w-20 rounded-xl px-4 py-2 text-sm hover:${bgHover} transition`}
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
