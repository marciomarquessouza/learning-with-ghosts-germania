import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Josefin_Sans,
  Russo_One,
  Special_Elite,
  UnifrakturMaguntia,
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
});

const russoOne = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-secondary",
});

const unifrakturMaguntia = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unifraktur",
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Learning With Ghosts",
  description:
    "Story-driven game that teaches you real German through tension, choices, and consequence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${geistSans.variable} ${josefinSans.variable} ${russoOne.variable} ${specialElite.variable} ${unifrakturMaguntia.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
