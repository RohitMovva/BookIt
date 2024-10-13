"use client";

import { useAuthStatus } from "../api/hooks/useAuthStatus";
import Hero from "./hero/hero-page";
import { usePathname, useRouter } from "next/navigation";
import HomeLayout from "./home/home-layout";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStatus();
  const pathname = usePathname();
  const router = useRouter();

  // Paths that need authentication and home layout
  const authNeeded = ["/", "/listings", "/saved", "/settings", "/profile"];
  const redirectNoAuth = ["/login", "/signup"];
  const homeLayout = ["/", "/listings", "/saved"];

  // Render loading, hero page, or home layout based on authentication
  if (authNeeded.includes(pathname) && isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (authNeeded.includes(pathname) && !isAuthenticated) {
    return <Hero />;
  }

  if (redirectNoAuth.includes(pathname)) {
    router.push("/");
    return;
  }

  return homeLayout.includes(pathname) ? (
    <HomeLayout>{children}</HomeLayout>
  ) : (
    <>{children}</>
  );
};

export default AuthWrapper;
