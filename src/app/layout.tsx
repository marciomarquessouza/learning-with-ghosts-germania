import type { Metadata } from "next";
import {
  geistSans,
  geistMono,
  josefinSans,
  russoOne,
  specialElite,
  unifrakturMaguntia,
  staatliches,
} from "./fonts";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
        className={`${geistMono.variable} ${geistSans.variable} ${josefinSans.variable} ${russoOne.variable} ${specialElite.variable} ${unifrakturMaguntia.variable} ${staatliches.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
