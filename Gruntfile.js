module.exports = function(grunt) {

  grunt.initConfig({

    clean: ['dist'],

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [ {
          cwd: 'src',
          src: ['**/*.jade', '!**/_*.jade'],
          dest: 'dist',
          expand: true,
          ext: '.html'
        } ]
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'src/assets/css/main.css': 'src/assets/css/main.scss'
        }
      }
    },

    copy: {
      css: {
        expand: true,
        cwd: 'src/assets/css/',
        src: ['**/*.css', '**/*.map'],
        dest: 'dist/assets/css/'
      },
      fonts: {
        expand: true,
        cwd: 'src/assets/fonts/',
        src: '**',
        dest: 'dist/assets/fonts/'
      },
      img: {
        expand: true,
        cwd: 'src/assets/img/',
        src: '**',
        dest: 'dist/assets/img/'
      },
      js: {
        expand: true,
        cwd: 'src/assets/js/',
        src: '**',
        dest: 'dist/assets/js/'
      },
      jade: {
        expand: true,
        cwd: 'src/',
        src: '!**/*.jade',
        dest: 'dist/'
      }
    },

    connect: {
      server: {
        options: {
          livereload: 9004,
          port: 8000,
          base: 'dist/'
        }
      }
    },

    watch: {
      options: {
        livereload: 9004
      },
      jade: {
        files: ['src/**/*.jade', 'src/!**/_*.jade', 'src/eagle.txt'],
        tasks: ['jade', 'copy:jade']
      },
      sass: {
        files: ['src/assets/css/main.scss', 'src/assets/_scss/**/*.scss'],
        tasks: ['sass', 'copy:css']
      },
      fonts: {
        files: ['src/assets/fonts/**'],
        tasks: ['copy:fonts']
      },
      img: {
        files: ['src/assets/img/**'],
        tasks: ['copy:img']
      },
      js: {
        files: ['src/assets/js/**'],
        tasks: ['copy:js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'clean',
    'jade',
    'sass',
    'copy',
    'connect:server',
    'watch'
  ]);

};
