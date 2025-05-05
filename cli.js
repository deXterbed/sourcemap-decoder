#!/usr/bin/env node

const { program } = require('commander');
const decodeSourceMap = require('./index');
const {
  InvalidInputError,
  SourceMapNotFoundError,
  InvalidSourceMapError,
  NetworkError
} = require('./errors');

program
  .version('0.0.1')
  .description('Decode a JavaScript sourcemap file and map a minified position to its original position.')
  .argument('<mapFilePath>', 'Path to the sourcemap file (URL or local file)')
  .argument('<column>', 'Column number in the minified file', parseInt)
  .option('-l, --line <number>', 'Line number in the minified file (optional, defaults to 1)', parseInt, 1)
  .action(async (mapFilePath, column, options) => {
    try {
      const position = await decodeSourceMap(mapFilePath, column, options.line);
      console.log(JSON.stringify(position, null, 2));
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
        console.error('Unexpected error:', error.message);
      }
      process.exit(1);
    }
  });

program.parse(process.argv);