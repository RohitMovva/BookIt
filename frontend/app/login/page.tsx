'use client'

import React from 'react';
import GoogleAuth from '../components/GoogleAuth';

const LoginSignupPage: React.FC = () => {
  return (
    <div className="grid place-content-center h-screen">
      <h2>Sign In</h2>
      <GoogleAuth mode="signin" />
      <h2>Sign Up</h2>
      <GoogleAuth mode="signup" />
    </div>
  );
};

export default LoginSignupPage;
