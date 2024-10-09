"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TempLogo from "../ui/temp-logo";
import useIsMediumScreen from "../lib/hooks";
import SidebarItem from "../ui/home/sidebar-item";
import Search from "../ui/home/search";
import { fetchUserProfilePicture } from "../lib/data";

export default function Layout(
  { children }: { children: React.ReactNode },
  {
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  },
) {
  const pathname = usePathname();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const isMediumScreen = useIsMediumScreen();
  const [isOpen, setIsOpen] = useState(isMediumScreen);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );

  const arr = pathname.split("/");
  const searchDefault = "Search " + arr[arr.length - 1];

  useEffect(() => {
    setIsOpen(isMediumScreen);
  }, [isMediumScreen]);

  useEffect(() => {
    const loadProfilePicture = async () => {
      const url = await fetchUserProfilePicture();
      setProfilePictureUrl(url);
    };
    loadProfilePicture();
  }, []);

  const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <div className="scrollbar-track-white text-pretty">
      {/* Top bar */}
      <nav className="sticky top-0 z-10 grid h-20 w-full items-center border-b border-blue-100 bg-white">
        <ul className="flex h-16 justify-between px-6 md:px-10">
          {/* Toggle button for mobile view */}
          {!isMediumScreen && (
            <Image
              src="/hamburger.png"
              alt="Hamburger menu icon"
              width={24}
              height={24}
              className="flex cursor-pointer place-self-center md:hidden"
              onClick={toggleSidebar}
            />
          )}
          <div className="flex h-full items-center space-x-5">
            <li>
              <TempLogo />
            </li>
            <li>
              <p className="text-3xl">bookit</p>
            </li>
          </div>
          <div className="flex h-full items-center space-x-5">
            <li className="transition-all duration-300 hover:-translate-y-1">
              <Link href="/settings">
                <Image src="/setting.png" alt="" width={32} height={32} />
              </Link>
            </li>
            <li className="transition-all duration-300 hover:-translate-y-1">
              <Link href="/profile">
                {/* use image else use placeholder */}
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt="Profile"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300" />
                )}
              </Link>
            </li>
          </div>
        </ul>
      </nav>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-0 left-0 top-0 z-30 bg-black/50 transition-all duration-300 ${isOpen ? "left-24 translate-x-0" : "-translate-x-full"} md:left-0 md:-translate-x-full`}
          onClick={handleSidebarClick}
        ></div>
        <div
          className={`fixed top-0 z-30 h-screen w-1/2 transform flex-col border-blue-100 bg-white text-black transition-all duration-300 md:top-20 md:h-[calc(100vh-5rem)] md:w-24 md:border-r ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:sticky md:translate-x-0`}
        >
          {/* Sidebar items */}
          <nav className="grid h-full place-content-center gap-4 md:mt-4 md:h-fit">
            <SidebarItem
              img="/search-interface-symbol.png"
              text="Search"
              href="/home"
              pathname={pathname}
              onClick={toggleSidebar}
            />
            <SidebarItem
              img="/bookmark.png"
              text="Saved"
              href="/home/saved"
              pathname={pathname}
              onClick={toggleSidebar}
            />
            <SidebarItem
              img="/list.png"
              text="Listings"
              href="/home/listings"
              pathname={pathname}
              onClick={toggleSidebar}
            />
          </nav>
        </div>
        {/* Content */}
        <div className="flex-grow space-y-6 p-6 md:p-12">
          <Search placeholder={searchDefault} />
          {children}
        </div>
      </div>
    </div>
  );
}
