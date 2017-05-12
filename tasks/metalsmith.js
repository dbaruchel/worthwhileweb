const Metalsmith = require('metalsmith')

const msMatters = require('metalsmith-matters')
const msMarkdown = require('metalsmith-markdown')
const msLayouts = require('metalsmith-layouts')
const msPermalinks = require('metalsmith-permalinks')
const msPropdown = require('metalsmith-propdown')
const msCollections = require('metalsmith-collections')
const msDebug = require('metalsmith-debug')
const msRootPath = require('metalsmith-rootpath')

const msLinks = require('../metal-plugins/link')

const _ = require('underscore')
// ms_feed        = require('metalsmith-feed'),
// ms_drafts      = require('metalsmith-drafts'),
// ms_branch      = require('metalsmith-branch'),
// ms_db_markup   = require('./dbushell-metalsmith-markup'),
// ms_db_sitemap  = require('./dbushell-metalsmith-sitemap'),
// ms_db_ampify   = require('./dbushell-metalsmith-ampify'),

const helpers = {
  groupBy: function (list, number) {
    return _.toArray(_.groupBy(list, function (element, index) {
      return Math.floor(index / number)
    }))
  },
  link: function (text, exp) {
    return text
  }
}

function plugin (grunt) {
  // based on https://github.com/doingweb/grunt-metalsmith

  grunt.registerMultiTask('metalsmith',
    'Our metalsmith configuration for WWW',
    function () {
      const done = this.async()

      const options = this.options({
        src: 'src-markdown',
        dest: 'build',
        amp: false,
        clean: false,
        watch: false,
        partials: {},
        metadata: {}
      })

      const metalsmith = new Metalsmith(process.cwd())

      metalsmith.source(options.src)
      metalsmith.destination(options.dest)
      metalsmith.metadata(_.extend(
        options.metadata, {
          helpers: helpers
        }
      ))

      // // not sure if this actually fixes the ulimit issue...
      metalsmith.concurrency(512)

      metalsmith.clean(options.clean)

      metalsmith

      .use(msCollections({
        initiatives: {
          pattern: 'initiatives/*.md',
          sortBy: 'date',
          reverse: true
        },
        howtos: {
          pattern: 'howtos/*.md',
          sortBy: 'date',
          reverse: true
        },
        reads: {
          pattern: 'reads/*.md',
          sortBy: 'date',
          reverse: true
        },
        experiments: {
          pattern: 'experiments/*.md',
          sortBy: 'date',
          reverse: true
        }
      }))

      .use(msMatters({}))
      .use(msMarkdown({}))
      // Compiles markdown in html for all these fields
      .use(msPropdown({
        collection: 'initiatives',
        property: 'short_description'
      }))
      .use(msPropdown({
        collection: 'howtos',
        property: 'short_description'
      }))
      .use(msPropdown({
        collection: 'reads',
        property: 'short_description'
      }))
      .use(msPropdown({
        collection: 'experiments',
        property: 'short_description'
      }))

      .use(msPermalinks({
        // original options would act as the keys of a `default` linkset,
        pattern: ':title',
        date: 'YYYY',

        // each linkset defines a match, and any other desired option
        linksets: [{
          match: {
            collection: 'initiatives'
          },
          pattern: 'initiatives/:title'
          // date: 'mmddyy'
        }, {
          match: {
            collection: 'howtos'
          },
          pattern: 'howtos/:title'
          // date: 'mmddyy'
        }, {
          match: {
            collection: 'reads'
          },
          pattern: 'reads/:title'
          // date: 'mmddyy'
        }, {
          match: {
            collection: 'experiments'
          },
          pattern: 'experiments/:title'
          // date: 'mmddyy'
        }]
      }))
      .use(msRootPath())
      // Add an easy to use link function to any resource
      // depends on rootPath and permalinks
      .use(msLinks())

      .use(msLayouts({
        engine: 'pug',
        directory: 'layouts'
      }))

      metalsmith.build(function (err) {
        if (err) {
          done(err)
          return
        }
        grunt.log.writeln('Built files in ' + metalsmith.source() +
          ' to ' + metalsmith.destination())
        done()
      })
    })
}

module.exports = plugin
