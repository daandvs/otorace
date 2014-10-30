module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      scripts: {
        files: [
          'server.js'
        ],
        tasks: [
          'mochaTest'
        ]
      },
      client: {
        files: [
          'app/index.html',
          'app/scripts/**/*.js'
        ],
        options: {
          livereload: 3000
        }
      },
      server: {
        files: [
          '.rebooted'
        ],
        options: {
          livereload: 3000
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          callback: function(nodemon) {
            //open browser on intial start
            nodemon.on('config:update', function() {
              console.log('UPD');
              setTimeout(function() {
                require('open')('http://localhost:3000');
              }, 1000);
            });

            //refresh on server change
            nodemon.on('restart', function() {
              console.log('restart');
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/server.spec.js']
      }
    },

    /* *********************************************
       *********************************************
       ** code coverage server
       *********************************************
       ********************************************* */
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../coverage/server/instrument/'
      }
    },
    instrument: {
      files: 'server.js',
      options: {
        lazy: true,
        basePath: 'coverage/server/instrument/'
      }
    },
    storeCoverage: {
      options: {
        dir: 'coverage/server/reports'
      }
    },
    makeReport: {
      src: 'coverage/server/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage/server/reports',
        print: 'detail'
      }
    }
    /* *********************************************
       *********************************************
       ** end code coverage server
       *********************************************
       ********************************************* */
  });

  grunt.registerTask('default', ['mochaTest', 'watch']);
  grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport']);
  grunt.registerTask('serve', ['nodemon:dev']);
};
