#!/usr/bin/env node

const { decodeSourceMap } = require("../index");

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: sourcemap-decode <sourcemap-file> <column> [--line <line>]');
    console.error('Example: sourcemap-decode bundle.js.map 20 --line 7617');
    process.exit(1);
  }

  // Get the file path (first argument)
  const mapFilePath = args[0];

  // Find the --line flag and its value
  let line = 1;
  let column = null;
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--line' || args[i] === '-l') {
      if (i + 1 >= args.length) {
        console.error('Error: Line number is required after --line flag');
        process.exit(1);
      }
      const lineValue = args[i + 1];
      if (isNaN(lineValue)) {
        console.error('Error: Line number must be a valid number');
        process.exit(1);
      }
      line = parseInt(lineValue, 10);
      i++; // Skip the next argument since we've used it
    } else if (column === null) {
      // First non-flag argument after file path is the column
      const columnValue = args[i];
      if (isNaN(columnValue)) {
        console.error('Error: Column number must be a valid number');
        process.exit(1);
      }
      column = parseInt(columnValue, 10);
    }
  }

  // Validate arguments
  if (!mapFilePath) {
    console.error('Error: Sourcemap file path is required');
    process.exit(1);
  }

  if (column === null) {
    console.error('Error: Column number is required');
    process.exit(1);
  }

  try {
    const result = await decodeSourceMap(mapFilePath, column, line);
    console.log('Original position:', result);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
