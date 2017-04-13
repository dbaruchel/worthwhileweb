## Website
_metalsmith version_

### Features 
-Grunt for general build, and assets pipeline
-Pug for templating layout
-Sass for style syntax
-Metalsmith for .md files and all the static blog thing processing.
-Browsersync for automatic file reload

### Installation
You will need to **install Node for npm and sass**. Node -v >= v7.7.2 
- Install grunt CLI:
`npm install -g grunt-cli`

- Install npm packages
`npm install`

- Run the website
`grunt`


---
**Note:** If you add another grunt task, don't forget to:
- install the grunt plugin for the task
- configure the task in grunt.initConfig({}) in the Gruntfile
- add the grunt.loadNpmTasks() add the end of the Gruntfile
- add the task in the grunt.registerTask([]) add the end of the Gruntfile

### Metalsmith plugins and info

_Watch out: Metalsmith has a very scattered documentation. But is very powerful, useful and integrated in the node flow :)_

All the MS flow is in tasls/grunt-www-metalsmith

#### Debug
To actually show debug information you need to define an environment variable DEBUG and set it to:

$ export DEBUG=metalsmith:*

