/* eslint-env meteor */
Package.describe({
  name: 'la_chips:error-watcher',
  summary: 'Automatic try catch on blaze helpers',
  git: 'https://github.com/La_chips/error-watcher.git',
  version: '0.1'
})

Package.onUse(function (api, where) {
  api.versionsFrom('1.5')
  api.use('ecmascript')
  api.use('random')
  api.use([
    'blaze@2.3.3',
    'reactive-dict@1.3.0',
    'templating@1.3.2'
  ], 'client')

  api.addFiles([
    'error-watcher.js'
  ], 'client')
})

/*Package.onTest(function (api) {
  api.use([
    'random',
    'ecmascript',
    'practicalmeteor:chai',
    'cultofcoders:mocha'
  ])
  api.use([
    'blaze@2.3.2',
    'reactive-dict@1.2.0',
    'templating@1.3.2',
    'la_chips:error-watcher@0.1'
  ], 'client')
  api.mainModule('error-watcher.tests.js', 'client')
})*/