import TempLogo from "./logo";
import Link from "next/link";

export default function Header() {
  return (
    <footer className="bg-blue-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row h-full items-center justify-center space-y-3 md:space-y-0 md:space-x-5 text-center md:text-left">
        <p className="text-gray-600 text-sm md:text-base">© 2024 All Rights Reserved, bookit</p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-5">
          <Link href={"/about"} className="text-gray-600 text-sm md:text-base hover:text-blue-800">
            About Us
          </Link>
          <Link href={"/contact"} className="text-gray-600 text-sm md:text-base hover:text-blue-800">
            Contact Us
          </Link>
          <Link href={"/attributions"} className="text-gray-600 text-sm md:text-base hover:text-blue-800">
            Attributions
          </Link>
          <Link href={"https://github.com/RohitMovva/BookIt"} className="text-gray-600 text-sm md:text-base hover:text-blue-800">
            Github
          </Link>
        </div>
        {/* <p className="text-sm">Made by: Alden Bradley, Rohit Movva, Pierce Ross, Joshua Velayo</p> */}
      </div>
    </footer>
  );
}
