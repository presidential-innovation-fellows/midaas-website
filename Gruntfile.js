module.exports = function(grunt) {

  grunt.initConfig({

    clean: ["dist"],

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "dist/index.html": "src/index.jade"
        }
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
        cwd: "src/assets/css/",
        src: ["**/*.css", "**/*.map"],
        dest: "dist/assets/css/"
      },
      fonts: {
        expand: true,
        cwd: "src/assets/fonts/",
        src: "**",
        dest: "dist/assets/fonts/"
      },
      img: {
        expand: true,
        cwd: "src/assets/img/",
        src: "**",
        dest: "dist/assets/img/"
      },
      js: {
        expand: true,
        cwd: "src/assets/js/",
        src: "**",
        dest: "dist/assets/js/"
      },
      jade: {
        expand: true,
        cwd: "src/",
        src: "!**/*.jade",
        dest: "dist/"
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'the-eagle-has-landed',
              replacement: '<%= grunt.file.read("src/eagle.txt") %>'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['dist/index.html'], dest: 'dist/'}
        ]
      }
    },

    connect: {
      server: {
        options: {
          livereload: 9004,
          port: 8000,
          base: "dist/"
        }
      }
    },

    watch: {
      options: {
        livereload: 9004
      },
      jade: {
        files: ['src/**/*.jade', 'src/eagle.txt'],
        tasks: ['jade', 'copy:jade', 'replace:dist']
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

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'clean',
    'jade',
    'sass',
    'copy',
    'replace',
    'connect:server',
    'watch'
  ]);

};
