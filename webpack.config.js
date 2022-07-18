const { generateWebpackConfig } = require('./scripts/webpack-config-generator');

module.exports = function webpackConfig(env = {}, argv = {}) {
  const mode = argv.mode || env.mode || 'development';

  return generateWebpackConfig({ mode });
};
