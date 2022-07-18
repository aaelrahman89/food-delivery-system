/* eslint-env node */

function targets() {
  const nodeEnv = process.env.NODE_ENV;
  const envTargets = {
    coverage: {
      esmodules: true,
      node: 'current',
    },
    development: {
      browsers: ['Chrome >= 76', 'Firefox >= 68'],
    },
    test: {
      esmodules: true,
      node: 'current',
    },
  };

  return envTargets[nodeEnv];
}

function plugins() {
  const nodeEnv = process.env.NODE_ENV;

  const envPlugins = {
    coverage: ['istanbul'],
  };

  return envPlugins[nodeEnv] || [];
}

module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
          targets: targets(),
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-proposal-class-properties', ...plugins()],

    babelrcRoots: ['.', './packages/*', './apps/*'],
  };
};
