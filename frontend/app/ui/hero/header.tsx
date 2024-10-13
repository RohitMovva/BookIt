import TempLogo from "../logo";
// import Button from "../hero/button";
import Button from "../button";
import GoogleAuth from "../google-auth";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 grid h-20 w-full items-center border-b border-blue-100 bg-white">
      <ul className="flex h-16 justify-between px-10">
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
            <Button text="Sign Up" href="/signup" />
          </li>
          <li>
            <Button
              text="Log In"
              border="border"
              borderColor="border-black"
              bgColor="bg-white"
              textColor="text-black"
              href="/login"
            />
          </li>
        </div>
      </ul>
    </header>
  );
}
