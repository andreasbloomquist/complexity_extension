var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('default', ['process-scripts'], function() {
  console.log('Running Gulp tasks!')
});

gulp.task('process-scripts', function(){
  console.log('Beginning scripts task');
  return gulp.src('src/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dest/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dest/scripts'))
    console.log('Scripts task complete');
});

gulp.task('watch', function(e){
  gulp.watch('src/scripts/*.js', ['process-scripts'])
});
