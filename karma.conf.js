module.exports = function (config) {
  'use strict';
  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      'app/scripts/core/core.sandbox.js',
      'app/scripts/core/modules/*.js',

      'app/scripts/**/*.js',
      'test/app/**/*.js'
    ],

    reporters: ['progress', 'coverage'],
    preprocessors: {
      'app/scripts/*.js': ['coverage']
    },

    coverageReporter: {
      dir: 'coverage',
      subdir: 'client'
    },

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,

    browsers: ['Chrome']
  });
};
