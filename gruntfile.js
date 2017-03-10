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
        src: [ 'js/*','style/*.css', '!**/*.pug', 'assets/**'],
        dest: 'build',
        expand: true
      }
    },
    watch: {
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
    }
  });
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-contrib-copy");
  // Default task.
  grunt.registerTask('default',['pug', 'sass', 'copy', 'watch']);
};
