"use client";
import TempLogo from "./ui/temp-logo";
import Button from "./ui/button";

export default function Page() {
  return (
    <main>
      <header>
        <ul className="flex h-16 justify-between px-5">
          <div className="flex h-full items-center bg-blue-200">
            <li>
              <TempLogo />
            </li>
            <li>
              <p className="text-blue-400">bookit</p>
            </li>
          </div>
          <div className="flex h-full items-center bg-red-400">
            <li>
              <Button text="Sign Up" href="/databasetest" />
            </li>
            <li>
              <Button
                text="Log In"
                border="border"
                bgColor="bg-white"
                bgHover="bg-gray-300"
                textColor="text-black"
              />
            </li>
          </div>
        </ul>
      </header>
    </main>
  );
}
