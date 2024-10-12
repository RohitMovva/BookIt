'use client'

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '../api/hooks/useAuthStatus';

interface Props {
  mode: 'signin' | 'signup';
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
        client_id: "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById(mode === 'signin' ? "google-signin-button" : "google-signup-button"),
        { theme: "outline", size: "large", text: mode === 'signin' ? "signin_with" : "signup_with" }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [mode]);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    
    try {
      const authResponse = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: idToken }),
      });

      const data = await authResponse.json();

      if (data.success) {
        await checkAuthStatus();  // Update the auth status
        router.push('/');  // Redirect to home page
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id={mode === 'signin' ? "google-signin-button" : "google-signup-button"}></div>
  );
};

export default GoogleAuth;