import React, { useEffect, useState } from "react";
import axios from "axios";

interface GoogleSignInResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  picture: string;
}

const GoogleLogin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialResponse = async (response: GoogleSignInResponse) => {
    console.log("Google Sign-In Response:", response);
    try {
      const loginResponse = await axios.post("http://127.0.0.1:5000/login", {
        credential: response.credential
      }); 
      setUser(loginResponse.data.user);
      setError(null);
    } catch (error) {
      console.error("Login error:", error);
      setError("Error during login. Please try again.");
    }
  };

  useEffect(() => {
    (window as any).handleCredentialResponse = handleCredentialResponse;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      delete (window as any).handleCredentialResponse;
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h2>Login</h2>
      {!user && (
        <div
          id="g_id_onload"
          data-client_id="181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleCredentialResponse"
          data-auto_prompt="false"
        ></div>
      )}
      {!user && (
        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      )}

      {user && (
        <div>
          <h3>Welcome, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          {user.picture && <img src={user.picture} alt={user.name} />}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GoogleLogin;
