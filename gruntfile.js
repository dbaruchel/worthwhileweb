module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pug: {
      compile: {
        options: {
          pretty: true,
          data: {
            projects: grunt.file.readJSON('projects.json'),
            missions: grunt.file.readJSON('missions.json'),
            teammates: grunt.file.readJSON('team.json'),
          }
        },
        files: {
          'build/index.html': 'app/views/home.pug',
          'build/offre.html': 'app/views/offer.pug',
          'build/projets.html': 'app/views/projects.pug',
          'build/equipe.html': 'app/views/team.pug',
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
      grunt: { files: ['Gruntfile.js'] },
      pug: {
        files: 'app/views/**/*.pug',
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