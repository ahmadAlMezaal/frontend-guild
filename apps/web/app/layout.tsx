import type { Metadata } from "next";
import localFont from "next/font/local";
import { PrefetchCrossZoneLinks } from "@vercel/microfrontends/next/client";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Web · learn-mfes",
  description: "Default microfrontend — serves every path not claimed by another app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <PrefetchCrossZoneLinks />
      </body>
    </html>
  );
}
