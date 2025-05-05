class SourceMapError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SourceMapError';
  }
}

class SourceMapNotFoundError extends SourceMapError {
  constructor(path) {
    super(`Sourcemap not found at: ${path}`);
    this.name = 'SourceMapNotFoundError';
    this.path = path;
  }
}

class InvalidSourceMapError extends SourceMapError {
  constructor(message) {
    super(`Invalid sourcemap: ${message}`);
    this.name = 'InvalidSourceMapError';
  }
}

class InvalidInputError extends SourceMapError {
  constructor(message) {
    super(`Invalid input: ${message}`);
    this.name = 'InvalidInputError';
  }
}

class NetworkError extends SourceMapError {
  constructor(url, status, statusText) {
    super(`Failed to fetch sourcemap from ${url}: ${status} ${statusText}`);
    this.name = 'NetworkError';
    this.url = url;
    this.status = status;
    this.statusText = statusText;
  }
}

module.exports = {
  SourceMapError,
  SourceMapNotFoundError,
  InvalidSourceMapError,
  InvalidInputError,
  NetworkError
}; 