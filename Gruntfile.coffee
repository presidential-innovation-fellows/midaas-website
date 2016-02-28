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
          'dist/assets/js/midaas-chart.js': [
            'src/assets/coffee/chart.coffee'
            'src/assets/coffee/chart-compare.coffee'
            '!src/assets/coffee/**/_*.*'
            '!src/assets/coffee/**/_*/**'
          ]
        }
      }
    }

    concat: {
      dependencies: {
        src: [
          'src/assets/js/vendor/jquery-3.0.0-beta1.min.js'
          'src/assets/js/vendor/d3-3.5.14.min.js'
          'src/assets/js/vendor/c3-0.4.10.min.js'
          'src/assets/js/vendor/observe.js'
        ]
        dest: 'dist/assets/js/midaas-dependencies.js'
      }
      midaas: {
        src: [
          'dist/assets/js/midaas-dependencies.js'
          'dist/assets/js/midaas-chart.js'
        ]
        dest: 'dist/assets/js/midaas.js'
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
          '!**/assets/coffee/**'
          '!**/assets/js/**'
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
      dependencies: {
        files: ['src/assets/js/vendor/**/*.js']
        tasks: ['concat:dependencies', 'concat:midaas']
      }
      coffee: {
        files: ['src/assets/coffee/**/*.coffee']
        tasks: ['coffee', 'concat:midaas']
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

    uglify: {
      midaas: {
        files: {
          'dist/assets/js/midaas.min.js': ['dist/assets/js/midaas.js']
        }
      }
    }

    replace: {
      midaas: {
        src: ['dist/**/*.html']
        overwrite: true
        replacements: [{
          from: 'assets/js/midaas.js'
          to: 'assets/js/midaas.min.js'
        }]
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

  grunt.loadNpmTasks('grunt-aws')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-newer')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-text-replace')

  #
  # TASKS
  #

  grunt.registerTask('default', [
    'clean'
    'jade'
    'concat:dependencies'
    'coffee'
    'concat:midaas'
    'sass'
    'copy'
    'connect:server'
    'watch'
  ])

  grunt.registerTask('deploy', [
    'clean'
    'jade'
    'concat:dependencies'
    'coffee'
    'concat:midaas'
    'uglify:midaas'
    'sass'
    'copy'
    'replace:midaas'
    's3'
  ])
