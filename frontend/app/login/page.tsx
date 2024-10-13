"use client";

import React from "react";
import GoogleAuth from "../ui/google-auth";

const LoginSignupPage: React.FC = () => {
  return (
    <div className="grid h-screen place-content-center">
      <h2>Sign In</h2>
      <GoogleAuth mode="signin" />
      <h2>Sign Up</h2>
      <GoogleAuth mode="signup" />
    </div>
  );
};

export default LoginSignupPage;
