import { Jailer } from "./Jailer";
import { JailerPortrait } from "./portraitView/JailerPortraitView";

export function createJailerPortrait(): Jailer {
  return new JailerPortrait();
}
