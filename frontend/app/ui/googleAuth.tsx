import React, { useEffect, useState } from "react";
import axios from "axios";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface Props {
  mode: "signin" | "signup";
}

const GoogleAuth: React.FC<Props> = ({ mode }) => {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);

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
      const userResponse = await axios.post(`http://127.0.0.1:5000/${mode}`, {
        credential: idToken,
      });
      if (mode === "signin") {
        console.log("Sign-in successful:", userResponse.data);
        // Handle successful sign-in (e.g., update app state, redirect)
      } else {
        setGoogleUser(userResponse.data.user);
        setShowUsernameForm(true);
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      setError(`Error during ${mode}. Please try again.`);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) {
      setError("Please sign in with Google first");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/complete-signup",
        {
          google_id: googleUser.sub, // Use google_id instead of sub
          username: username,
        },
      );
      console.log("Signup successful:", response.data);
      // Handle successful signup (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Signup error:", error);
      setError("Error during signup. Please try again.");
    }
  };

  return (
    <div>
      {!showUsernameForm && (
        <div
          id={
            mode === "signin" ? "google-signin-button" : "google-signup-button"
          }
        ></div>
      )}

      {mode === "signup" && showUsernameForm && (
        <form onSubmit={handleSignUp}>
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

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GoogleAuth;
