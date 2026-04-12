import { Jailer } from "./Jailer";
import { JailerPortraitView } from "./portraitView/JailerPortraitView";

export function createJailerPortrait(): Jailer {
  return new JailerPortraitView();
}
