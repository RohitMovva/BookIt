"use client";

import { useRouter } from "next/navigation";
import { signout } from "../lib/actions";
import Button from "../ui/button";
import { useCallback } from "react"; // Import useCallback

export default function Page() {
  const router = useRouter();

  const handleSignout = useCallback(async () => {
    const result = await signout();
    if ("error" in result) {
      console.error(result.error);
      // Optionally, show the error to the user
    } else {
      console.log(result.message); // E.g., "Signout successful"
      router.push("/login"); // Redirect to the login page
    }
  }, [router]); // Include router in the dependency array

  return <Button text="Sign out" onClick={handleSignout} />;
}
