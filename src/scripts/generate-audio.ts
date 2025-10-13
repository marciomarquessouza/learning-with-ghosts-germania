import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getEntries } from "./getWords";
import { slugify } from "@/utils/slugfy";
import gtts from "node-gtts";

/** Configs */
const LANG_CODE = "de";
const OUT_DIR = path.join(process.cwd(), "public", "audio", LANG_CODE);
const MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "audio",
  "audio.manifest.json"
);
const tts = gtts(LANG_CODE);

// ===== > DAY < =====
const DAY = 1;
// ===== > DAY < =====

function readManifest(): Record<string, string> {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  }
  return {};
}

function writeManifest(manifest: Record<string, string>) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
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

async function ensureAudio(entry: string): Promise<string> {
  const filename = versionedName(entry);
  const outPath = path.join(OUT_DIR, filename);
  const publicPath = `audio/${LANG_CODE}/${filename}`;

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
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const entries = await getEntries(DAY);

  const manifest = readManifest();

  try {
    for (const entry of entries) {
      const key = `${LANG_CODE}:${entry}`;
      const publicPath = await ensureAudio(entry);
      manifest[key] = publicPath;
    }

    writeManifest(manifest);
    console.log(
      `✔ Manifest updated: ${path.relative(process.cwd(), MANIFEST_PATH)}`
    );
  } catch (error) {
    throw error;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
