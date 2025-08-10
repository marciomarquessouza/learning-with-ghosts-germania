import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";
enum DIMENSIONS {
  TABLET_WITH = 1026,
  MOBILE_WITH = 640,
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < DIMENSIONS.MOBILE_WITH) return "mobile";
    if (width < DIMENSIONS.TABLET_WITH) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < DIMENSIONS.MOBILE_WITH) setDeviceType("mobile");
      else if (width < DIMENSIONS.TABLET_WITH) setDeviceType("tablet");
      else setDeviceType("desktop");
    };

    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  return deviceType;
}
