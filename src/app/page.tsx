import { Footer } from "@/components/HomePage/Footer";
import { Navbar } from "@/components/HomePage/Navbar";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-primary bg-[#FAF5E4] text-black flex flex-col ">
      <Navbar />

      {/* Hero Section */}
      <main className="bg-red-600 text-white flex flex-1 items-center justify-center">
        <div className="flex-col justify-center items-center">
          <h1 className="my-6 text-center">Game in Development</h1>
          <Link
            href="/game"
            className="px-8 py-4 text-lg font-medium text-center text-white bg-black rounded-md"
          >
            LEARN/PLAY
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
