'use client'
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '../api/hooks/useAuthStatus';
import axios from 'axios';

interface Props {
  mode: "signin" | "signup";
}

const GoogleAuth: React.FC<Props> = ({ mode }) => {
  const router = useRouter();
  const { checkAuthStatus } = useAuthStatus();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById(
          mode === "signin" ? "google-signin-button" : "google-signup-button",
        ),
        {
          theme: "outline",
          size: "large",
          text: mode === "signin" ? "signin_with" : "signup_with",
        },
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [mode]);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    try {
      const axiosResponse = await axios.post('http://127.0.0.1:5000/signin', 
        { credential: idToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // This is crucial for sending and receiving cookies
        }
      );

      console.log(axiosResponse.data);
      if (axiosResponse.status === 200) {
        await checkAuthStatus(); // Update the auth status
        router.push('/'); // Redirect to home page
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      id={mode === "signin" ? "google-signin-button" : "google-signup-button"}
    ></div>
  );
};

export default GoogleAuth;
