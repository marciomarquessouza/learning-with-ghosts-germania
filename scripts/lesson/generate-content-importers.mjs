#!/usr/bin/env node
// scripts/generate-content-importers.mjs
//
// Scans src/server/lessons/content and generates typed dynamic imports.
//
// Usage:
//   node scripts/generate-content-importers.mjs

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

const CONTENT_DIR = path.join(rootDir, "src/server/lessons/content");
const OUTPUT_FILE = path.join(
  rootDir,
  "src/server/lessons/generated/contentImporters.ts",
);

const IMPORT_BASE = "../content";

const contentMap = {};

const isJson = (file) =>
  file.isFile() && path.extname(file.name).toLowerCase() === ".json";

const getDay = (value = "") => {
  const match = value.match(/^day_(\d+)$/);
  return match ? Number(match[1]) : null;
};

const setNestedValue = (target, keys, value) => {
  let current = target;

  for (const key of keys.slice(0, -1)) {
    current[key] ??= {};
    current = current[key];
  }

  current[keys.at(-1)] = value;
};

const getNestedValue = (target, keys) => {
  let current = target;

  for (const key of keys) {
    current = current?.[key];

    if (current === undefined) {
      return undefined;
    }
  }

  return current;
};

const normalizeImportPath = (value) => value.split(path.sep).join("/");

const createImportPath = (relativeDirectory, fileName) => {
  const directory = normalizeImportPath(relativeDirectory);

  return `${IMPORT_BASE}/${directory}/${fileName}`;
};

const getContentType = (segments, fileName) => {
  if (segments.includes("locales")) {
    return "locale";
  }

  return path.basename(fileName, ".json");
};

const addContent = ({
  lessonLanguage,
  level,
  day,
  type,
  fileName,
  importPath,
}) => {
  const keys = [lessonLanguage, level, day];

  const currentContent = getNestedValue(contentMap, keys) ?? {};

  if (type === "locale") {
    currentContent.locales ??= {};

    currentContent.locales[fileName] = importPath;
  } else if (type === "lesson" || type === "audio" || type === "dialogues") {
    currentContent[type] = importPath;
  } else {
    return;
  }

  setNestedValue(contentMap, keys, currentContent);
};

async function buildContentMap() {
  const files = await fs.readdir(CONTENT_DIR, {
    recursive: true,
    withFileTypes: true,
  });

  for (const file of files.filter(isJson)) {
    const directory = path.relative(CONTENT_DIR, file.parentPath);
    const segments = directory.split(path.sep);

    const lessonLanguage = segments[0];
    const level = segments[1];

    const daySegment = segments.find((segment) => /^day_\d+$/.test(segment));
    const day = getDay(daySegment);

    if (!lessonLanguage || !level || day === null) {
      continue;
    }

    const type = getContentType(segments, file.name);
    const fileName = path.basename(file.name, ".json");

    addContent({
      lessonLanguage,
      level,
      day,
      type,
      fileName,
      importPath: createImportPath(directory, file.name),
    });
  }
}

const formatImporter = (importPath) => `() => import("${importPath}")`;

const serializeContent = (value, indentation = 0) => {
  const indent = "  ".repeat(indentation);
  const childIndent = "  ".repeat(indentation + 1);

  if (typeof value === "string") {
    return formatImporter(value);
  }

  const entries = Object.entries(value);

  if (entries.length === 0) {
    return "{}";
  }

  const content = entries
    .map(([key, child]) => {
      const serialized = serializeContent(child, indentation + 1);

      return `${childIndent}${JSON.stringify(key)}: ${serialized}`;
    })
    .join(",\n");

  return `{\n${content},\n${indent}}`;
};

function createDocument() {
  const generatedContent = serializeContent(contentMap);

  return [
    'import { ContentImporters } from "@/server/types";',
    "",
    "// AUTO-GENERATED FILE. DO NOT EDIT.",
    "// Run: node scripts/generate-content-importers.mjs",
    "",
    `const generatedContentImporters = ${generatedContent} satisfies ContentImporters;`,
    "",
    "export const contentImporters: ContentImporters = generatedContentImporters;",
    "",
  ].join("\n");
}

async function main() {
  await buildContentMap();

  const document = createDocument();

  await fs.mkdir(path.dirname(OUTPUT_FILE), {
    recursive: true,
  });

  await fs.writeFile(OUTPUT_FILE, document, "utf8");

  console.log(`✔ Generated ${path.relative(rootDir, OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error("✖ Failed to generate contentImporters:", error);
  process.exit(1);
});
