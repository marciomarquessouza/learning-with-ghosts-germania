import { Command } from "commander";
import { AudioProcessor } from "./AudioProcessor";
import { validateOptions } from "./helpers/validateOptions";

export interface ProgramOptions {
  language: string;
  day: string;
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("audio-generator")
    .description("Generate audio files for game entries")
    .requiredOption(
      "-l, --language <language>",
      "audio language (de, en, es...)"
    )
    .requiredOption("-d, --day <day>", "game day (1, 2, 3...)")
    .parse(process.argv);

  const options = program.opts() as Partial<ProgramOptions>;

  try {
    validateOptions(options);

    const processor = new AudioProcessor(options.language!, options.day!);
    await processor.processEntries();

    console.log("✅ Audio generation completed successfully!");
  } catch (error) {
    console.error(
      "❌ Audio generation failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
}
