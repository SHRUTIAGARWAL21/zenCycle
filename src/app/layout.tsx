import "./globals.css";

export const metadata = {
  title: "My Landing Page",
  description: "This is my custom landing page in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
