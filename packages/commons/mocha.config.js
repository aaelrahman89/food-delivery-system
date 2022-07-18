const testDir = process.argv.slice().pop();
module.exports = {
  'require': [
    // Order matters. babelRegister must be first to parse the remaining modules
    require.resolve('./babelRegister.js'),
    require.resolve('./test/mocha.setup.js'),
  ],
  'recursive': true,
  'sort': true,
  'extension': ['js', 'ts'],
  'file': `${testDir}/rootLevelHooks.js`,
  'forbid-only': process.env.NODE_ENV == 'coverage',
  'forbid-pending': process.env.NODE_ENV == 'coverage',
};
