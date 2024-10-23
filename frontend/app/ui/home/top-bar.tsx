import Link from "next/link";
import Image from "next/image";
import TempLogo from "../logo";
import { useEffect, useState } from "react";
import { fetchUserProfilePicture } from "../../lib/data";

export default function TopBar() {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadProfilePicture = async () => {
      const url = await fetchUserProfilePicture();
      setProfilePictureUrl(url);
    };
    loadProfilePicture();
  }, []);

  return (
    <nav className="sticky top-0 z-10 grid h-20 w-full items-center border-b border-blue-100 bg-white">
      <ul className="flex h-16 justify-between px-6 md:px-10">
        <Link href={"/"}>
          <div className="flex h-full cursor-pointer items-center space-x-5">
            <li>
              <a href="/">
                <TempLogo />
              </a>
            </li>
            <li>
              <a href="/">
                <p className="text-3xl">bookit</p>
              </a>
            </li>
          </div>
        </Link>
        <div className="flex h-full items-center space-x-5">
          <li className="transition-all duration-300 hover:-translate-y-1">
            <Link href="/profile">
              {/* use image else use placeholder */}
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt="Profile picture"
                  width={42}
                  height={42}
                  className="rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300" />
              )}
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
