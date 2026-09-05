import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const [actor] = process.argv.slice(2);

if (!actor) {
  console.error("Usage: yarn sprite:default-config <actor>");
  process.exit(1);
}

const actorDir = path.join(
  rootDir,
  "asset-sources",
  "dragonbones",
  "actors",
  actor,
);

const outputPath = path.join(actorDir, "spritesheet.yaml");

try {
  await fs.access(outputPath);
  console.error(`Config already exist ${outputPath}`);
  process.exit(1);
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const entries = await fs.readdir(actorDir, {
  withFileTypes: true,
});

const animations = entries
  .filter((entry) => entry.isDirectory() && entry.name !== "library")
  .map((entry) => entry.name);

const yaml = `actor: ${actor}

defaults:
  columns: 6
  scale: 1

animations:
${animations.map((animation) => `  - ${animation}`).join("\n")}

# configs:
${animations
  .map(
    (animation) => `#   ${animation}:
#     columns: 6
#     scale: 1
#     flipX: false`,
  )
  .join("\n\n")}
`;

await fs.writeFile(outputPath, yaml, "utf-8");

console.log(`✅ The default spritesheet was created ${outputPath}`);
