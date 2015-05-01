gulp 			 = require 'gulp'
plumber 	 = require 'gulp-plumber'
coffee 		 = require 'gulp-coffee'
stylus  	 = require 'gulp-stylus'
gutil 	   = require 'gulp-util'
concat 	   = require 'gulp-concat'
browserify = require 'gulp-browserify'
clean	     = require 'gulp-clean'
rename 		 = require 'gulp-rename' 
nib 			 = require 'nib'
 
gulp.task 'compile:angular', ->
	gulp.src [ './app/angular/*.coffee' ], { read: true }
		.pipe plumber()
		.pipe coffee { bare : true }
		.pipe gulp.dest './public/angular' 

gulp.task 'compile:resources', ->
	gulp.src [ './app/resources/*.coffee' ], { read: true }
		.pipe plumber()
		.pipe coffee { bare : true }
		.pipe gulp.dest './public/js' 

gulp.task 'compile:stylus', ->
	gulp.src [ './app/stylesheets/*.styl', '!./app/stylesheets/fonts.styl' ]
		.pipe plumber()
		.pipe stylus use : [ nib() ], errors : true
		.pipe gulp.dest('./public/stylesheets')

gulp.task 'browserify:coffee', ->
	gulp.src('app/angular/app.coffee', { read : false })
		.pipe plumber()
		.pipe(browserify({
			transform : [ 'coffeeify' ],
			extensions : [ '.coffee' ]
			}))
		.pipe(rename('app.js'))
		.pipe(gulp.dest('./public/js'))

gulp.task 'watch', ->
	gulp.watch ['./app/angular/*.coffee', './app/angular/**/*.coffee' ], [ 'browserify:coffee' ] 
#	gulp.watch './app/angular/*.coffee', [ 'compile:angular' ] 
	gulp.watch './app/resources/*.coffee', [ 'compile:resources' ] 
	gulp.watch './app/stylesheets/*.styl', [ 'compile:stylus' ] 

gulp.task 'default', [ 'browserify:angular', 'compile:resources', 'compile:stylus', 'watch' ]