## STFU website
####you can work on it with Grunt, Pug, Sass, and a Json file for data

You will need to **install Node for npm and Ruby for Sass**.

- In your project folder, run:
`npm init`
and follow the instructions to create package.json

- Install grunt:
`npm install --save-dev grunt`

- Install grunt CLI:
`npm install -g grunt-cli`

- Install grunt plugin for Pug tasks:
`npm install --save-dev grunt-contrib-pug`

- Install grunt plugin for Sass tasks:
`npm install grunt-contrib-sass --save-dev`

- Install Pug:
`npm install --save-dev pug`

- Install grunt watch task:
`npm install --save-dev grunt-contrib-watch`


---
**Note:** If you add another grunt task, don't forget to:
- install the grunt plugin for the task
- configure the task in grunt.initConfig({}) in the Gruntfile
- add the grunt.loadNpmTasks() add the end of the Gruntfile
- add the task in the grunt.registerTask([]) add the end of the Gruntfile

