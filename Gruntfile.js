// 'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> by <%= pkg.author %>, <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      js: {
        files: {
          'assets/js/application.min.js': ['assets/js/application.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['assets/js/application.js'],
        dest: 'assets/js/application.min.js'
      }
    },
    jshint: {
      beforeconcat: ['assets/js/application.js'],
      afterconcat: ['assets/js/application.min.js'],
      gruntfile: ['Gruntfile.js']
    },
    less: {
      dev: {
        options: {
          paths: ['assets/css'],
          dumpLineNumbers: 'comments'
        },
        files: {
          'assets/css/main.css': 'assets/css/main.less'
        }
      },
      build: {
        options: {
          paths: ['assets/css'],
          yuicompress: true
        },
        files: {
          'assets/css/main.css': 'assets/css/main.less'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 4444,
          base: ''
        }
      },
      livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
          }
        }
      }
    },
    livereload: {
      port: 35729 // Default livereload listening port.
    },
    // Configuration to be run (and then tested)
    regarde: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      html: {
        files: '*.html',
        tasks: ['livereload']
      },
      js: {
        files: 'assets/js/application.js',
        tasks: ['concat', 'livereload']
      },
      less: {
        files: 'assets/css/*.less',
        tasks: ['less:dev', 'livereload']
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          nocase: true
        }
      },
      js: {
        files: ['assets/js/application.js'],
        tasks: ['concat'],
        options: {
          nospawn: true
        }
      },
      less: {
        files: ['assets/css/*.less'],
        tasks: ['less:dev'],
        options: {
          nospawn: true
        }
      }
    },
    clean: {
      build: {
        src: ['build']
      },
      preview: {
        src: ['~/Dropbox/Apps/site44/tmp.site44.com/path-menu/'],
        options: {
          force: true // --force is required to clean a folder outside cwd.
        }
      }
    },
    copy: {
      build: {
        files: [
          { src: ['index.html'], dest: 'build/', filter: 'isFile'},
          { src: ['assets/css/main.css'], dest: 'build/'},
          { src: ['assets/img/**'], dest: 'build/'},
          { src: ['assets/js/*.min.js'], dest: 'build/'}
        ]
      },
      preview: {
        files: [
          {expand: true, cwd: 'build/', src: ['**'], dest: '~/Dropbox/Apps/site44/tmp.site44.com/path-menu/'}
        ]
      }
    }
  });

  // Load dev the plugins.
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);

  // Build task(s)
  grunt.registerTask('build', ['uglify', 'less:build', 'clean:build', 'copy:build']);

  // Client preview task(s)
  grunt.registerTask('preview', ['build', 'clean:preview', 'copy:preview']);

};
