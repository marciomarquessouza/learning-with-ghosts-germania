import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function printUsage() {
  console.log(
    `
Usage:
  npm run sprite -- <actor> <animation> [options]

Example:
  npm run sprite -- eliza idle
  npm run sprite -- eliza idle --columns 4 --scale 0.8
  npm run sprite -- eliza talk --count 12

Options:
  --columns <number>  Number of columns in the spritesheet
  --scale <number>    Scale factor for frames
  --count <number>    Limit number of frames
  --python <string>   Python executable (default: python3)
`.trim(),
  );
}

function parseArgs(argv) {
  const positional = [];
  const options = {
    columns: undefined,
    scale: undefined,
    count: undefined,
    python: "python3",
    flipX: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }

    switch (arg) {
      case "--columns":
        options.columns = argv[i + 1];
        i += 1;
        break;
      case "--scale":
        options.scale = argv[i + 1];
        i += 1;
        break;
      case "--count":
        options.count = argv[i + 1];
        i += 1;
        break;
      case "--python":
        options.python = argv[i + 1];
        i += 1;
        break;
      case "--flip-x":
        options.flipX = true;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      default:
        console.error(`Unknown option: ${arg}`);
        printUsage();
        process.exit(1);
    }
  }

  return { positional, options };
}

function ensureValue(optionName, value) {
  if (!value || value.startsWith("--")) {
    console.error(`Missing value for ${optionName}`);
    process.exit(1);
  }

  return value;
}

function validateNumberOption(label, value, parser = Number) {
  if (value === undefined) return;

  const parsed = parser(value);

  if (Number.isNaN(parsed)) {
    console.error(`Invalid ${label}: ${value}`);
    process.exit(1);
  }
}

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

const argv = process.argv.slice(2);
const { positional, options } = parseArgs(argv);

const actor = positional[0];
const animation = positional[1];

if (!actor || !animation) {
  console.error("You must provide <actor> and <animation>.");
  printUsage();
  process.exit(1);
}

if (options.columns !== undefined) {
  options.columns = ensureValue("--columns", options.columns);
  validateNumberOption("columns", options.columns, Number.parseInt);
}

if (options.scale !== undefined) {
  options.scale = ensureValue("--scale", options.scale);
  validateNumberOption("scale", options.scale, Number.parseFloat);
}

if (options.count !== undefined) {
  options.count = ensureValue("--count", options.count);
  validateNumberOption("count", options.count, Number.parseInt);
}

if (options.python !== undefined) {
  options.python = ensureValue("--python", options.python);
}

const rootDir = process.cwd();
const basename = `${actor}_${animation}`;

const inputDir = path.join(
  rootDir,
  "asset-sources",
  "dragonbones",
  "actors",
  actor,
  animation,
);

const outputDir = path.join(rootDir, "public", "actors", actor, animation);

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

if (!fs.existsSync(pythonScriptPath)) {
  console.error(`Python script not found: ${pythonScriptPath}`);
  process.exit(1);
}

if (!fs.existsSync(updateConstantsScriptPath)) {
  console.error(
    `Constants update script not found: ${updateConstantsScriptPath}`,
  );
  process.exit(1);
}

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
  pythonArgs.push("--columns", options.columns);
}

if (options.scale !== undefined) {
  pythonArgs.push("--scale", options.scale);
}

if (options.count !== undefined) {
  pythonArgs.push("--count", options.count);
}

if (options.flipX) {
  pythonArgs.push("--flip-x");
}

console.log(`\nGenerating spritesheet for ${actor}/${animation}`);
console.log(`Basename: ${basename}`);
console.log(`Input: ${inputDir}`);
console.log(`Output: ${outputDir}\n`);

runCommand(options.python, pythonArgs);

console.log("\nSpritesheet generated successfully.");
console.log("Updating spritesheets constants...\n");

runCommand("node", [updateConstantsScriptPath]);

console.log("\nDone.\n");
