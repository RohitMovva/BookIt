"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TempLogo from "../ui/temp-logo";
import SidebarItem from "../ui/home/sidebar-item";
import Search from "../ui/home/search";
import { fetchUserProfilePicture } from "../lib/data";
import Button from "../ui/button";
import DropdownButton from "../ui/button-dropdown";

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
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );

  const arr = pathname.split("/");
  const searchDefault = "Search " + arr[arr.length - 1];

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
        {/* Sidebar/Bottom (need to implement) bar */}
        <div
          className={`fixed bottom-0 z-30 h-24 w-screen transform border-t border-blue-100 bg-white text-black md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-24 md:flex-col md:border-r`}
        >
          {/* Side/bottombar items */}
          <nav className="grid h-full grid-cols-3 place-content-center gap-4 md:mt-4 md:h-fit md:grid-cols-1">
            <SidebarItem
              img="/search-interface-symbol.png"
              text="Search"
              href="/home"
              pathname={pathname}
            />
            <SidebarItem
              img="/bookmark.png"
              text="Saved"
              href="/home/saved"
              pathname={pathname}
            />
            <SidebarItem
              img="/list.png"
              text="Listings"
              href="/home/listings"
              pathname={pathname}
            />
          </nav>
        </div>
        {/* Collapsable Filter Section */}
        {/* Overlay */}
        <div
          className={`fixed inset-0 left-0 top-0 z-30 bg-black/50 transition-all duration-300 md:pointer-events-none ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"} md:opacity-0`}
          onClick={handleSidebarClick}
        ></div>
        {/* Collapsable */}
        <div
          className={`fixed left-0 top-0 z-40 h-screen max-w-0 transform flex-col overflow-hidden border-blue-100 bg-white text-black transition-all duration-300 md:static md:z-20 md:h-[calc(100vh-5rem)] md:border-r ${
            isOpen
              ? "w-1/2 max-w-full translate-x-0 md:left-24 md:w-fit"
              : "-translate-x-full"
          }`}
        >
          {/* Filters */}
          <section className="grid h-full place-content-center gap-4 p-6 md:mt-4 md:h-fit">
            <DropdownButton
              text="Menu"
              options={[
                { label: "Profile", href: "/profile" },
                { label: "Settings", href: "/settings" },
                {
                  label: "Logout",
                  onClick: () => console.log("Logging out..."),
                },
              ]}
            />
          </section>
        </div>
        {/* Content */}
        <div className="mx-6 my-4 flex-grow space-y-6 pb-24 md:pb-0 xl:mx-12 2xl:mx-24">
          <Search placeholder={searchDefault} />
          <Button text="Filters" onClick={toggleSidebar} />
          {children}
        </div>
      </div>
    </div>
  );
}
