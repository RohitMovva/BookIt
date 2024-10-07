"use client";

import { useEffect } from "react";

// Define the type for the Google Sign-In response
interface GoogleSignInResponse {
  credential: string; // or any other properties you expect
}

export default function Page() {
  useEffect(() => {
    // Create the Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Initialize the Google Sign-In after the script is loaded
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com",
          callback: (response: GoogleSignInResponse) => {
            // Handle the response here
            console.log("Sign-in response:", response);
          },
        });
      }
    };

    // Check if the google object is available after the script is loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Try initializing after a short delay
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeGoogleSignIn();
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id="181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
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
}
