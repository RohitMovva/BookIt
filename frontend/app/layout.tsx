import type { Metadata } from "next";
import { inter } from "./ui/fonts";
import "./ui/globals.css";
import AuthWrapper from "./ui/auth-wrapper";

export const metadata: Metadata = {
  title: "Bookit",
  description: "Shopping for course materials made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} box-border antialiased`}>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
