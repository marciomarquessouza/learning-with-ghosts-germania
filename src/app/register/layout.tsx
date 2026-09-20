import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "min-h-screen bg-[#0B0B0C] flex flex-col",
        "font-primary text-[#FFF3E4]",
      ].join(" ")}
    >
      <div className={["landscape-short:hidden"].join(" ")}>
        <Header />
      </div>

      <main
        className={[
          "flex-1 min-h-0 flex flex-col px-6 md:px-8",
          "landscape-short:mt-4",
        ].join(" ")}
      >
        {children}
      </main>

      <div className={["landscape-short:hidden"].join(" ")}>
        <Footer />
      </div>
    </div>
  );
}
