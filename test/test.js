const path = require('path');
const decodeSourceMap = require('../index');
const {
  SourceMapError,
  SourceMapNotFoundError,
  InvalidSourceMapError,
  InvalidInputError,
  NetworkError
} = decodeSourceMap;

async function runTests() {
  console.log('Starting tests...\n');

  // Test 1: Valid local file
  try {
    console.log('Test 1: Valid local file');
    const position = await decodeSourceMap(
      path.join(__dirname, 'sourcemaps/sample.js.map'),
      10,
      1
    );
    console.log('Result:', position);
    console.log('✅ Test 1 passed\n');
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  // Test 2: Invalid file path
  try {
    console.log('Test 2: Invalid file path');
    await decodeSourceMap('nonexistent.js.map', 10, 1);
    console.error('❌ Test 2 failed: Should have thrown SourceMapNotFoundError');
  } catch (error) {
    if (error instanceof SourceMapNotFoundError) {
      console.log('✅ Test 2 passed\n');
    } else {
      console.error('❌ Test 2 failed with unexpected error:', error.message);
    }
  }

  // Test 3: Invalid column number
  try {
    console.log('Test 3: Invalid column number');
    await decodeSourceMap(
      path.join(__dirname, 'sourcemaps/sample.js.map'),
      -1,
      1
    );
    console.error('❌ Test 3 failed: Should have thrown InvalidInputError');
  } catch (error) {
    if (error instanceof InvalidInputError) {
      console.log('✅ Test 3 passed\n');
    } else {
      console.error('❌ Test 3 failed with unexpected error:', error.message);
    }
  }

  // Test 4: Invalid line number
  try {
    console.log('Test 4: Invalid line number');
    await decodeSourceMap(
      path.join(__dirname, 'sourcemaps/sample.js.map'),
      10,
      0
    );
    console.error('❌ Test 4 failed: Should have thrown InvalidInputError');
  } catch (error) {
    if (error instanceof InvalidInputError) {
      console.log('✅ Test 4 passed\n');
    } else {
      console.error('❌ Test 4 failed with unexpected error:', error.message);
    }
  }

  // Test 5: URL (mock test)
  try {
    console.log('Test 5: URL (mock test)');
    await decodeSourceMap(
      'https://example.com/sourcemap.js.map',
      10,
      1
    );
    console.log('Note: This test will likely fail due to network error, which is expected');
    console.log('✅ Test 5 passed (with expected network error)\n');
  } catch (error) {
    if (error instanceof NetworkError) {
      console.log('✅ Test 5 passed (with expected network error)\n');
    } else {
      console.error('❌ Test 5 failed with unexpected error:', error.message);
    }
  }
}

runTests(); 