// Generated by CoffeeScript 1.8.0
var browserify, coffee, gulp, nib, plumber, rename, stylus;

gulp = require('gulp');

plumber = require('gulp-plumber');

coffee = require('gulp-coffee');

stylus = require('gulp-stylus');

browserify = require('gulp-browserify');

rename = require('gulp-rename');

nib = require('nib');

gulp.task('compile:angular', function() {
  return gulp.src(['./app/angular/*.coffee'], {
    read: true
  }).pipe(plumber()).pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./public/angular'));
});

gulp.task('compile:resources', function() {
  return gulp.src(['./app/resources/*.coffee'], {
    read: true
  }).pipe(plumber()).pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./public/js'));
});

gulp.task('compile:stylus', function() {
  return gulp.src(['./app/stylesheets/style.styl']).pipe(plumber()).pipe(stylus({
    use: [nib()],
    errors: true
  })).pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('coffee:browserify', function() {
  return gulp.src('app/angular/app.coffee', {
    read: false
  }).pipe(plumber()).pipe(browserify({
    transform: ['coffeeify'],
    extensions: ['.coffee']
  })).pipe(rename('app.js')).pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {
  gulp.watch(['./app/angular/*.coffee', './app/angular/**/*.coffee'], ['coffee:browserify']);
  gulp.watch('./app/resources/*.coffee', ['compile:resources']);
  return gulp.watch('./app/stylesheets/*.styl', ['compile:stylus']);
});

gulp.task('default', ['coffee:browserify', 'compile:resources', 'compile:stylus', 'watch']);
