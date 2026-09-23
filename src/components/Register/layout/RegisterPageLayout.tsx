"use client";
import { PropsWithChildren } from "react";
import { FooterNavigation } from "../components/FooterNavigation";
import { PageTransition } from "@/components/PageTransition";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition/usePageTransition";

interface RegisterPageLayoutProps extends PropsWithChildren {
  disabled?: boolean;
}

export function RegisterPageLayout({
  children,
  disabled,
}: RegisterPageLayoutProps) {
  const router = useRouter();
  const { nextPath, setNextPath, isTransitioning } = usePageTransition();

  return (
    <>
      <PageTransition
        active={nextPath !== null}
        onComplete={() => {
          if (nextPath) {
            router.push(nextPath);
          }
        }}
      />
      <main
        className={[
          "flex w-full flex-col px-6 pt-2 md:pt-16 md:px-16",
          "landscape-short:pt-0",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[872px]">
          {children}
          <FooterNavigation
            disabled={isTransitioning || disabled}
            onNavigate={(path) => setNextPath(path)}
          />
        </div>
      </main>
    </>
  );
}
