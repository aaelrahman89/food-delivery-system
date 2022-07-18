const codeDirRegex = /(packages|apps)/;
// eslint-disable-next-line import/no-extraneous-dependencies
module.exports = require('@babel/register')({
  rootMode: 'upward',
  extensions: ['.js', '.ts'],
  ignore: [
    function ignoreFile(filepath) {
      return !codeDirRegex.test(filepath);
    },
  ],
});
