"use client";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import { useCallback } from "react";
import { deleteCookie } from 'cookies-next';
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000";  // Make sure this matches your Flask server address

export default function Page() {
  const router = useRouter();

  const handleSignout = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signout`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,  // This is important for including cookies
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;
      console.log(result.message);

      // Delete the auth_token cookie on the client side
      deleteCookie('auth_token');

      router.push("/login");
    } catch (error) {
      console.error('Signout error:', error);
      // Optionally, show the error to the user
    }
  }, [router]);

  return <Button text="Sign out" onClick={handleSignout} />;
}
