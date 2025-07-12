"use client";
import NavbarWrapper from "./components/navbar/NavbarWrapper";
import { AuthProvider } from "./context/AuthContext";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavbarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
