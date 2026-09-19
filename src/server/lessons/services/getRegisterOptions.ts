import { ChallengeOptions } from "@/libs/lesson/types";
import { FileSystemDayContentSource } from "../day-content/adapters/FileSystemDayContentSource";

export function getRegisterOptions(): ChallengeOptions {
  const contentSource = new FileSystemDayContentSource();
  return contentSource.getChallengeOptions();
}
