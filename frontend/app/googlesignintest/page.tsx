"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Load the Google Sign-In script dynamically
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id="181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri="/home"
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
