#!/usr/bin/env node

const { decodeSourceMap } = require("../index");

async function main() {
  const args = process.argv.slice(2);

  // Check for --line flag
  const lineIndex = args.findIndex((arg) => arg === "--line");
  let line = 1;
  let column;
  let mapFilePath;

  if (lineIndex !== -1) {
    // Using --line flag format
    if (lineIndex + 1 >= args.length) {
      console.error("Error: --line flag requires a value");
      process.exit(1);
    }
    const lineValue = args[lineIndex + 1];
    if (isNaN(lineValue)) {
      console.error("Error: Line number must be a valid number");
      process.exit(1);
    }
    line = parseInt(lineValue, 10);
    // Remove the --line flag and its value from args
    args.splice(lineIndex, 2);
  }

  // Now process the remaining arguments
  [mapFilePath, column] = args;

  if (!mapFilePath) {
    console.error("Error: Sourcemap file path is required");
    process.exit(1);
  }

  if (!column || isNaN(column)) {
    console.error("Error: Column number is required and must be a number");
    process.exit(1);
  }

  try {
    const result = await decodeSourceMap(
      mapFilePath,
      parseInt(column, 10),
      line
    );
    console.log("Original position:", result);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
