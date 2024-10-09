"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import TempLogo from "../ui/temp-logo";
import Button from "../ui/hero/button";
import useIsMediumScreen from "../lib/hooks";
import SidebarItem from "../ui/home/sidebar-item";
import Search from "../ui/home/search";

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
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pathname = usePathname();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const isMediumScreen = useIsMediumScreen();
  const [isOpen, setIsOpen] = useState(isMediumScreen);

  var arr = pathname.split("/");
  var searchDefault = "Search " + arr[arr.length - 1];

  useEffect(() => {
    setIsOpen(isMediumScreen);
  }, [isMediumScreen]);

  return (
    <div className="scrollbar-track-white">
      {/* Top bar */}
      <nav className="sticky top-0 z-10 grid h-20 w-full items-center border-b border-blue-100 bg-white">
        <ul className="flex h-16 justify-between px-10">
          {/* Toggle button for mobile view */}
          {!isMediumScreen && (
            <button
              className="flex place-self-center md:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <span>{isOpen ? "close" : "menu"}</span>
            </button>
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
            <li>
              <Button text="Sign Up" href="/databasetest" />
            </li>
            <li>
              <Button
                text="Log In"
                border="border"
                borderColor="border-black"
                bgColor="bg-white"
                textColor="text-black"
              />
            </li>
          </div>
        </ul>
      </nav>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-20 z-20 h-[calc(100vh-5rem)] w-24 transform flex-col border-r border-blue-100 bg-white text-black transition-all duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:sticky md:translate-x-0`}
        >
          {/* Sidebar items */}
          <nav className="mt-4 grid place-content-center gap-4">
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
        {/* Content */}
        <div className="flex-grow space-y-6 p-6 md:p-12">
          <Search placeholder={searchDefault} />
          {children}
        </div>
      </div>
    </div>
  );
}
