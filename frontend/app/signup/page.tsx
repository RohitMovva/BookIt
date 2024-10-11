"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import GoogleAuth from "../ui/googleAuth";

export default function Page() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add your login logic here
  };

  return (
    <div className="grid h-screen place-content-center">
      <form
        onSubmit={handleLogin}
        className="grid w-96 items-center gap-6 rounded-xl border border-gray-300 p-12 shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold">Sign Up</h1>
        <div className="grid gap-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-300 p-2"
            placeholder="Email"
          />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-md border border-gray-300 p-2"
            placeholder="Username"
          />
          {/* <label htmlFor="password" className="sr-only">A</label> */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Password"
            />
            <Image
              src={showPassword ? "/visibility-filled.png" : "/visibility.png"}
              height={28}
              width={28}
              alt=""
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 cursor-pointer text-gray-500 peer-focus:text-gray-900"
            />
          </div>
          {password && (
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md border border-gray-300 p-2"
              placeholder="Confirm Password"
            />
          )}
          <button
            type="submit"
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            Login
          </button>
        </div>
        <div className="grid place-content-center gap-4">
          <p className="text-center">Or continue with:</p>
          <GoogleAuth mode="signup" />
        </div>
      </form>
    </div>
  );
}
