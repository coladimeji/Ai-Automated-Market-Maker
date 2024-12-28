const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"), // This resolves process/browser correctly
    "fs": false, // If not using fs
    "path": require.resolve("path-browserify"),
  };

  // Add ProvidePlugin for global objects
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser', // Provide process in the global scope
    }),
  ];

  // Ensure Webpack can resolve `process/browser.js`
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser.js') // Explicitly resolve process/browser.js
  };

  // Explicitly resolve .mjs extensions
  config.resolve.extensions = ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'];

  return config;
};
