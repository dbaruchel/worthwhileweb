// Great sample file of a gruntfile with metalsmith
// Also great example of a whole custom static site gen with react
// https://github.com/dbushell/dbushell.com
// https://github.com/dbushell/dbushell.com
module.exports = function (grunt) {
  // Our custom metalsmith build function
  grunt.loadTasks('tasks')

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-browser-sync')
  grunt.loadNpmTasks('grunt-contrib-clean')

  // Project configuration.
  grunt.initConfig({
    clean: {
      build: ['build/*']
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'metal-build',
          src: ['**/*.scss'],
          dest: 'build/',
          ext: '.css'
        }]
      }
    },
    copy: {
      build: {
        cwd: 'metal-build',
        src: [
          'js/*',
          'style/*.css',
          'assets/**',
          '**/*.html'
        ],
        dest: 'build',
        expand: true
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'build/*'
          ]
        },
        options: {
          watchTask: true,
          server: './build'
        }
      }
    },
    'metalsmith': {
      'all': {
        options: {
          clean: true,
          metadata: {
            title: 'WorthWhileWeb — Better ways to seek information and enrich you knowledge.',
            // description: 'Find better ways to spend your time on the web.',
            description: 'Better ways to seek information and enrich your knowledge.',
            image: 'http://kalys-solutions.com/wp-content/uploads/2016/04/Innovation_Mission-possible.jpg',
            seo: {
              // title,
              // image
              // description
            }
          },
          src: 'src',
          dest: 'metal-build'
        }
      }
    },
    watch: {
      'rebuild-metal': {
        files: ['gruntfile.js', 'metalsmith.js', 'src/*', 'layouts/*'],
        tasks: ['metalsmith']
      },
      'rebuild': {
        files: ['metal-build/*'],
        tasks: ['clean', 'copy', 'sass']
      },
      grunt: { files: [
        'Gruntfile.js'
      ] }
    }
  })

  grunt.registerTask('metal', ['metalsmith'])
  // define default task
  grunt.registerTask('default', ['metalsmith', 'clean', 'copy', 'sass', 'browserSync', 'watch'])

  grunt.registerTask('build', ['metalsmith', 'clean', 'copy', 'sass'])
}
