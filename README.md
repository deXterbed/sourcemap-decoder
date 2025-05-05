# js-sourcemap-decoder

A Node.js package to decode sourcemaps and map minified positions to their original positions. This tool helps you trace back minified JavaScript code to its original source code using source maps.

## Features

- Decode sourcemaps from local files or URLs
- Map minified line and column numbers to original source positions
- Command-line interface for easy usage
- Support for both programmatic and CLI usage

## Installation

```bash
npm install js-sourcemap-decoder
```

## Usage

### Command Line Interface

```bash
# Basic usage
sourcemap-decode <mapFilePath> <column> [options]

# Example with local file
sourcemap-decode .next/static/chunks/pages/_app.js.map 352368 --line 1

# Example with URL
sourcemap-decode https://example.com/static/js/main.js.map 100 --line 5

# Options
# -l, --line <number>  Line number in the minified file (optional, defaults to 1)
# Note: Column number is required, while line number is optional
```

### Programmatic Usage

```javascript
const decodeSourceMap = require('js-sourcemap-decoder');

// Decode from a local file
async function decodeFromFile() {
  try {
    const position = await decodeSourceMap(
      '.next/static/chunks/pages/_app.js.map',
      352368,  // column number
      1        // line number (optional, defaults to 1)
    );
    console.log(position);
  } catch (error) {
    console.error(error.message);
  }
}

// Decode from a URL
async function decodeFromUrl() {
  try {
    const position = await decodeSourceMap(
      'https://example.com/sourcemap.map',
      10,  // column number
      20   // line number
    );
    console.log(position);
  } catch (error) {
    console.error(error.message);
  }
}
```

## API

### `decodeSourceMap(mapFilePath, column, line = 1)`

- `mapFilePath` (string): Path to the sourcemap file (URL or local file)
- `column` (number): Column number in the minified file (required)
- `line` (number): Line number in the minified file (optional, defaults to 1)

Returns a Promise that resolves to an object containing:
- `source`: Original source file path
- `line`: Original line number
- `column`: Original column number
- `name`: Original identifier name (if available)

## Error Handling

The package provides specific error types for better error handling:

- `InvalidInputError`: When input parameters are invalid
- `SourceMapNotFoundError`: When the sourcemap file cannot be found
- `InvalidSourceMapError`: When the sourcemap content is invalid
- `NetworkError`: When there's an error fetching the sourcemap from a URL

Example error handling:

```javascript
const { InvalidInputError, NetworkError } = require('js-sourcemap-decoder');

try {
  const position = await decodeSourceMap(mapPath, column, line);
} catch (error) {
  if (error instanceof InvalidInputError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

## Development

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/deXterbed/sourcemap-decoder.git
cd sourcemap-decoder
```

2. Install dependencies:
```bash
npm install
```

3. Link the package locally:
```bash
npm link
```

### Running Tests

The package includes a test suite that verifies:
- Basic sourcemap decoding
- Error handling
- URL and local file handling
- Input validation

To run the tests:
```bash
npm test
```

## Requirements

- Node.js v14 or higher
- Internet access if fetching sourcemaps from URLs

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


