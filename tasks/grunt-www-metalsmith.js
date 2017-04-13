var Metalsmith = require('metalsmith')
  // Handlebars  = require('handlebars'),
  // Moment      = require('moment'),

var msMatters = require('metalsmith-matters')
var msMarkdown = require('metalsmith-markdown')
var msLayouts = require('metalsmith-layouts')
var msPermalinks = require('metalsmith-permalinks')
var msLinks = require('metalsmith-relative-links')
var msPropdown = require('metalsmith-propdown')

var msCollections = require('metalsmith-collections')

var msDebug = require('metalsmith-debug')

var _ = require('underscore')
// ms_feed        = require('metalsmith-feed'),
// ms_drafts      = require('metalsmith-drafts'),
// ms_branch      = require('metalsmith-branch'),

// msMarkdown    = require('metalsmith-markdown'),
// msLayouts     = require('metalsmith-layouts'),
// msPermalinks  = require('metalsmith-permalinks'),
// ms_db_markup   = require('./dbushell-metalsmith-markup'),
// ms_db_sitemap  = require('./dbushell-metalsmith-sitemap'),
// ms_db_ampify   = require('./dbushell-metalsmith-ampify'),

// fs          = require('fs'),
// path        = require('path'),
// striptags   = require('striptags');
//
var helpers = {
  groupBy: function (list, number) {
    var lists = _.groupBy(list, function (element, index) {
      return Math.floor(index / number)
    })
    lists = _.toArray(lists)
    return lists
  }
}

module.exports = plugin

// var ms_db_noop = function() { return function (a, b, c) { c(); }; };

function plugin (grunt) {
  // based on https://github.com/doingweb/grunt-metalsmith

  grunt.registerMultiTask('grunt-www-metalsmith',
    'Our metalsmith configuration for WWW',
    function () {
      var done = this.async()

      var options = this.options({
        src: 'src-markdown',
        dest: 'build',
        amp: false,
        clean: false,
        watch: false,
        partials: {},
        metadata: {}
      })

      var metalsmith = new Metalsmith(process.cwd())

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

      .use(msDebug())

      .use(msMatters({}))

      .use(msMarkdown({}))

      // Use relative links to make it work
      .use(msLinks({
        // Name of property that should get the link function
        // linkProperty: "link",

        // Pattern of files to match
        // match: "**/*.htm,html",

        // Options for matching files.  See minimatch.
        // matchOptions: {},

        // Function to modify links.  See below.
        modifyLinks: function (uri) {
          // Remove all extensions
          // uri = uri.replace(/\.[^.]*$/, "");
          // console.log('YOLO', uri);
          // Make sure we always link to a folder
          // uri = uri + "/";

          return uri
        }
      }))

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

      // .use(msDebug())

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

      // function changed(filename, props, i) {
      //     return !!( options.watch ? props.watching : true );
      // }

      // // return array of partials for metalsmith-templates
      // var parts = fs.readdirSync('src-templates/partials');
      // if (Array.isArray(parts) && parts.length) {
      //     parts.forEach(function(name) {
      //         name = name.split('.')[0];
      //         options.partials[name] = 'partials/' + name;
      //     });
      // }

      // // if A or B conditional
      // Handlebars.registerHelper('either', function(a, b, opts) {
      //     return (a || b) ? opts.fn(this) : opts.inverse(this);
      // });

      // // replicate WordPress `is_frontpage` and `is_single` template functions
      // Handlebars.registerHelper('is', function(type, opts) {
      //     var is = false,
      //         isSingle = ['page.html', 'single.html'].indexOf(this.layout) > -1;

      //     if (type === 'home' && ['index.html'].indexOf(this.layout) > -1) {
      //       is = true;
      //     }
      //     if (type === 'contact' && ['contact.html'].indexOf(this.layout) > -1) {
      //       is = true;
      //     }
      //     if (type === 'single' && isSingle) {
      //       is = true;
      //     }
      //     if (type === 'amp' && isSingle && options.amp) {
      //       is = true;
      //     }

      //     return is ? opts.fn(this) : opts.inverse(this);
      // });

      // // output the contents of a file into the document
      // var inline = [];
      // Handlebars.registerHelper('inline', function(url) {
      //     if (typeof inline[url] !== 'string') {
      //         try {
      //             inline[url] = fs.readFileSync(options.dest + '/' + url).toString();
      //         } catch(e) {
      //             inline[url] = '';
      //         }
      //     }
      //     return new Handlebars.SafeString(inline[url]);
      // });

      // // write absolute URLs
      // Handlebars.registerHelper('site_url', function(url) {
      //     if (typeof url !== 'string') return options.metadata.site_url + '/';
      //     if (url.length > 0 && url.lastIndexOf('.') == -1) {
      //         url += '/';
      //     }
      //     return options.metadata.site_url + '/' + url;
      // });

      // // date formatting with Moment.js
      // Handlebars.registerHelper('moment', function(context, format) {
      //     if (!context) context = new Date();
      //     if (format === 'ISO') return Moment(context).toISOString();
      //     return Moment(context).format(format);
      // });

      // // format meta content for <title>
      // Handlebars.registerHelper('page_title', function(context, opts) {
      //     if (this.layout === 'index.html') {
      //         return new Handlebars.SafeString(this.site_name);// + ' &#8211; ' + this.site_desc);
      //     }
      //     var title = this.title;
      //     if (!title) {
      //         if (this.layout === 'archive.html') {
      //             title = 'Blog';
      //             if (this.pagination.num > 1) {
      //                 title += ' (Page ' + this.pagination.num + ')';
      //             }
      //         }
      //     }
      //     title += ' &#8211; ' + this.site_name;
      //     // if (!this.amp) {
      //     //     title += ' &#8211; ' + this.site_desc;
      //     // }
      //     return new Handlebars.SafeString(title);
      // });

      // function post__excerpt(contents)
      // {
      //     if (typeof contents !== 'string') return '';
      //     var text = striptags(contents),
      //         words = text.split(' ');
      //     if (words.length >= 55) {
      //         text = words.slice(0, 55).join(' ') + ' [&hellip;]';
      //     }
      //     return new Handlebars.SafeString('<p>' + text + '</p>');
      // }

      // // create post excerpt from content similar to WordPress
      // Handlebars.registerHelper('post__excerpt', post__excerpt);

      // // format post title to avoid orphans
      // Handlebars.registerHelper('post__title', function(title) {
      //     var pos, words = title.split(' ');
      //     if (words.length > 3 && words[words.length - 1].length < 9) {
      //         pos = title.lastIndexOf(' ');
      //         title = title.substr(0, pos) + '<span class="nbsp">&nbsp;</span>' + title.substr(pos + 1);
      //     }
      //     return new Handlebars.SafeString(title);
      // });

      // // mark file being watched
      // if (options.watch) {
      //     options.watching = options.watching.replace(new RegExp('^' + options.src + '\/'), '');
      //     options.watching = options.watching.replace(/^src-templates\//, '');
      //     metalsmith.use(function(files, metalsmith, done) {
      //         Object.keys(files).forEach(function(file) {
      //             if (file === options.watching || files[file].template === options.watching) {
      //                 files[file].watching = true;
      //             }
      //         });
      //         done();
      //     });
      // }

      // metalsmith.use(ms_drafts(true))

      //     .use(ms_db_markup(options))

      //     .use(msMarkdown({
      //         smartypants: true
      //     }))

      //     // AMP pages (if option is enabled)
      //     .use( options.amp ? ms_branch(changed).use( ms_branch('amp/*.html').use( ms_db_ampify({}) ) ) : ms_db_noop({ }) )

      //     // metadata for RSS feed
      //     .use(ms_branch(changed).use(function (files, metalsmith, done) {
      //         for (var file in files) {
      //             if (!/.html/.test(path.extname(file))) {
      //                 continue;
      //             }
      //             files[file].rss_content = post__excerpt(files[file].contents.toString());
      //         }
      //         done();
      //     }))

      //     .use(msCollections({
      //         latest: {
      //             pattern: 'blog/*.html',
      //             sortBy: 'date',
      //             reverse: true,
      //             limit: 6
      //         },
      //         blog: {
      //             pattern: 'blog/*.html',
      //             sortBy: 'date',
      //             reverse: true
      //         }
      //     }))

      //     .use(msPagination({
      //         'collections.blog': {
      //             first: 'blog/index.html',
      //             path: 'blog/page/:num/index.html',
      //             layout: 'archive.html',
      //             perPage: 7
      //         }
      //     }))

      //     // top-level pages use basic slug
      //     .use(ms_branch('*.html').use(msPermalinks({
      //             pattern: ':slug',
      //             relative: false
      //         }))
      //     )

      //     // nested pages include parent slug (exclude blog posts)
      //     .use(ms_branch('!blog/*.html')
      //         .use(ms_branch('!amp/*.html')
      //         .use(ms_branch('*/*.html')
      //         .use(ms_branch('!index.html')
      //             .use(msPermalinks({
      //                 pattern: ':parent/:slug'
      //             }))
      //         )))
      //     )

      //     // blog posts include date slug
      //     .use(ms_branch('blog/*.html')
      //         .use(ms_branch('!index.html')
      //             .use(msPermalinks({
      //                 pattern: ':date/:slug',
      //                 date: 'YYYY/MM/DD',
      //                 relative: false
      //             }))
      //         )
      //     )

      //     // blog have alternative AMP version
      //     .use(ms_branch('amp/*.html').use(msPermalinks({
      //             pattern: ':date/:slug/amp',
      //             date: 'YYYY/MM/DD',
      //             relative: false
      //         }))
      //     )

      //     // blog pages use basic slug
      //     .use(ms_branch('blog/page/*/index.html').use(msPermalinks({
      //             pattern: ':slug',
      //             relative: false
      //         }))
      //     )

      //     // update canonical for AMP alternatives
      //     .use(function (files, metalsmith, done) {
      //         for (var file in files) {
      //             if (files[file].amp !== true) continue;
      //             files[file].canonical = files[file].path.replace(/\/amp$/, '');
      //         }
      //         done();
      //     })

      //     .use(ms_branch(changed).use(msLayouts({
      //         engine: 'handlebars',
      //         directory: 'src-templates',
      //         partials: 'src-templates/partials'
      //     })))

      // ;

      // // remove all files that aren't being watched
      // if (options.watch) {
      //     metalsmith.use(function(files, metalsmith, done) {
      //         Object.keys(files).forEach(function(file) {
      //             if (files[file].watching) {
      //                 // keep
      //             } else {
      //                 delete files[file];
      //             }
      //         })jj;
      //         done();
      //     });
      // } else {

      //     metalsmith.use(ms_db_sitemap({ }));
      //     grunt.log.writeln('Building XML sitemap...');

      //     metalsmith.use(ms_feed({
      //         author: 'David Bushell',
      //         webMaster: 'hi@dbushell.com (David Bushell)',
      //         title: 'dbushell.com',
      //         description: 'David Bushell’s Web Design & Front-end Development Blog',
      //         language: 'en',
      //         site_url: options.metadata.site_url,
      //         destination: 'rss.xml',
      //         collection: 'blog',
      //         postDescription: function(file) {
      //             return file.rss_content || '';
      //         }
      //     }));
      //     grunt.log.writeln('Building RSS feed...');
      // }

      // metalsmith.build(function(err) {
      //     if (err) {
      //         done(err);
      //         return;
      //     }
      //     grunt.log.writeln('Built files in ' + metalsmith.source() + ' to ' + metalsmith.destination());
      //     done();
      // });
    })
}
