"use client";

import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NativeAppRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      router.replace("/mobile");
    }
  }, [router]);

  return null;
}
