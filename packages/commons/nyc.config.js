module.exports = {
  'include': ['**/*.js', '**/*.ts'],
  'exclude': [
    '*.js',
    '*.ts',
    '**/*.nc.js',
    '**/*.nc.ts',
    'locales',
    'shell/vue-plugins*',
    'components-deprecated',
    'components',
    'test',
    'coverage',
  ],
  'reporter': ['html', 'text'],
  'require': ['./babelRegister.js'],
  'instrument': false,
  'source-map': false,
  'clean': true,
  'cache': true,
  'eager': true,
  'check-coverage': true,
  'all': true,
  'per-file': true,
  'report-dir': 'coverage',
  'lines': 98,
  'statements': 98,
  'functions': 98,
  'branches': 98,
  'skip-full': true,
};
