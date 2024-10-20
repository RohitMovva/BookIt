import TempLogo from "./logo";

export default function Header() {
  return (
    <footer className="bg-blue-50 p-2">
        <div className="flex h-full items-center place-content-center space-x-5">
            <a href="#"><TempLogo /></a>
            <p className="text-2xl pr-3"><a href="#">bookit</a></p>
            <p className="text-sm underline underline-offset-1"><a href="/signup">Contact Us</a></p>
            <p className="text-sm underline  underline-offset-1"><a href="/attributions">Attributions</a></p>
            <p className="text-sm">© 2024 bookit, inc. All rights reserved</p>
            <p className="text-sm">Made by: Alden Bradley, Rohit Movva, Pierce Ross, Joshua Velayo</p>
        </div>
    </footer>
  );
}
