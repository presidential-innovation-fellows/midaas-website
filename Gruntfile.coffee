module.exports = (grunt) ->

  #
  # CONFIG
  #

  grunt.initConfig({

    clean: ['dist']

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        }
        files: [ {
          cwd: 'src'
          src: [
            '**/*.jade'
            '!**/_*.*'
            '!**/_*/**'
          ]
          dest: 'dist'
          expand: true
          ext: '.html'
        } ]
      }
    }

    coffee: {
      compile: {
        files: {
          'dist/assets/js/midaas.js': [
            'src/assets/coffee/**/*.coffee'
            '!src/assets/coffee/**/_*.*'
            '!src/assets/coffee/**/_*/**'
          ]
        }
      }
    }

    sass: {
      options: {
        sourceMap: true
      }
      dist: {
        files: [ {
          cwd: 'src'
          src: [
            '**/*.scss'
            '!**/_*.*'
            '!**/_*/**'
          ]
          dest: 'dist'
          expand: true
          ext: '.css'
        } ]
      }
    }

    copy: {
      src: {
        expand: true
        cwd: 'src'
        src: [
          '**/*'
          '!**/*.scss'
          '!**/*.jade'
          '!**/coffee/**'
          '!**/_*.*'
          '!**/_*/**'
        ]
        dest: 'dist/'
      }
    }

    connect: {
      server: {
        options: {
          livereload: 9004
          port: 8000
          base: 'dist/'
        }
      }
    }

    watch: {
      options: {
        livereload: 9004
      }
      jade: {
        files: ['src/**/*.jade']
        tasks: ['jade']
      }
      coffee: {
        files: ['src/assets/coffee/**/*.coffee']
        tasks: ['coffee']
      }
      sass: {
        files: ['src/**/*.scss']
        tasks: ['sass']
      }
      other: {
        files: [
          'src/**/*'
          '!src/**/*.jade'
          '!src/assets/coffee/**/*.coffee'
          '!src/**/*.scss'
        ]
        tasks: ['newer:copy']
      }
    }

    aws: grunt.file.readJSON(process.env['HOME'] + '/.aws/credentials.json')
    s3: {
      options: {
        accessKeyId: '<%= aws.accessKeyId %>'
        secretAccessKey: '<%= aws.secretAccessKey %>'
        region: 'us-west-2'
        bucket: 'midaas.pif.ninja'
      }
      dist: {
        cwd: 'dist/'
        src: '**'
        cache: false
        overwrite: true
      }
    }

  })

  #
  # LIBRARIES
  #

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-newer')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-aws')

  #
  # TASKS
  #

  grunt.registerTask('default', [
    'clean'
    'jade'
    'coffee'
    'sass'
    'copy'
    'connect:server'
    'watch'
  ])

  grunt.registerTask('deploy', [
    'clean'
    'jade'
    'coffee'
    'sass'
    'copy'
    's3'
  ])
