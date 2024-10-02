import type { Metadata } from "next";
import { inter } from "./ui/fonts";
import "./ui/globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased box-border`}>{children}</body>
    </html>
  );
}
