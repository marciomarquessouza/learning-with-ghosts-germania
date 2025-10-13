import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getEntries } from "./getWords";
import { slugify } from "@/utils/slugfy";
import { Command } from "commander";
import gtts from "node-gtts";

function readManifest(manifestPath: string): Record<string, string> {
  if (fs.existsSync(manifestPath)) {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }
  return {};
}

function writeManifest(manifestPath: string, manifest: Record<string, string>) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function versionedName(phrase: string) {
  const base = slugify(phrase);
  const h = crypto
    .createHash("sha1")
    .update(JSON.stringify({ phrase }))
    .digest("hex")
    .slice(0, 8);
  return `${base}.${h}.mp3`;
}

async function ensureAudio(
  entry: string,
  language: string,
  outDir: string
): Promise<string> {
  const tts = gtts(language);
  const filename = versionedName(entry);
  const outPath = path.join(outDir, filename);
  const publicPath = `audio/${language}/${filename}`;

  if (fs.existsSync(outPath)) {
    return publicPath;
  }

  return new Promise((resolve) => {
    tts.save(outPath, entry, () => {
      console.log(`File ${filename} created`);
      resolve(publicPath);
    });
  });
}

async function main() {
  const program = new Command();
  program
    .requiredOption(
      "-l, --language <language>",
      "audio language (de, en, es...)"
    )
    .requiredOption("-d, --day <language>", "Game Day (1, 2, 3...)")
    .parse(process.argv);
  const language = program.opts().language || "de";
  const day = program.opts().day;

  if (!day) {
    console.error(
      "Error: Language/Day is required. Use -l or --language to specify it."
    );
    process.exit(1);
  }
  
  const outDir = path.join(process.cwd(), "public", "audio", language);
  const manifestPath = path.join(
    process.cwd(),
    "public",
    "audio",
    "audio.manifest.json"
  );

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const entries = await getEntries(day);

  const manifest = readManifest(manifestPath);

  try {
    for (const entry of entries) {
      const key = `${language}:${entry}`;
      const publicPath = await ensureAudio(entry, language, outDir);
      manifest[key] = publicPath;
    }

    writeManifest(manifestPath, manifest);
    console.log(
      `✔ Manifest updated: ${path.relative(process.cwd(), manifestPath)}`
    );
  } catch (error) {
    throw error;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
