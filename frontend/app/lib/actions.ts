"use server";

import axios from "axios";

interface SignoutResponse {
  message: string;
}

interface SignoutError {
  error: string;
}

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust this to match your Flask server's address and port
  withCredentials: true,
});

export const signout = async (response: any) => {
  try {
    const authResponse = await fetch(`/api/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // This is important for including cookies
    });
    return response.data;
  } catch (error) {
    return { error: "An unexpected error occurred during signout" };
    // console.error('Error:', error);
  }
};