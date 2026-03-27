import {
  Geist,
  Geist_Mono,
  Josefin_Sans,
  Russo_One,
  Special_Elite,
  UnifrakturMaguntia,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
});

export const russoOne = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-secondary",
});

export const unifrakturMaguntia = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unifraktur",
});

export const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin", "latin-ext"],
});
