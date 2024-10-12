"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../button";

export default function EmailInput() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      router.push(`/signup`);
    } else {
      router.push(`/signup?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <form onSubmit={handleEmailSubmit} className="flex items-center space-x-4">
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex h-12 transform items-center justify-center rounded-xl border border-gray-400 px-4 focus:outline-none"
        placeholder="Enter your email"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" text="Sign up" />
    </form>
  );
}
