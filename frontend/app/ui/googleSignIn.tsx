"use client"; // This ensures the component runs on the client side

import { useEffect } from "react";

const GoogleSignIn = () => {
  // Define the callback function
  const test = (response: any) => {
    console.log("Google Sign-In Response:", response);
    // Handle the sign-in response here
  };

  useEffect(() => {
    // Ensure the function is attached to the window object
    (window as any).test = test; // Type assertion to avoid TypeScript errors

    // Load the Google API script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the global reference
    return () => {
      delete (window as any).test;
      document.body.removeChild(script); // Clean up the script on unmount
    };
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id="181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="test"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
};

export default GoogleSignIn;
