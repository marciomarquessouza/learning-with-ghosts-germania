import { DeviceType } from "@/hooks/useDeviceType";

export const getDialogueDimension = (device: DeviceType) => {
  switch (device) {
    case "desktop":
      return { heightClass: "h-[180px]", widthClass: "w-6/12" };
    case "tablet":
      return { heightClass: "h-[180px]", widthClass: "w-8/12" };
    case "mobile":
    default:
      return { heightClass: "h-[60px]", widthClass: "w-full" };
  }
};
