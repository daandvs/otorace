module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      scripts: {
        files: [
          '{,*/}*.js'
        ],
        tasks: [
          'mochaTest'
        ]
      },
      server: {
        files: [
          '.rebooted'
        ],
        options: {
          livereload: true
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
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/server.spec.js']
      }
    }
  });

  grunt.registerTask('default', ['mochaTest', 'watch']);
  grunt.registerTask('serve', ['nodemon:dev']);
};
