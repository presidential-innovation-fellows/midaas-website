module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    clean: ["dist", "build"],

    // jade: {
    //   compile: {
    //     options: {
    //       data: {
    //         debug: false
    //       }
    //     }
    //   },
    //
    //
    // },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'assets/css/main.css': 'assets/css/main.scss'
        }
      }
    },

    connect: {
      server: {
        options: {
          livereload: 9004,
          port: 8000,
          // base: "/"
        }
      }
    },

    watch: {
      options: {
        livereload: 9004
      },
      sass: {
        files: ['assets/css/main.scss', 'assets/_scss/**/*.scss'],
        tasks: ['sass']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', [
    'sass',
    'connect:server',
    'watch'
  ]);

};
