'use client'

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface Props {
  mode: 'signin' | 'signup';
}

const GoogleAuth: React.FC<Props> = ({ mode }) => {
  const router = useRouter();

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

  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    
    // Send the token to your server
    fetch(`/api/${mode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential: idToken }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        router.push('/');
      } else {
        console.error('Authentication failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div id={mode === 'signin' ? "google-signin-button" : "google-signup-button"}></div>
  );
};

export default GoogleAuth;