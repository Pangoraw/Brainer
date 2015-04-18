gulp 	= require 'gulp'
plumber = require 'gulp-plumber'
coffee 	= require 'gulp-coffee'
stylus  = require 'gulp-stylus'
nib 	= require 'nib'
 
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


gulp.task 'watch', ->
	gulp.watch './app/angular/*.coffee', [ 'compile:angular' ] 
	gulp.watch './app/resources/*.coffee', [ 'compile:resources' ] 
	gulp.watch './app/stylesheets/*.styl', [ 'compile:stylus' ] 

gulp.task 'default', [ 'compile:angular', 'compile:resources', 'compile:stylus', 'watch' ]