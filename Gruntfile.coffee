module.exports = (grunt) ->

  #
  # CONFIG
  #

  grunt.initConfig({

    clean: ['dist']

    jade: {
      compile: {
        options: {
          pretty: true
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
          'dist/assets/js/midaas-app.js': [
            'src/assets/coffee/interact-abstract.coffee'
            'src/assets/coffee/interact-income-quantiles-compare.coffee'
            'src/assets/coffee/interact-income-quantile-gender-ratio.coffee'
            'src/assets/coffee/chart-abstract.coffee'
            'src/assets/coffee/chart-bar.coffee'
            'src/assets/coffee/chart-map.coffee'
            'src/assets/coffee/midaas.coffee'
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

    concat: {
      js_dependencies: {
        src: [
          'src/assets/js/vendor/jquery-3.0.0-beta1.min.js'
          'src/assets/js/vendor/jquery-url.js'
          'src/assets/js/vendor/d3-3.5.14.min.js'
          'src/assets/js/vendor/d3-topojson.js'
          'src/assets/js/vendor/d3-geomap.js'
          'src/assets/js/vendor/c3-0.4.10.min.js'
          'src/assets/js/vendor/pathseg.js'
          'src/assets/js/vendor/observe.js'
        ]
        dest: 'dist/assets/js/midaas-dependencies.js'
      }
      js_midaas: {
        src: [
          'dist/assets/js/midaas-dependencies.js'
          'dist/assets/js/midaas-app.js'
        ]
        dest: 'dist/assets/js/midaas.js'
      }
      css_dependencies: {
        src: [
          'src/assets/css/vendor/c3-0.4.10.min.css'
          'src/assets/css/vendor/d3-geomap.css'
        ]
        dest: 'dist/assets/css/midaas-dependencies.css'
      }
      css_midaas: {
        src: [
          'dist/assets/css/midaas-dependencies.css'
          'dist/assets/css/main.css'
        ]
        dest: 'dist/assets/css/midaas.css'
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
      js_dependencies: {
        files: ['src/assets/js/vendor/**/*.js']
        tasks: ['concat:js_dependencies', 'concat:js_midaas']
      }
      coffee: {
        files: ['src/assets/coffee/**/*.coffee']
        tasks: ['coffee', 'concat:js_midaas']
      }
      css_dependencies: {
        files: ['src/assets/css/vendor/**/*.css']
        tasks: ['concat:css_dependencies', 'concat:css_midaas']
      }
      sass: {
        files: ['src/**/*.scss']
        tasks: ['sass', 'concat:css_midaas']
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
      options: {
        sourceMap: true
      }
      midaas: {
        files: {
          'dist/assets/js/midaas.min.js': ['dist/assets/js/midaas.js']
        }
      }
    }

    cssmin: {
      target: {
        files: {
          'dist/assets/css/midaas.min.css': ['dist/assets/css/midaas.css']
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
        }, {
          from: 'assets/css/midaas.css'
          to: 'assets/css/midaas.min.css'
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
  grunt.loadNpmTasks('grunt-contrib-cssmin')
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
    'concat:js_dependencies'
    'coffee'
    'concat:js_midaas'
    'concat:css_dependencies'
    'sass'
    'concat:css_midaas'
    'copy'
    'connect:server'
    'watch'
  ])

  grunt.registerTask('production', [
    'clean'
    'jade'
    'concat:js_dependencies'
    'coffee'
    'concat:js_midaas'
    'uglify'
    'concat:css_dependencies'
    'sass'
    'concat:css_midaas'
    'cssmin'
    'copy'
    'replace:midaas'
  ])

  grunt.registerTask('deploy', [
    'production'
    's3'
  ])
