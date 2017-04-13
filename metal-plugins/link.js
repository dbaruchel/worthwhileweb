'use strict'
var path = require('path')
/**
 * Factory to build middleware for Metalsmith.
 *
 * @param {Object} options
 * @return {Function}
 */
module.exports = function (options) {
  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      files[file].link = function (filePath = null) {
        if (filePath) return path.join(files[file].rootPath, filePath)
        return path.join(files[file].rootPath, files[file].path)
      }
    })
    done()
  }
}
