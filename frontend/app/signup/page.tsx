"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import GoogleAuth from "../ui/googleAuth";
import Button from "../ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    const messages: string[] = [];

    if (pwd.length < minLength) {
      messages.push("Password must be more than eight characters.");
    }
    if (!hasUpperCase) {
      messages.push("Password must include at least one uppercase letter.");
    }
    if (!hasSpecialChar) {
      messages.push("Password must include at least one special character.");
    }

    return messages;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setTooltipMessage("Passwords don't match.");
      setTooltipVisible(true);
      return;
    }

    // check if username exists
    // setTooltipMessage("Username already taken");
    // setTooltipVisible(true);
    // return

    const validationMessages = validatePassword(password);
    if (validationMessages.length > 0) {
      setTooltipMessage(validationMessages.join(" "));
      setTooltipVisible(true);
      return;
    }

    console.log(email);
    console.log(username);
    console.log(password);
    // Add logic to handle successful signup
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setTooltipVisible(false);
    };

  return (
    <div className="grid h-screen place-content-center">
      <form
        onSubmit={handleLogin}
        className="grid h-screen w-screen content-center gap-8 rounded-xl border-gray-300 p-12 md:h-fit md:w-96 md:border md:shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold">Sign Up</h1>
        <div className="grid gap-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange(setEmail)} // Use handler to update email
            className="flex h-12 transform items-center justify-center rounded-xl border border-gray-400 px-4 focus:outline-none"
            placeholder="Email"
          />
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleInputChange(setUsername)} // Use handler to update username
            className="flex h-12 transform items-center justify-center rounded-xl border border-gray-400 px-4 focus:outline-none"
            placeholder="Username"
          />
          <div className="relative rounded-xl">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)} // Use handler to update password
              className="flex h-12 w-full transform items-center justify-center rounded-xl border border-gray-400 px-4 focus:outline-none"
              placeholder="Password"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 transition-all duration-300 hover:bg-gray-300">
              <Image
                src={
                  showPassword ? "/visibility-filled.png" : "/visibility.png"
                }
                height={24}
                width={24}
                alt=""
                onClick={toggleShowPassword}
              />
            </div>
          </div>
          {password && (
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)} // Use handler to update confirm password
              className="flex h-12 transform items-center justify-center rounded-xl border border-gray-400 px-4 transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
              placeholder="Confirm Password"
            />
          )}
          <Button type="submit" text="Sign up" />
        </div>
        <div className="grid place-content-center gap-4">
          <p className="text-center">Or continue with:</p>
          <GoogleAuth mode="signup" />
        </div>
        {tooltipVisible && <p className="text-red-500">{tooltipMessage}</p>}
      </form>
    </div>
  );
}
