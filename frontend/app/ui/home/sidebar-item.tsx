import Link from "next/link";
import Image from "next/image";

interface sidebarItemProps {
  img: string;
  alt?: string;
  text: string;
  href: string;
  pathname: string;
}

export default function SidebarItem({
  img,
  alt = "",
  text,
  href,
  pathname,
}: sidebarItemProps) {
  return (
    <Link
      href={href}
      className="grid transform place-items-center gap-2 transition-all duration-300 hover:-translate-y-1 grid-cols-1"
    >
      <div
        className={`rounded-full px-3.5 py-2 ${pathname === href ? "bg-blue-50" : ""}`}
      >
        <Image src={img} alt={alt} width={20} height={20} />
      </div>
      <p className="text-xs">{text}</p>
    </Link>
  );
}
