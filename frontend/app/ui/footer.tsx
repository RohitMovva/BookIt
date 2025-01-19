import TempLogo from "./logo";
import Link from "next/link";

export default function Header() {
  return (
    <footer className="bg-blue-50 p-6">
      <div className="flex h-full place-content-center items-center space-x-5">
        <p className="text-gray-600">© 2024 All Rights Reserved, bookit</p>
        <Link href={"/about"} className="text-gray-600">
          About Us
        </Link>
        <Link href={"/contact"} className="text-gray-600">
          Contact Us
        </Link>
        <Link href={"/attributions"} className="text-gray-600">
          Attributions
        </Link>
        {/* <p className="text-sm">Made by: Alden Bradley, Rohit Movva, Pierce Ross, Joshua Velayo</p> */}
      </div>
    </footer>
  );
}
