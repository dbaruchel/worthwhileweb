// Great sample file of a gruntfile with metalsmith
// Also great example of a whole custom static site gen with react
// https://github.com/dbushell/dbushell.com
// https://github.com/dbushell/dbushell.com/blob/v8/gruntfile.js

module.exports = function(grunt) {
  grunt.loadTasks('tasks');
  // These plugins provide necessary tasks.

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-clean');

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
          src : [
            'build/*'
          ]
        },
        options: {
          watchTask: true,
          server: './build'
        }
      }
    },
    "grunt-www-metalsmith" : {
      'all': {
        options: {
          clean: true,
          metadata: {
            title: 'WorthWhileWeb — Better ways to spend your time on the Web',
            description: 'Find better ways to spend your time on the web.',
            image: "http://kalys-solutions.com/wp-content/uploads/2016/04/Innovation_Mission-possible.jpg",
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
      "rebuild-metal": {
        files: ['Gruntfile.js', 'tasks/*', 'src/*', 'layouts/*'],
        tasks: ['grunt-www-metalsmith']
      },
      "rebuild": {
        files: ['metal-build/*'],
        tasks: ['clean','copy', 'sass']
      },
      grunt: { files: [
        'Gruntfile.js'
      ] },
    },
  });

  grunt.registerTask('metal', ['grunt-www-metalsmith']);
  // define default task
  grunt.registerTask('default', ['grunt-www-metalsmith', 'clean', 'copy', 'sass','browserSync', 'watch']);
};
