'use strict'

require('es6-promise').polyfill()
gulp = require('gulp')
uglify = require('gulp-uglify')
source = require('vinyl-source-stream')
browserify = require('browserify')
watchify = require('watchify')
reactify = require('reactify')
streamify = require('gulp-streamify')
gutil = require('gulp-util')
notify = require('gulp-notify')
rename = require('gulp-rename')
sass = require('gulp-sass')
concatCss = require('gulp-concat-css')
babelify = require('babelify')
livereload = require('gulp-livereload')
exec = require('child_process').exec
htmlreplace = require('gulp-html-replace')
autoprefixer = require('gulp-autoprefixer')
jade = require('gulp-jade')
globby = require('globby')

paths =
  BUILD: './build/'
  SRC_HTML: 'index.jade'
  BUILD_HTML: './build/index.html'
  SASS: 'app/css/*.scss'
  JADE: 'app/views/*.jade'
  ENTRY: 'app/jsx/app.jsx'


handleErrors = ->
  args = Array.prototype.slice.call(arguments)
  notify.onError( (error) ->
    title: 'Compile Error',
    message: '<%= error.message %>'
  ).apply(this, args)
  this.emit('end') # Keep gulp from hanging on this task


buildWatchScript = (file) ->
  console.log(file)
  props =
    entries: [file]
    debug : true
    extensions: ['.jsx']

  bundler = browserify(props)
    .plugin(watchify, { ignoreWatch: ['**/node_modules/**'] })
    .transform(babelify, { presets: ['es2015', 'react'] })

  rebundle = ->
    bundler.bundle()
    .on('error', handleErrors)
    .pipe(source(file))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(paths.BUILD))
    .pipe(livereload())

  bundler.on('update', ->
    rebundle()
    gutil.log('Rebundle...')
  )

  rebundle()

gulp.task('server',  (cb) ->
  exec('node server.js', (err, stdout, stderr) ->
    console.log(stdout)
    console.log(stderr)
    cb(err)
  )
)

gulp.task('copy', ->
  YOUR_LOCALS = {}
  gulp.src(paths.SRC_HTML)
  .pipe(jade(
    locals: YOUR_LOCALS
  ))
  .pipe(gulp.dest(paths.BUILD))
)

gulp.task('sass', ->
  gulp.src(paths.SASS)
  .pipe(sass())
  .pipe(autoprefixer(
    browsers: ['last 2 versions']
    cascade: false
  ))
  .pipe(concatCss('style.css'))
  .pipe(gulp.dest(paths.BUILD))
  .pipe(livereload())
)

gulp.task('watch', ->
  livereload.listen() #Make sure to install live reload chrome extension
  gulp.watch(paths.SASS, ['sass'])
  gulp.watch(paths.JADE, ['templates'])
  buildWatchScript(paths.ENTRY)
)

gulp.task('replaceHTML', ->
  gulp.src(paths.BUILD_HTML)
  .pipe(htmlreplace(
    'css': 'style.css'
    'js': 'bundle.js'
  ))
  .pipe(gulp.dest(paths.BUILD))
)

gulp.task('templates', ->
  YOUR_LOCALS = {}
  gulp.src(paths.JADE)
  .pipe(jade(
    locals: YOUR_LOCALS
  ))
  .pipe(gulp.dest(paths.BUILD))
)

gulp.task('default', ['sass', 'templates', 'watch', 'copy', 'replaceHTML', 'server'])
