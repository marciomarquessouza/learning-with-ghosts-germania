import fs from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rootDir = process.cwd();
const actorGamePath = process.env.ACTOR_GAME_PATH ?? "src/game/actors";
const assetSourcesPath =
  process.env.ACTOR_DRAGONBONES_PATH ?? "asset-sources/dragonbones/actors";
const [actor] = process.argv.slice(2);

if (!actor) {
  console.error("ERROR: Missing actor");
  console.error("Usage: yarn sprite:init <actor>");
  process.exit(1);
}

const actorConfigDir = path.join(rootDir, actorGamePath, actor);

const actorAssetsDir = path.join(rootDir, assetSourcesPath, actor);

const outputPath = path.join(actorConfigDir, "spritesheet.yaml");

try {
  await fs.access(outputPath);
  console.error(`Config already exists: ${outputPath}`);
  process.exit(1);
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

async function calculateSpritesheetColumns(animationDir) {
  const entries = await fs.readdir(animationDir, {
    withFileTypes: true,
  });

  const frameCount = entries.filter(
    (entry) =>
      entry.isFile() && path.extname(entry.name).toLowerCase() === ".png",
  ).length;

  if (frameCount === 0) {
    throw new Error(`No PNG frames found in: ${animationDir}`);
  }

  return Math.ceil(Math.sqrt(frameCount));
}

const entries = await fs.readdir(actorAssetsDir, {
  withFileTypes: true,
});

const animations = entries
  .filter((entry) => entry.isDirectory() && entry.name !== "library")
  .map((entry) => entry.name);

const readline = createInterface({
  input,
  output,
});

const columns = await readline.question("Default Columns [3]: ");
const scale = await readline.question("Scale [1]: ");
const flipX = await readline.question("FlipX [y/N]: ");

readline.close();

const defaultConfigs = {
  columns: Number(columns || 3),
  scale: Number(scale || 1),
  flipX: flipX.trim().toLowerCase() === "y",
};

const configs = new Map();

for (const animation of animations) {
  const animationDir = path.join(actorAssetsDir, animation);
  const columns = await calculateSpritesheetColumns(animationDir);
  const columnsRow =
    columns === defaultConfigs.columns
      ? `#    columns: ${defaultConfigs.columns}`
      : `     columns: ${columns}`;

  configs.set(
    animation,
    `   ${animation}:
${columnsRow}
#    scale: ${defaultConfigs.scale}
#    flipX: ${defaultConfigs.flipX}`,
  );
}

const yaml = `actor: ${actor}

defaults:
  columns: ${defaultConfigs.columns}
  scale: ${defaultConfigs.scale}
  flipX: ${defaultConfigs.flipX}

animations:
${animations.map((animation) => `  - ${animation}`).join("\n")}

configs:
${animations.map((animation) => configs.get(animation)).join("\n\n")}
`;

await fs.mkdir(actorConfigDir, {
  recursive: true,
});

await fs.writeFile(outputPath, yaml, "utf-8");

console.log(`✅ The default spritesheet was created ${outputPath}`);
