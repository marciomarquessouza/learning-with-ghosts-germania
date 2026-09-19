import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-black text-center py-4 text-sm sm:text-base">
      <p className="text-white">
        <span className="font-bold">Created by:</span>{" "}
        <Link
          href="https://www.linkedin.com/in/marcio-marques-de-souza-1618ab33/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
        >
          Marcio Marques de Souza
        </Link>
      </p>
    </footer>
  );
}
