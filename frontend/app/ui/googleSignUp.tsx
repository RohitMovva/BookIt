import React, { useEffect, useState } from "react";
import axios from "axios";

interface GoogleSignInResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface Props {
  buttonId: string;
}

const GoogleSignUp: React.FC<Props> = ({ buttonId }) => {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [credential, setCredential] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUpResponse = (response: GoogleSignInResponse) => {
    console.log("Google Sign-In Response:", response);
    const decodedToken: GoogleUser = JSON.parse(atob(response.credential.split('.')[1]));
    setGoogleUser(decodedToken);
    setCredential(response.credential);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser || !credential) {
      setError("Please sign in with Google first");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/signup", {
        credential: credential,
        username: username
      });
      console.log("Signup successful:", response.data);
      // Handle successful signup (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Signup error:", error);
      setError("Error during signup. Please try again.");
    }
  };

  useEffect(() => {
    const callbackName = `handle${buttonId}Response`;
    (window as any)[callbackName] = handleSignUpResponse;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
    };
  }, [buttonId]);

  return (
    <div>
      <h2>Sign Up</h2>
      <div
        id={`${buttonId}_onload`}
        data-client_id="181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"
        data-context="signup"
        data-ux_mode="popup"
        data-callback={`handle${buttonId}Response`}
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signup_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>

      {googleUser && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit">Complete Signup</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GoogleSignUp;