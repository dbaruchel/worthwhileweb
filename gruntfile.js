module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pug: {
      compile: {
        options: {
          pretty: true,
          data: {
            app: grunt.file.readJSON('data/appMicka2.json'),
            initiatives: grunt.file.readJSON('data/initiatives.json'),
            missions: grunt.file.readJSON('data/missions.json'),
            teammates: grunt.file.readJSON('data/team.json'),
          }
        },
        files: {
          'build/index.html': 'app/views/home.pug',
          'build/collection.html': 'app/views/collection.pug',
          'build/projets.html': 'app/views/projects.pug',
          'build/equipe.html': 'app/views/team.pug',
          'build/initiative.html': 'app/views/initiative.pug',
        }
      }
    },
    sass: {
      dist: {
        files: {
          'build/style/style.css' : 'app/style/sass/style.scss'
        }
      }
    },
    copy: {
      build: {
        cwd: 'app',
        src: [ 
          'js/*',
          'style/*.css', 
          // '!**/*.pug', 
          'assets/**'
        ],
        dest: 'build',
        expand: true
      }
    },
    watch: {
      copy: {
        files: ['app/js/*.js', 'app/assets/*'],
        tasks: ['copy:build'],
      },
      grunt: { files: [
        'Gruntfile.js'
      ] },
      pug: {
        files: [
          'Gruntfile.js',
          'app/views/**/*.pug',
          'data/*.json'
        ],
        tasks: ['pug']
      },
      sass: {
        files: 'app/style/sass/style.scss',
        tasks: ['sass']
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'build/assets/*',
            'build/js/*.js',
            'build/style/*.css',
            'build/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: './build'
        }
      }
    }
  });
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-browser-sync');
  // Default task.
  // grunt.registerTask('default',['pug', 'sass', 'copy', 'watch']);
  // grunt.registerTask('build',['pug', 'sass', 'copy']);
  // define default task
  grunt.registerTask('default', ['pug', 'sass', 'copy', 'browserSync', 'watch', ]);
};
