'use strict';

/**
 * backbone-requirejs-template
 * https://github.com/keik/backbone-requirejs-template
 *
 */

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    // =========================================================================
    // Environment
    // =========================================================================

    // paths
    dir: {
      src: 'src/',
      dist: 'dist/',
      assets: '',
      vendor: 'vendor/'
    },

    watch: {
      options: {
        livereload: true,
        spawn: true
      },

      'jshint-gruntfile': {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },

      'jshint-js': {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js']
      },

      recess: {
        files: '<%= dir.src %><%= dir.assets %>less/**/*.less',
        tasks: ['recess:lint', 'recess:compile']
      }
    },

    bower: {
      install: {
        options: {
          layout: 'byComponent',
          install: true,
          targetDir: '<%= dir.src %><%= dir.assets %><%= dir.vendor %>',
          cleanTargetDir: true,
          cleanBowerDir: true
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',

        base: ['.']
      },

      dev: {
        options: {
          middleware: function (connect, options) {

            var middlewares = [];

            if (!Array.isArray(options.base))
              options.base = [options.base];

            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });

            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            // livereload
            // middlewares.push(require('connect-livereload'));

            return middlewares;
          }
        }
      }
    },


    // =========================================================================
    // JavaScript
    // =========================================================================

    jshint: {

      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },

      gruntfile: {
        src: 'Gruntfile.js'
      },

      js: {
        src: ['<%= dir.src %><%= dir.assets %>js/**/*.js']
      }
    },


    // =========================================================================
    // CSS
    // =========================================================================

    recess: {
      options: {
        noOverqualifying: false
      },

      lint: {
        src: ['<%= dir.src %><%= dir.assets %>less/main.less']
      },

      compile: {
        options: {
          compile: true
        },
        src: '<%= dir.src %><%= dir.assets %>less/main.less',
        dest: '<%= dir.src %><%= dir.assets %>css/style.css'
      },

      dist: {
        options: {
          compress: true
        },
        src: '<%= dir.src %><%= dir.assets %>less/main.less',
        dest: '<%= dir.dist %><%= dir.assets %>css/style.css'
      }
    },


    // =========================================================================
    // Build
    // =========================================================================

    clean: {
      dist: ['<%= dir.dist %>']
    },

    copy: {
      assets: {
        expand: true,
        cwd: '<%= dir.src %><%= dir.assets %>',
        src: ['img/**', 'fonts/**'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: '<%= dir.src %>',
        src: ['**/*.html'],
        dest: '<%= dir.dist %>'
      }
    },

    cssmin: {
      dist: {
        expand: true,
        cwd: '<%= dir.src %><%= dir.assets %>',
        src: ['**/*.css'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    },

    requirejs: {
      dist: {
        options: {
          almond: true,
          baseUrl: '<%= dir.src %><%= dir.assets %>js/',
          mainConfigFile: '<%= dir.src %><%= dir.assets %>js/config.js',
          name: 'main', // assumes a production build using almond
          out: '<%= dir.dist %><%= dir.assets %>js/main.js',
          optimize: 'none',
          preserveLicenseComments: true,
          shim: {
            'app': {
              deps: ['backbone']
            }
          }
        }
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /<script src="js\/config\.js"><\/script>/,
              replacement: ''
            },
            {
              match: /<script data-main="main" src="vendor\/requirejs\/require\.js"><\/script>/,
              replacement: '<script src="js/main.js"></script>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= dir.dist %>index.html'],
            dest: '<%= dir.dist %>'
          }
        ]
      }
    }

  });


  // ===========================================================================
  // Task Group
  // ===========================================================================

  grunt.registerTask('default', ['connect:dev', 'watch']);
  grunt.registerTask('build', ['bower', 'clean', 'recess:dist', 'copy', 'htmlmin', 'cssmin', 'requirejs', 'replace:dist']);

};
