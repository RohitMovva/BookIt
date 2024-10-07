"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TempLogo from "../ui/temp-logo";
import Button from "../ui/hero/button";
import useIsMediumScreen from "../lib/hooks";
import SidebarItem from "../ui/home/sidebar-item";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const isMediumScreen = useIsMediumScreen();
  const [isOpen, setIsOpen] = useState(isMediumScreen);

  useEffect(() => {
    setIsOpen(isMediumScreen);
  }, [isMediumScreen]);

  const sidebarItemClasses =
    "grid text-xs gap-2 transform place-items-center p-4 transition-all duration-300 hover:-translate-y-1"; // might just be able to do p

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
          className={`sticky top-20 h-[calc(100vh-5rem)] w-32 transform flex-col border-r border-blue-100 text-black transition-all duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-32"
          } md:translate-x-0`}
        >
          {/* Sidebar items */}
          <nav className="mt-2 grid place-content-center gap-2">
            <SidebarItem
              img="/search-interface-symbol.png"
              text="Search"
              href="/home"
              pathname={pathname}
            />
            <SidebarItem
              img="/search-interface-symbol.png"
              text="Saved"
              href="/home/saved"
              pathname={pathname}
            />
            <SidebarItem
              img="/search-interface-symbol.png"
              text="Listings"
              href="/home/listings"
              pathname={pathname}
            />
            {/* <Link
              href="/home"
              className={`${sidebarItemClasses} ${
                pathname === "/home"
                  ? "font-bold text-blue-800"
                  : "font-normal text-black"
              }`}
            >
              <div
                className={`rounded-full px-3.5 py-2 ${pathname === "/home" ? "bg-blue-50" : ""}`}
              >
                <Image
                  src={"/search-interface-symbol.png"}
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <p>Search</p>
            </Link>
            <Link
              href="/home/saved"
              className={`${sidebarItemClasses} ${
                pathname === "/home/saved"
                  ? "font-bold text-blue-800"
                  : "font-normal text-black"
              }`}
            >
              Saved
            </Link>
            <Link
              href="/home/listings"
              className={`${sidebarItemClasses} ${
                pathname === "/home/listings"
                  ? "font-bold text-blue-800"
                  : "font-normal text-black"
              }`}
            >
              Listings
            </Link> */}
          </nav>
        </div>
        {/* Content */}
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
