import { ProgramOptions } from "../generate-audio";

export function validateOptions(
  options: Partial<ProgramOptions>
): options is ProgramOptions {
  if (!options.day) {
    throw new Error("Day is required. Use -d or --day to specify it.");
  }

  if (!options.language) {
    throw new Error(
      "Language is required. Use -l or --language to specify it."
    );
  }

  const dayNumber = parseInt(options.day);
  if (isNaN(dayNumber) || dayNumber < 1) {
    throw new Error("Day must be a positive number.");
  }

  return true;
}
