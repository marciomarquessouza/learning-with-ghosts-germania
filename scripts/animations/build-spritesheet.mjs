import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function loadActorConfig(actorDir) {
  const configPath = path.join(actorDir, "spritesheet.yaml");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Spritesheet config not found: ${configPath}`);
  }

  return YAML.parse(fs.readFileSync(configPath, "utf8"));
}

const [actor, requestedAnimation] = process.argv.slice(2);

if (requestedAnimation && !animations.includes(requestedAnimation)) {
  console.error(
    `Animation "${requestedAnimation}" is not configured for actor "${actor}".`,
  );
  process.exit(1);
}

if (!actor) {
  console.error("Usage: yarn sprite <actor> [animation]");
  process.exit(1);
}

const rootDir = process.cwd();

const actorDir = path.join(
  rootDir,
  "asset-sources",
  "dragonbones",
  "actors",
  actor,
);

const pythonScriptPath = path.join(
  rootDir,
  "scripts",
  "animations",
  "build_spritesheet.py",
);

const updateConstantsScriptPath = path.join(
  rootDir,
  "scripts",
  "animations",
  "update-spritesheets-constants.mjs",
);

const actorConfig = loadActorConfig(actorDir);

const defaults = actorConfig.defaults ?? {};
const animations = actorConfig.animations ?? [];
const configs = actorConfig.configs ?? {};

const animationNames = requestedAnimation ? [requestedAnimation] : animations;

for (const animation of animationNames) {
  const animationConfig = configs[animation] ?? {};

  const options = {
    ...defaults,
    ...animationConfig,
  };

  const basename = `${actor}_${animation}`;

  const inputDir = path.join(actorDir, animation);

  const outputDir = path.join(rootDir, "public", "actors", actor, animation);

  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`);
    process.exit(1);
  }

  const pythonArgs = [
    pythonScriptPath,
    basename,
    "--input-dir",
    inputDir,
    "--output-dir",
    outputDir,
  ];

  if (options.columns !== undefined) {
    pythonArgs.push("--columns", String(options.columns));
  }

  if (options.scale !== undefined) {
    pythonArgs.push("--scale", String(options.scale));
  }

  if (options.count !== undefined) {
    pythonArgs.push("--count", String(options.count));
  }

  if (options.flipX) {
    pythonArgs.push("--flip-x");
  }

  console.log(`\nGenerating ${actor}/${animation}`);

  runCommand("python3", pythonArgs);
}

console.log("\nUpdating spritesheet constants...");

runCommand("node", [updateConstantsScriptPath]);

console.log("\nDone.");
