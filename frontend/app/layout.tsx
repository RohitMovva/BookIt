import type { Metadata } from "next";
import { inter } from "./ui/fonts";
import "./ui/globals.css";

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
        {children}
      </body>
    </html>
  );
}
