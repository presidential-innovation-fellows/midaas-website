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
          src: [
            '**/*.jade',
            '!**/_*.*',
            '!**/_*/**'
          ],
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
        files: [ {
          cwd: 'src',
          src: [
            '**/*.scss',
            '!**/_*.*',
            '!**/_*/**'
          ],
          dest: 'dist',
          expand: true,
          ext: '.css'
        } ]
      }
    },

    copy: {
      src: {
        expand: true,
        cwd: 'src',
        src: [
          '**/*',
          '!**/*.scss',
          '!**/*.jade',
          '!**/_*.*',
          '!**/_*/**'
        ],
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
        files: ['src/**/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass']
      },
      other: {
        files: [
          'src/**/*',
          '!src/**/*.jade',
          '!src/**/*.scss'
        ],
        tasks: ['newer:copy']
      }
    },

    aws: grunt.file.readJSON(process.env['HOME'] + '/.aws/credentials.json'),
    s3: {
      options: {
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        region: 'us-west-2',
        bucket: 'midaas.pif.ninja'
      },
      dist: {
        cwd: 'dist/',
        src: '**',
        cache: false,
        overwrite: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-aws');

  grunt.registerTask('default', [
    'clean',
    'jade',
    'sass',
    'copy',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'clean',
    'jade',
    'sass',
    'copy',
    's3'
  ])

};
