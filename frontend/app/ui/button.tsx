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
  border = "border-0",
  borderColor = bgColor,
  textColor = "text-white",
  href,
  onClick,
}: ButtonProps) {
  const buttonContent = (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} ${border} ${borderColor} flex h-12 transform items-center justify-center rounded-xl px-5 text-base transition-transform duration-300 hover:-translate-y-1`}
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
