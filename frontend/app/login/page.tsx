"use client";

import React from "react";
import GoogleAuth from "../ui/google-auth";

const LoginSignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome</h2>
        
        {/* Sign In Section */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700 mb-2 text-center">Sign In</h3>
          <div className="flex justify-center"><GoogleAuth mode="signin" /></div>
        </div>
        
        <hr className="my-4" />

        {/* Sign Up Section */}
        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-2 text-center">Sign Up</h3>
          <div className="flex justify-center"><GoogleAuth mode="signup" /></div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
