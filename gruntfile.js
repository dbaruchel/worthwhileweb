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

  // Project configuration.
  grunt.initConfig({
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
          'assets/**'
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
            title: 'WorthWhileWeb',
            description: 'Find better ways to spend your time on the web.'
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
        tasks: ['copy', 'sass']
      },
      grunt: { files: [
        'Gruntfile.js'
      ] },
    },
  });

  grunt.registerTask('metal', ['grunt-www-metalsmith']);
  // define default task
  grunt.registerTask('default', ['grunt-www-metalsmith', 'sass', 'copy', 'browserSync', 'watch']);
};
