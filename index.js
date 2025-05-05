const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { SourceMapConsumer } = require("source-map");
const {
  InvalidInputError,
  SourceMapNotFoundError,
  InvalidSourceMapError,
  NetworkError,
  SourceMapError
} = require("./errors");

/**
 * Decodes a sourcemap file and maps a minified position to its original position.
 * @param {string} mapFilePath - Path to the sourcemap file (URL or local file).
 * @param {number} column - Column number in the minified file.
 * @param {number} [line=1] - Line number in the minified file (defaults to 1).
 * @returns {Promise<Object>} - The original position { source, line, column, name }.
 * @throws {InvalidInputError} - If the input parameters are invalid.
 * @throws {SourceMapNotFoundError} - If the sourcemap file cannot be found.
 * @throws {InvalidSourceMapError} - If the sourcemap content is invalid.
 * @throws {NetworkError} - If there's an error fetching the sourcemap from a URL.
 */
async function decodeSourceMap(mapFilePath, column, line = 1) {
  // Validate inputs
  if (!mapFilePath || typeof mapFilePath !== "string") {
    throw new InvalidInputError("The sourcemap file path must be a non-empty string");
  }
  if (!Number.isInteger(column) || column < 0) {
    throw new InvalidInputError(`Column number must be a non-negative integer, got: ${column}`);
  }
  if (!Number.isInteger(line) || line < 1) {
    throw new InvalidInputError(`Line number must be a positive integer, got: ${line}`);
  }

  // Append .js.map extension if no extension is provided
  let finalPath = mapFilePath;
  if (!path.extname(mapFilePath)) {
    finalPath = `${mapFilePath}.js.map`;
  }

  // Read the sourcemap file
  let mapFileContent;
  try {
    if (finalPath.startsWith("http://") || finalPath.startsWith("https://")) {
      // Fetch from URL
      const response = await fetch(finalPath);
      if (!response.ok) {
        throw new NetworkError(finalPath, response.status, response.statusText);
      }
      mapFileContent = await response.text();
    } else {
      // Read from local file
      if (!fs.existsSync(finalPath)) {
        throw new SourceMapNotFoundError(finalPath);
      }
      mapFileContent = fs.readFileSync(finalPath, "utf8");
    }
  } catch (error) {
    if (error instanceof SourceMapError) {
      throw error;
    }
    throw new SourceMapNotFoundError(finalPath);
  }

  // Validate sourcemap content
  if (!mapFileContent.trim()) {
    throw new InvalidSourceMapError("The sourcemap file is empty");
  }

  // Decode the sourcemap
  let smc;
  try {
    smc = await new SourceMapConsumer(mapFileContent);
    const originalPosition = smc.originalPositionFor({ line, column });

    // Validate the result
    if (!originalPosition.source) {
      throw new InvalidSourceMapError(`Could not find original position for line ${line}, column ${column}`);
    }

    return originalPosition;
  } catch (error) {
    if (error instanceof SourceMapError) {
      throw error;
    }
    throw new InvalidSourceMapError(error.message);
  } finally {
    if (smc && typeof smc.destroy === 'function') {
      smc.destroy();
    }
  }
}

// Export the function and error classes
module.exports = {
  decodeSourceMap,
  SourceMapError,
  SourceMapNotFoundError,
  InvalidSourceMapError,
  InvalidInputError,
  NetworkError
};
