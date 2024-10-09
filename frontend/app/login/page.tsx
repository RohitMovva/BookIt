'use client'
import GoogleAuth from "../ui/googleAuth";

export default function Page() {
    return (
      <div className="grid place-content-center h-screen">
        <p>login page</p>
        <GoogleAuth mode="signin" />
        <GoogleAuth mode="signup" />
      </div>
    );
}