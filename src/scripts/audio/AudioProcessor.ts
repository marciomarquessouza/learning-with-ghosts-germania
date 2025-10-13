import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import gtts from "node-gtts";
import { getEntries } from "./helpers/getWords";
import { slugify } from "@/utils/slugfy";
import { padDay } from "@/utils/padDay";
import { AudioManifest } from "@/types";

const CONFIG = {
  AUDIO_BASE_DIR: "public/audio",
  MANIFEST_BASE_DIR: "src/game/actions/actionOverridesPerDay",
  HASH_LENGTH: 8,
} as const;

export class AudioProcessor {
  constructor(private language: string, private day: string) {}

  private getManifestPath(): string {
    const dayString = `day_${padDay(this.day)}`;
    const manifestDir = path.join(
      process.cwd(),
      CONFIG.MANIFEST_BASE_DIR,
      dayString
    );
    return path.join(manifestDir, `${dayString}.audio.json`);
  }

  private getOutputDir(): string {
    const dayString = `day_${padDay(this.day)}`;
    return path.join(
      process.cwd(),
      CONFIG.AUDIO_BASE_DIR,
      this.language,
      dayString
    );
  }

  private async readManifest(manifestPath: string): Promise<AudioManifest> {
    try {
      const content = await fs.readFile(manifestPath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return {};
      }
      throw new Error(`Failed to read manifest: ${error}`);
    }
  }

  private async writeManifest(
    manifestPath: string,
    manifest: AudioManifest
  ): Promise<void> {
    const manifestDir = path.dirname(manifestPath);

    try {
      await fs.access(manifestDir);
    } catch {
      await fs.mkdir(manifestDir, { recursive: true });
    }

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  private generateVersionedName(phrase: string): string {
    const base = slugify(phrase);
    const hash = crypto
      .createHash("sha1")
      .update(JSON.stringify({ phrase }))
      .digest("hex")
      .slice(0, CONFIG.HASH_LENGTH);

    return `${base}.${hash}.mp3`;
  }

  private async ensureOutputDirectory(dir: string): Promise<void> {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async generateAudio(entry: string): Promise<string> {
    const tts = gtts(this.language);
    const filename = this.generateVersionedName(entry);
    const outDir = this.getOutputDir();
    const outPath = path.join(outDir, filename);
    const publicPath = `audio/${this.language}/${filename}`;

    try {
      await fs.access(outPath);
      return publicPath;
    } catch {}

    return new Promise((resolve, reject) => {
      tts.save(outPath, entry, (error) => {
        if (error) {
          reject(
            new Error(`Failed to generate audio for "${entry}": ${error}`)
          );
          return;
        }

        console.log(`✅ Audio file created: ${filename}`);
        resolve(publicPath);
      });
    });
  }

  async processEntries(): Promise<void> {
    const entries = await getEntries(this.day);
    const manifestPath = this.getManifestPath();
    const outputDir = this.getOutputDir();

    await this.ensureOutputDirectory(outputDir);

    const manifest = await this.readManifest(manifestPath);
    let processedCount = 0;
    let skippedCount = 0;

    console.log(
      `🎯 Processing ${entries.length} entries for day ${this.day} in ${this.language}`
    );

    for (const entry of entries) {
      if (manifest[entry.id]) {
        skippedCount++;
        continue;
      }

      try {
        const publicPath = await this.generateAudio(entry.target);
        manifest[entry.id] = {
          path: publicPath,
          target: entry.target,
        };
        processedCount++;
      } catch (error) {
        console.error(`❌ Failed to process "${entry}":`, error);
        throw error;
      }
    }

    await this.writeManifest(manifestPath, manifest);

    console.log(`
📊 Processing Summary:
   Total entries: ${entries.length}
   Processed: ${processedCount}
   Skipped: ${skippedCount}
   Manifest: ${path.relative(process.cwd(), manifestPath)}
    `);
  }
}
