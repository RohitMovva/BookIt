"use client";

import { useAuthStatus } from "../api/hooks/useAuthStatus";
import Hero from "./hero/hero-page";
import { usePathname } from "next/navigation";
import HomeLayout from "./home/home-layout";
import router from "next/router";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  console.log("Going to check auth status");
  const { isAuthenticated } = useAuthStatus();
  const pathname = usePathname();

  // Paths that need authentication and home layout
  const authNeeded = ["/", "/listings", "/saved"];
  const homeLayout = ["/", "/listings", "/saved"];

  console.log(isAuthenticated);

  // Render loading, hero page, or home layout based on authentication
  if (isAuthenticated === null) {
    return;
  }

  if (!isAuthenticated && pathname === "/") {
    return <Hero />;
  }

  if (authNeeded.includes(pathname) && !isAuthenticated) {
    router.push("/login");
    return;
  }

  return homeLayout.includes(pathname) ? (
    <HomeLayout>{children}</HomeLayout>
  ) : (
    <>{children}</>
  );
};

export default AuthWrapper;