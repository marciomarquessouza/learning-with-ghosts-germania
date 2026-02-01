import { Footer } from "@/components/HomePage/Footer";
import { Navbar } from "@/components/HomePage/Navbar";

export default function HomeGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-primary bg-[#FAF5E4] text-black flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-0 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
