"use client";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import { useCallback } from "react";
import { deleteCookie } from 'cookies-next';
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000";

export default function Page() {
  const router = useRouter();

  const handleSignout = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signout`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;
      console.log(result.message);

      deleteCookie('auth_token');

      router.push("/");
    } catch (error) {
      console.error('Signout error:', error);
    }
  }, [router]);

  return <Button text="Sign out" onClick={handleSignout} />;
}
