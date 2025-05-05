const decodeSourceMap = require('../index');
const {
    SourceMapError,
    SourceMapNotFoundError,
    InvalidSourceMapError,
    InvalidInputError,
    NetworkError
} = decodeSourceMap;

async function runTests() {
    console.log('Running tests...\n');

    // Test 1: Basic functionality
    try {
        console.log('Test 1: Basic functionality');
        const result = await decodeSourceMap('test/sample/test.js.map', 20, 1);
        console.log('Result:', result);
        console.log('✓ Test 1 passed\n');
    } catch (error) {
        console.error('✗ Test 1 failed:', error.message);
    }

    // Test 2: Invalid sourcemap
    try {
        console.log('Test 2: Invalid sourcemap');
        await decodeSourceMap('test/sample/invalid.js.map', 20, 1);
        console.error('✗ Test 2 failed: Should have thrown error');
    } catch (error) {
        console.log('✓ Test 2 passed: Caught expected error:', error.message);
    }

    // Test 3: Invalid line number
    try {
        console.log('Test 3: Invalid line number');
        await decodeSourceMap('test/sample/test.js.map', 20, -1);
        console.error('✗ Test 3 failed: Should have thrown error');
    } catch (error) {
        console.log('✓ Test 3 passed: Caught expected error:', error.message);
    }

    // Test 4: Invalid column number
    try {
        console.log('Test 4: Invalid column number');
        await decodeSourceMap('test/sample/test.js.map', -1, 1);
        console.error('✗ Test 4 failed: Should have thrown error');
    } catch (error) {
        console.log('✓ Test 4 passed: Caught expected error:', error.message);
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