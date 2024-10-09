import Link from "next/link";
import Image from "next/image";
import useIsMediumScreen from "../../lib/hooks";
import { useEffect, useState } from "react";

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
  const [imgSize, setImgSize] = useState(24); // Initialize imgSize state
  const isMediumScreen = useIsMediumScreen();

  useEffect(() => {
    if (isMediumScreen) {
      setImgSize(24); // Update state for medium screen
    } else {
      setImgSize(32); // Update state for larger screens
    }
  }, [isMediumScreen]); // Dependency array includes isMediumScreen

  return (
    <Link
      href={href}
      onClick={onClick}
      className="grid transform grid-cols-2 place-items-center gap-2 transition-all duration-300 hover:-translate-y-1 md:grid-cols-1"
    >
      <div
        className={`rounded-full px-3.5 py-2 ${pathname === href ? "bg-blue-50" : ""}`}
      >
        <Image src={img} alt={alt} width={imgSize} height={imgSize} />
      </div>
      <p className="text-lg md:text-xs">{text}</p>
    </Link>
  );
}
