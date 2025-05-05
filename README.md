# js-sourcemap-decoder

A Node.js package to decode sourcemaps and map minified positions to their original positions. This tool helps you trace back minified JavaScript code to its original source code using source maps.

## Features

- Decode sourcemaps from local files or URLs
- Map minified line and column numbers to original source positions
- Command-line interface for easy usage
- Support for both programmatic and CLI usage

## Installation

You can install the package in three ways:

1. **Global Installation** (recommended for frequent use):
   ```bash
   npm install -g js-sourcemap-decoder
   ```

2. **Local Installation** (for use in a specific project):
   ```bash
   npm install js-sourcemap-decoder
   ```

3. **Using npx** (for one-time use without installation):
   ```bash
   npx sourcemap-decode <sourcemap-file> <column> [--line <line>]
   ```

## Usage

### Command Line Interface

The package provides a CLI command `sourcemap-decode` that can be used in three ways:

1. **With global installation**:
   ```bash
   sourcemap-decode <sourcemap-file> <column> [--line <line>]
   ```

2. **With local installation**:
   ```bash
   npx sourcemap-decode <sourcemap-file> <column> [--line <line>]
   ```

3. **With npx** (no installation required):
   ```bash
   npx sourcemap-decode <sourcemap-file> <column> [--line <line>]
   ```

### Examples

1. Using default line number (1):
   ```bash
   sourcemap-decode bundle.js.map 20
   ```

2. Specifying line number:
   ```bash
   sourcemap-decode bundle.js.map 20 --line 7617
   # or using short flag
   sourcemap-decode bundle.js.map 20 -l 7617
   ```

3. Using a URL:
   ```bash
   sourcemap-decode https://example.com/bundle.js.map 20 --line 7617
   ```

### Programmatic Usage

```javascript
const { decodeSourceMap } = require('js-sourcemap-decoder');

async function main() {
  try {
    const result = await decodeSourceMap('bundle.js.map', 20, 7617);
    console.log('Original position:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
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

The package throws specific error types for different scenarios:

- `InvalidInputError`: When input parameters are invalid
- `SourceMapNotFoundError`: When the sourcemap file cannot be found
- `InvalidSourceMapError`: When the sourcemap content is invalid
- `NetworkError`: When there's an error fetching the sourcemap from a URL

Example error handling:

```javascript
const {
  decodeSourceMap,
  InvalidInputError,
  SourceMapNotFoundError,
  InvalidSourceMapError,
  NetworkError
} = require('js-sourcemap-decoder');

async function main() {
  try {
    const result = await decodeSourceMap('bundle.js.map', 20, 7617);
    console.log('Original position:', result);
  } catch (error) {
    if (error instanceof InvalidInputError) {
      console.error('Invalid input:', error.message);
    } else if (error instanceof SourceMapNotFoundError) {
      console.error('Sourcemap not found:', error.message);
    } else if (error instanceof InvalidSourceMapError) {
      console.error('Invalid sourcemap:', error.message);
    } else if (error instanceof NetworkError) {
      console.error('Network error:', error.message);
    } else {
      console.error('Unknown error:', error.message);
    }
  }
}

main();
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

### Testing

The package includes a test suite that can be run using:

```bash
npm test
```

The test suite covers:
- Basic functionality
- Error handling
- Edge cases
- Different input formats

## Requirements

- Node.js v14 or higher
- Internet access if fetching sourcemaps from URLs

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- [source-map](https://github.com/mozilla/source-map) for the core decoding functionality
- [commander.js](https://github.com/tj/commander.js/) for the CLI interface
- [node-fetch](https://github.com/node-fetch/node-fetch) for fetching sourcemaps from URLs


