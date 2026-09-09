import fs from "node:fs";
import fsAsync from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

const rootDir = process.cwd();

const actorGamePath = process.env.ACTOR_GAME_PATH ?? "src/game/actors";

const assetSourcesPath =
  process.env.ACTOR_DRAGONBONES_PATH ?? "asset-sources/dragonbones/actors";

const [actor] = process.argv.slice(2);

if (!actor) {
  console.error("ERROR: Missing actor");
  console.error("Usage: yarn sprite:update <actor>");
  process.exit(1);
}

const actorConfigDir = path.join(rootDir, actorGamePath, actor);

const actorAssetsDir = path.join(rootDir, assetSourcesPath, actor);

const outputPath = path.join(actorConfigDir, "spritesheet.yaml");

function loadActorConfig() {
  if (!fs.existsSync(outputPath)) {
    console.error(`Config not found: ${outputPath}`);
    console.error(`Run "yarn sprite:init ${actor}" first.`);
    process.exit(1);
  }

  return YAML.parse(fs.readFileSync(outputPath, "utf8"));
}

async function calculateSpritesheetColumns(animationDir) {
  const entries = await fsAsync.readdir(animationDir, {
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

function getColumnsRow(animation, calculatedColumns) {
  const currentColumns = currentConfigs[animation]?.columns;

  if (currentColumns !== undefined) {
    return `     columns: ${currentColumns}`;
  }

  return calculatedColumns === defaultConfigs.columns
    ? `#    columns: ${defaultConfigs.columns}`
    : `     columns: ${calculatedColumns}`;
}

function getScaleRow(animation) {
  const currentScale = currentConfigs[animation]?.scale;

  return currentScale !== undefined
    ? `     scale: ${currentScale}`
    : `#    scale: ${defaultConfigs.scale}`;
}

function getFlipXRow(animation) {
  const currentFlipX = currentConfigs[animation]?.flipX;

  return currentFlipX !== undefined
    ? `     flipX: ${currentFlipX}`
    : `#    flipX: ${defaultConfigs.flipX}`;
}

const actorConfig = loadActorConfig();

const defaultConfigs = actorConfig.defaults ?? {};

const currentConfigs = actorConfig.configs ?? {};

const entries = await fsAsync.readdir(actorAssetsDir, {
  withFileTypes: true,
});

const animations = entries
  .filter((entry) => entry.isDirectory() && entry.name !== "library")
  .map((entry) => entry.name)
  .sort();

const configs = new Map();

for (const animation of animations) {
  const animationDir = path.join(actorAssetsDir, animation);

  const columns = await calculateSpritesheetColumns(animationDir);

  const columnsRow = getColumnsRow(animation, columns);

  const scaleRow = getScaleRow(animation);

  const flipXRow = getFlipXRow(animation);

  configs.set(
    animation,
    `   ${animation}:
${columnsRow}
${scaleRow}
${flipXRow}`,
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

await fsAsync.mkdir(actorConfigDir, {
  recursive: true,
});

await fsAsync.writeFile(outputPath, yaml, "utf-8");

console.log(`✅ The spritesheet config was updated: ${outputPath}`);
