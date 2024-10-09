import Link from "next/link";
import Image from "next/image";

interface sidebarItemProps {
  img: string;
  alt?: string;
  text: string;
  href: string;
  pathname: string;
  onClick: () => void;
}

export default function SidebarItem({
  img,
  alt = "",
  text,
  href,
  pathname,
  onClick,
}: sidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="grid transform place-items-center gap-2 text-xs transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`rounded-full px-3.5 py-2 ${pathname === href ? "bg-blue-50" : ""}`}
      >
        <Image src={img} alt={alt} width={24} height={24} />
      </div>
      <p>{text}</p>
    </Link>
  );
}
