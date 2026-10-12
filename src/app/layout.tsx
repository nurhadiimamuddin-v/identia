import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Identia - Home",
  description: "Identification Environment for Telkom Internal Access",
  icons: {
    icon: "/images/my.png",
    shortcut: "/images/my.png",
    apple: "/images/my.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/my.png" />
        <link rel="shortcut icon" href="/images/my.png" />
        <link rel="apple-touch-icon" href="/images/my.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
