var LIVERELOAD_PORT = 35729;
var path = require('path');

module.exports = function(grunt){
  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // show elapsed time at the end
  require('time-grunt')(grunt);


  grunt.initConfig({
    watch: { 
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: ['server/**/*.js', 'server/**/*jade']
      }
    },
    jshint: {
      all: {
        src: 'server/**/*.js'
      }, 
      options:  {
        laxcomma: true,
        sub: true,
        globals: {
          exports: true,
          __dirname: true,
          window: true,
          document: true,
          module: true,
          jQuery: true,
          define: true,
          require: true,
          console: true,
          alert: true
        }
      }
    },
    express: {
      options: {
        port: 3000,
        hostname: '*'
      },
      livereload: {
        options: {
          livereload: true,
          server: path.resolve('server/index.js'),
          showStack: true
        }
      }
    },
    open: {
      server: {
        options: {
          delay: 1000
        },
        url: 'http://localhost:<%= express.options.port %>'
      }
    }
  });


  grunt.registerTask('server', [
    'newer:jshint:all',
    'express:livereload',
    'open:server',
    'express-keepalive'
  ]);
};