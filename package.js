Package.describe({
  name: 'lachips:error-watcher',
  version: '1.3.2',
  // Brief, one-line summary of the package.
  summary: 'Automatically report Blaze client errors to the server',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/LaChips/Error-Watcher',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.2');
  api.use('ecmascript');
  api.use('themeteorchef:bert@2.2.0');
  api.mainModule('error-watcher.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('themeteorchef:bert@2.2.0');
  api.use('lachips:error-watcher');
  api.mainModule('error-watcher-tests.js');
});
