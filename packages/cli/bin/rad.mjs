#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = pathToFileURL(path.join(DIR, "../src/index.ts")).href;

await tsImport(ENTRY, import.meta.url);
