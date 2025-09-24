import type React from "react";
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

// const geistSans = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// })

// const geistMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-geist-mono",
// })

export const metadata: Metadata = {
  title: "Ntion clone",
  description: "Created with hasnain",
  generator: "notion.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` antialiased`}>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
