"use client";

import { Metadata } from "next";
import NavbarWrapper from "../components/navbar/NavbarWrapper";
import { AuthProvider } from "./context/AuthContext";

import "./globals.css";

const metadata: Metadata = {
  title: "ZenCycle",
  description: "Your ZenCycle application",
  icons: {
    icon: "/images/tabLogo.png", // or '/logo.png' - whatever your logo file is named
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ZenCycle</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* You can also use your logo as favicon */}
        <link rel="icon" href="/images/tabLogo.png" type="image/png" />
      </head>
      <body>
        <AuthProvider>
          <NavbarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
