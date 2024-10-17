"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import TempLogo from "../logo";
import SidebarItem from "./sidebar-item";
import Search from "./search";
import { fetchUserProfilePicture } from "../../lib/data";
import Button from "../button";
import DropdownButton from "../button-dropdown";
import PriceRangeSlider from "./price-range-slider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const handlePriceChange = useDebouncedCallback(
    (min: number, max: number) => {
      console.log(`Selected price range: $${min} - $${max}`);
      // Add logic to filter products or perform actions with selected range
    },
    300, // Debounce delay in milliseconds
  );

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
          className={`fixed bottom-0 z-30 h-24 w-screen transform border-t border-blue-100 bg-white text-black md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-24 md:flex-col md:border-r md:border-t-0`}
        >
          {/* Side/bottombar items */}
          <nav className="grid h-full grid-cols-3 place-content-center gap-4 md:mt-4 md:h-fit md:grid-cols-1">
            <SidebarItem
              img="/search-interface-symbol.png"
              text="Search"
              href="/"
              pathname={pathname}
            />
            <SidebarItem
              img="/bookmark.png"
              text="Saved"
              href="/saved"
              pathname={pathname}
            />
            <SidebarItem
              img="/list.png"
              text="Listings"
              href="/listings"
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
          className={`fixed left-0 top-0 z-40 h-screen max-w-0 transform flex-col overflow-hidden border-blue-100 bg-white text-black transition-all duration-300 md:sticky md:top-20 md:z-20 md:h-[calc(100vh-5rem)] md:border-r ${
            isOpen
              ? "max-w-full translate-x-0 rounded-xl md:left-24 md:rounded-none"
              : "-translate-x-full"
          }`}
        >
          {/* Filters */}
          <section className="grid h-full w-72 gap-4 p-2 md:mt-4 md:h-fit">
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
              isOpen={isOpen}
            />
            <PriceRangeSlider
              min={0}
              max={1000}
              step={1}
              onChange={handlePriceChange}
            />
          </section>
        </div>
        {/* Content */}
        <div className="mx-6 my-4 flex-grow space-y-6 pb-24 md:pb-0 xl:mx-12 2xl:mx-24">
          {pathname === "/listings" ? (
            <div className="flex space-x-6">
              <div className="flex-grow">
                <Search placeholder={searchDefault} />
              </div>
              <Button
                text="Create Listing"
                href="/create"
                img="/add-white.png"
              />
            </div>
          ) : (
            <Search placeholder={searchDefault} />
          )}
          <Button
            text="Filters"
            onClick={toggleSidebar}
            img="/filter.png"
            isOpen={isOpen}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
