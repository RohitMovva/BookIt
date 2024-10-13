"use client";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import { useCallback } from "react";

const API_BASE_URL = "http://127.0.0.1:5000";  // Add this line

export default function Page() {
  const router = useRouter();

  const handleSignout = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/signout`, {  // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign out');
      }

      router.push("/login");
    } catch (error) {
      // Optionally, show the error to the user
    }
  }, [router]);

  return <Button text="Sign out" onClick={handleSignout} />;
}